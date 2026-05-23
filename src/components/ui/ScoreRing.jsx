export default function ScoreRing({ score, size = 120, label, className = '' }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const color = score >= 80 ? '#3396fc' : score >= 60 ? '#f59e0b' : '#ef4444';
  const trackColor = 'currentColor';

  return (
    <div className={`relative inline-flex flex-col items-center text-slate-200 dark:text-slate-700 ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth="8"
          className="opacity-40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{score}%</span>
        {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
