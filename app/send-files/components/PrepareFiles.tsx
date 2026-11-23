"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";

interface PrepareFilesProps {
  onBack: () => void;
}

// Small illustrations of the 4 cards (mockup "mastering starts with a good mix.")
function Waveform() {
  const bars = [6, 14, 22, 30, 18, 34, 26, 40, 22, 36, 28, 44, 24, 38, 30, 20, 34, 16, 26, 10, 18, 6];
  return (
    <svg viewBox="0 0 220 50" className="w-full max-w-[220px] h-12" aria-hidden="true">
      <line x1="0" y1="25" x2="220" y2="25" stroke="currentColor" strokeWidth="2" />
      {bars.map((h, i) => (
        <rect key={i} x={8 + i * 9.5} y={25 - h / 2} width="5" height={h} rx="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}

export function PrepareFiles({ onBack }: PrepareFilesProps) {
  const t = useTranslations();
  const l = t.sendFiles.prepareFiles;
  const [f16, f24, f32, wav, aif] = l.exportFormats;

  const illustrations = [
    <div key="audio" className="text-red flex justify-center">
      <Waveform />
    </div>,
    <div key="export" className="flex flex-col gap-2 items-start">
      <div className="flex gap-1.5">
        <span className="rounded-full border border-black/40 text-black/40 line-through px-4 py-1 text-xs font-bold">{f16}</span>
        <span className="rounded-full bg-red text-white px-4 py-1 text-xs font-bold">{f24}</span>
        <span className="rounded-full bg-red text-white px-3 py-1 text-xs font-bold">{f32}</span>
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-full border border-black px-4 py-1 text-xs font-bold">{wav}</span>
        <span className="rounded-full border border-black px-4 py-1 text-xs font-bold">{aif}</span>
      </div>
    </div>,
    <div key="naming" className="flex items-center gap-1 flex-wrap">
      {l.namingChips.map((chip, i) => (
        <span key={chip} className="flex items-center gap-1">
          {i > 0 && <span className="text-black/50">_</span>}
          <span className={`rounded-[6px] px-2 py-1 text-xs font-bold ${i === 1 ? "bg-red text-white" : "bg-[#E5E5E5] text-black"}`}>
            {chip}
          </span>
        </span>
      ))}
    </div>,
    <div key="stems" className="flex justify-center" aria-hidden="true">
      <div className="relative w-36 h-24">
        <span className="absolute left-0 top-1 w-[88px] h-[88px] rounded-full border border-black flex items-center pl-3 text-[10px] font-bold">
          {l.stemsLabels[0]}
        </span>
        <span className="absolute right-0 top-0 w-[90px] h-[90px] rounded-full bg-red text-white flex items-center justify-end pr-4 text-[10px] font-bold">
          {l.stemsLabels[1]}
        </span>
      </div>
    </div>,
  ];

  return (
    <div className="bg-red-dark rounded-[10px] p-5 md:p-6 xl:p-8 mdshort:p-5 h-full min-h-0 flex flex-col gap-4 xl:gap-6 mdshort:gap-3 overflow-y-auto [&>*]:animate-fade-in">
      <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl mdshort:text-4xl font-bold leading-none shrink-0">
        <span className="text-white">{l.headline1}</span>{" "}
        <span className="text-red">{l.headline2}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-6 flex-1 shrink-0">
        {l.cards.map((card, i) => (
          <div key={card.title} className="bg-white rounded-[10px] p-3 xl:p-4 flex flex-col">
            <div className="flex items-end justify-between px-1 xl:px-2 pb-2 xl:pb-3 border-b border-black/30">
              <span className="text-4xl xl:text-5xl mdshort:text-4xl font-bold text-red leading-none">{i + 1}.</span>
              <span className="text-2xl xl:text-3xl mdshort:text-2xl font-bold text-black leading-none">{card.title}</span>
            </div>
            <div className="py-4 xl:py-6 min-h-[70px] xl:min-h-[100px] mdshort:py-3 mdshort:min-h-[70px] flex items-center justify-center">
              {illustrations[i]}
            </div>
            <ul className="list-disc pl-6 pr-2 space-y-3 mdshort:space-y-2 text-black text-sm xl:text-base 2xl:text-lg mdshort:text-sm font-light leading-tight">
              {card.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="bg-black text-white font-bold text-lg xl:text-2xl mdshort:text-lg rounded-full px-10 py-2 xl:py-2.5 mdshort:py-1.5 hover:bg-white hover:text-black transition-colors duration-300"
        >
          {l.back}
        </button>
      </div>
    </div>
  );
}
