import { Settings } from "lucide-react";
import { PlaceholderView } from "./PlaceholderView";

export function SettingsView() {
  return (
    <PlaceholderView
      title="Account Settings"
      desc="Manage your profile, notification preferences, institutional configuration, and integrations."
      icon={<Settings size={28} />}
    />
  );
}
