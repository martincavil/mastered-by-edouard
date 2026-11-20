"""Builds a minimal DDP 2.0 test set for /ddp-player.

Usage: python3 scripts/make-test-ddp.py OUT_DIR [little|big] [duration_scale]

Track 1: 2 s pregap (index 00) + 6 s 440 Hz
Track 2: 1.5 s pause (index 00) + 5 s 330 Hz sine
Track 3: no pause, the 330 Hz sine continues without phase break (gapless test), 4 s
Files: DDPID, DDPMS, PQDESCR, CDTEXT.BIN, IMAGE.DAT, checksum.md5
"""
import hashlib, math, os, struct, sys

out = sys.argv[1]
endian = sys.argv[2] if len(sys.argv) > 2 else "little"
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
os.makedirs(out, exist_ok=True)
SR, SPS = 44100, 588


def sectors(sec):
    return int(round(sec * 75 * scale))


def sine(freq, n, phase0=0.0):
    return [0.4 * math.sin(phase0 + 2 * math.pi * freq * i / SR) for i in range(n)]


t1_pre, t1_len, t2_pre, t2_len, t3_len = sectors(2), sectors(6), sectors(1.5), sectors(5), sectors(4)
n2 = t2_len * SPS
samples = [0.0] * (t1_pre * SPS) + sine(440, t1_len * SPS) + [0.0] * (t2_pre * SPS)
samples += sine(330, n2) + sine(330, t3_len * SPS, 2 * math.pi * 330 * n2 / SR)

fmt = "<hh" if endian == "little" else ">hh"
img = b"".join(struct.pack(fmt, int(v * 32767), int(v * 32767) // 2) for v in samples)
open(os.path.join(out, "IMAGE.DAT"), "wb").write(img)
total = len(img) // 2352


def pad(s, n):
    s = str(s)
    assert len(s) <= n
    return s.ljust(n).encode("ascii")


def num(v, n):
    return str(v).zfill(n).encode("ascii")


open(os.path.join(out, "DDPID"), "wb").write(
    (pad("DDP 2.00", 8) + pad("3700187654321", 13) + pad("", 16) + pad("TEST MASTER", 48)).ljust(128, b" ")
)


def map_packet(dst, dsl, dss, sub, cdm, ssm, dsi, ofs=None, dsp=None):
    blank = lambda n: pad("", n)
    p = b"VVVM" + pad(dst, 2) + (num(dsp, 8) if dsp is not None else blank(8))
    p += (num(dsl, 8) if dsl is not None else blank(8)) + (num(dss, 8) if dss is not None else blank(8))
    p += pad(sub, 8) + pad(cdm, 2) + pad(ssm, 1) + blank(1) + blank(12) + blank(1) + blank(4) + blank(12)
    p += num(17, 3) + pad(dsi, 17) + blank(1) + blank(4) + blank(8)
    p += (num(ofs, 9) if ofs is not None else blank(9)) + blank(15)
    assert len(p) == 128
    return p


ms = map_packet("D0", total, 0, "", "DA", "0", "IMAGE.DAT", ofs=0, dsp=0)
ms += map_packet("S0", 6 * 64, None, "PQ DESCR", "", "", "PQDESCR")
ms += map_packet("S0", None, None, "CDTEXT", "", "", "CDTEXT.BIN")
open(os.path.join(out, "DDPMS"), "wb").write(ms)


def pq(track, index, sector, isrc="", upc=""):
    s = sector // 75
    e = b"VVVS" + pad(track, 2) + num(index, 2) + num(0, 2) + num(s // 60, 2) + num(s % 60, 2) + num(sector % 75, 2)
    e += pad("00", 2) + pad("", 2) + pad(isrc, 12) + pad(upc, 13) + pad("", 19)
    assert len(e) == 64
    return e


t2_0 = t1_pre + t1_len
t2_1 = t2_0 + t2_pre
t3_1 = t2_1 + t2_len
lead_out = t3_1 + t3_len
assert lead_out == total
open(os.path.join(out, "PQDESCR"), "wb").write(
    pq("01", 0, 0, upc="3700187654321") + pq("01", 1, t1_pre, "FRZ032400001") + pq("02", 0, t2_0)
    + pq("02", 1, t2_1, "FRZ032400002") + pq("03", 1, t3_1, "FRZ032400003") + pq("AA", 1, lead_out)
)


def crc16(data):
    crc = 0
    for b in data:
        crc ^= b << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021 if crc & 0x8000 else crc << 1) & 0xFFFF
    return crc ^ 0xFFFF


packs, seq = [], [0]


def add_pack(body):
    packs.append(body + struct.pack(">H", crc16(body)))
    seq[0] += 1


def text_packs(ptype, strings):
    data = b"".join(s.encode("latin1") + b"\0" for s in strings)
    starts, acc = [], 0
    for s in strings:
        starts.append(acc)
        acc += len(s.encode("latin1")) + 1
    for off in range(0, len(data), 12):
        tr = max(i for i, st in enumerate(starts) if st <= off)
        add_pack(bytes([ptype, tr, seq[0], min(15, off - starts[tr])]) + data[off:off + 12].ljust(12, b"\0"))


text_packs(0x80, ["Nuit Blanche (Test DDP)", "Ouverture", "Lumières", "Lumières (suite)"])
text_packs(0x81, ["Les Étoiles Filantes", "Les Étoiles Filantes", "\t", "\t"])
for i in range(3):  # size info packs, char code 0x00 = ISO-8859-1
    add_pack(bytes([0x8F, i, seq[0], 0]) + (bytes([0, 1, 3]) + bytes(9) if i == 0 else bytes(12)))
open(os.path.join(out, "CDTEXT.BIN"), "wb").write(b"".join(packs))

with open(os.path.join(out, "checksum.md5"), "w") as f:
    for n in ["DDPID", "DDPMS", "PQDESCR", "CDTEXT.BIN", "IMAGE.DAT"]:
        f.write(hashlib.md5(open(os.path.join(out, n), "rb").read()).hexdigest() + " *" + n + "\n")
print("ok", out, total, "sectors")
