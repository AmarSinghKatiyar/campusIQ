import { Briefcase } from "lucide-react";
import { PlaceholderView } from "./PlaceholderView";

export function PlacementsView() {
  return (
    <PlaceholderView
      title="Placement Drives"
      desc="Create and manage company drives, interview schedules, selection rounds, and offer tracking."
      icon={<Briefcase size={28} />}
    />
  );
}
