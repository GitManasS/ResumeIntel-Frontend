import { formatSalary } from '../careers/JobListingCard';

const TYPE_LABELS = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export default function JobDetailContent({ job, primaryColor = '#3396fc' }) {
  const salary = formatSalary(job.salary);
  const primary = primaryColor;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <span className="career-badge">{TYPE_LABELS[job.employmentType] || job.employmentType}</span>
        {job.location && <span className="career-badge-muted">{job.location}</span>}
        {salary && <span className="career-badge-success">{salary}</span>}
        {job.organization?.name && (
          <span className="career-badge-muted">{job.organization.name}</span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {job.title}
      </h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{job.company}</p>

      {job.skills?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Key skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `rgb(var(--career-primary-rgb, 51 150 252) / 0.1)`,
                  color: primary,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">About the role</h2>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400">
          {job.description}
        </p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Requirements</h2>
          <ul className="mt-3 space-y-2">
            {job.requirements.map((req) => (
              <li key={req} className="flex gap-2 text-slate-600 dark:text-slate-400">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: primary }}
                />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
