export default function AnalyticsTooltip({ active, payload, label, theme, valueLabel = 'Score' }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border px-3 py-2 shadow-lg backdrop-blur-md"
      style={{
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      {label && <p className="mb-1 text-xs font-medium opacity-70">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold">
          {valueLabel}: <span style={{ color: entry.color || theme.primary }}>{entry.value}</span>
          {entry.payload?.label && (
            <span className="ml-1 text-xs font-normal opacity-70">({entry.payload.label})</span>
          )}
        </p>
      ))}
    </div>
  );
}
