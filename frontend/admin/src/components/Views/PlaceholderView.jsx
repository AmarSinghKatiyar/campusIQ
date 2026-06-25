import { COLORS } from "../../constants/colors";

export function PlaceholderView({ title, desc, icon }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${COLORS.INDIGO}12`, color: COLORS.INDIGO }}
        >
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        <button
          className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: COLORS.INDIGO }}
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}
