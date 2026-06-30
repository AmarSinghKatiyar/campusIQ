export function InputField({ label, name, type = "text", placeholder, icon, form, setValue }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          type={type}
          value={form[name] || ""}
          onChange={(e) => setValue(name, e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-sm outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
