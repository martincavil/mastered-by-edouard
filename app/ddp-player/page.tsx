import { redirect } from "next/navigation";

// The DDP player now lives in the "ddp reader" tab of /send-files
export default function DdpPlayerPage() {
  redirect("/send-files?tab=ddp-reader");
}
