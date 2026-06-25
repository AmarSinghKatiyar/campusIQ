import { Trophy } from "lucide-react";
import { PlaceholderView } from "./PlaceholderView";

export function RankingsView() {
  return (
    <PlaceholderView
      title="Student Rankings"
      desc="AI-powered ranking system based on CGPA, aptitude scores, communication, and project portfolio."
      icon={<Trophy size={28} />}
    />
  );
}
