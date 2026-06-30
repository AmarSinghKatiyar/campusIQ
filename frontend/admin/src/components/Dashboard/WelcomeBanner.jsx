import { COLORS } from "../../constants/colors";
import authService from "../../services/authService";

export function WelcomeBanner() {
  const admin = authService.getAdmin();
  const firstName = admin?.name?.split(" ")[0] || "Admin";

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: `linear-gradient(120deg, #312E81 0%, ${COLORS.INDIGO} 50%, #7C3AED 100%)` }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 right-32 w-24 h-24 rounded-full opacity-10 bg-white translate-y-8" />
      <div className="relative z-10">
        <p className="text-indigo-200 text-sm font-medium mb-1">{formattedDate}</p>
        <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Good morning, {firstName} 👋
        </h1>
        <p className="text-indigo-200 text-sm">
          6 active placement drives · 3 interviews scheduled this week · 94% placement rate
        </p>
      </div>
    </div>
  );
}