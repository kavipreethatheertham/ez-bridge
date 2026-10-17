import './StatsRow.css'

/** The four summary tiles at the top of the sheet. `tone` is '', 'ok' (green) or 'warn' (amber). */
export default function StatsRow({ stats }) {
  return (
    <div className="stats" role="group" aria-label="Sheet summary">
      {stats.map((stat) => (
        <div key={stat.id} className={`stat${stat.tone ? ` ${stat.tone}` : ''}`}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
