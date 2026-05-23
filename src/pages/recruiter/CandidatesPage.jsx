import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import StaffLayout from '../../components/layout/StaffLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SearchableCombobox from '../../components/ui/SearchableCombobox';
import { hiringApi } from '../../api';

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { data: candidates, refetch, isFetching } = useQuery({
    queryKey: ['hiring-search', search, skills],
    queryFn: () =>
      hiringApi
        .search({
          search: search.trim() || undefined,
          skills: skills.trim() || undefined,
        })
        .then((r) => r.data.data),
    enabled: false,
  });

  const fetchCandidateOptions = useCallback(async (q) => {
    const { data } = await hiringApi.filterCandidates(q);
    return data.data;
  }, []);

  const fetchSkillOptions = useCallback(async (q) => {
    const { data } = await hiringApi.filterSkills(q);
    return data.data;
  }, []);

  const runSearch = () => {
    setHasSearched(true);
    refetch();
  };

  return (
    <StaffLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Talent Search</h1>
        <p className="mt-1 text-slate-600">
          Pick a candidate or skill from the dropdown, or type to filter the list as you search.
        </p>
      </div>

      <Card className="mb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <SearchableCombobox
            label="Search by name"
            value={search}
            onChange={setSearch}
            onSearch={fetchCandidateOptions}
            placeholder="Type name or email..."
            emptyMessage="No candidates in your pipeline"
          />
          <SearchableCombobox
            label="Filter by skill"
            value={skills}
            onChange={setSkills}
            onSearch={fetchSkillOptions}
            placeholder="Type a skill..."
            emptyMessage="No skills found"
          />
          <div className="flex items-end gap-2">
            <Button onClick={runSearch} loading={isFetching} className="flex-1">
              Search
            </Button>
            {(search || skills) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setSkills('');
                  setHasSearched(false);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {!hasSearched && (
          <p className="text-center text-slate-500 py-8">
            Select filters above and click Search to view candidates.
          </p>
        )}
        {hasSearched && isFetching && (
          <p className="text-center text-slate-500 py-8">Searching...</p>
        )}
        {hasSearched && !isFetching && candidates?.length === 0 && (
          <p className="text-center text-slate-500 py-8">No candidates match your filters.</p>
        )}
        {candidates?.map((c) => (
          <Card key={c.candidate?._id + (c.job?._id || '')}>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h3 className="font-semibold">{c.candidate?.name}</h3>
                <p className="text-sm text-slate-500">{c.candidate?.email}</p>
                {c.candidate?.title && (
                  <p className="text-xs text-slate-400">{c.candidate.title}</p>
                )}
                <p className="mt-1 text-sm">
                  Applied for: <span className="font-medium">{c.job?.title}</span>
                  {c.job?.company && <span className="text-slate-500"> at {c.job.company}</span>}
                </p>
                {c.resume?.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.resume.skills.slice(0, 8).map((s) => (
                      <span
                        key={s}
                        className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-600">{c.matchScore}%</p>
                <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 capitalize">
                  {c.stage?.replace(/_/g, ' ')}
                </span>
                {c.resume?.atsScore != null && (
                  <p className="text-xs text-slate-400 mt-1">ATS {c.resume.atsScore}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
