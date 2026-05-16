export default function Badge({ label, colorClass = "bg-gray-100 text-gray-700" }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
