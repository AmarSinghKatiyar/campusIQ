import { Users } from "lucide-react";
import { PlaceholderView } from "./PlaceholderView";

export function StudentsView() {
  return (
    <PlaceholderView
      title="Student Management"
      desc="View, filter, and manage all student profiles, eligibility status, and placement history."
      icon={<Users size={28} />}
    />
  );
}
