import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import { candidateLinks } from '../../utils/navLinks';
import { resumeApi } from '../../api';
import toast from 'react-hot-toast';

export default function ResumeUploadPage() {
  const fileRef = useRef();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => resumeApi.upload(file),
    onSuccess: () => {
      toast.success('Resume uploaded! Parsing in progress...');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setSelected(null);
      if (fileRef.current) fileRef.current.value = '';
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  });

  const handleUpload = () => {
    if (!selected) return toast.error('Select a file first');
    uploadMutation.mutate(selected);
  };

  return (
    <DashboardLayout links={candidateLinks}>
      <h1 className="mb-6 text-2xl font-bold">Resume Management</h1>

      <Card title="Upload Resume" className="mb-8">
        <p className="mb-4 text-sm text-slate-600">PDF or DOC/DOCX, max 5MB</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setSelected(e.target.files[0])}
          className="block w-full text-sm"
        />
        <Button className="mt-4" onClick={handleUpload} loading={uploadMutation.isPending}>
          Upload & Analyze
        </Button>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : resumes?.length ? (
          resumes.map((resume) => (
            <Card key={resume._id} title={resume.fileName || resume.title}>
              <div className="flex items-start gap-6">
                {resume.atsAnalysis?.score != null && (
                  <ScoreRing score={resume.atsAnalysis.score} size={90} />
                )}
                <div className="flex-1">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    resume.status === 'ready' ? 'bg-green-100 text-green-700' :
                    resume.status === 'parsing' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {resume.status}
                  </span>
                  {resume.parsedData?.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {resume.parsedData.skills.slice(0, 8).map((s) => (
                        <span key={s} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{s}</span>
                      ))}
                    </div>
                  )}
                  {resume.atsAnalysis?.improvementTips?.[0] && (
                    <p className="mt-3 text-sm text-slate-600">{resume.atsAnalysis.improvementTips[0]}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-slate-500 col-span-2">No resumes yet. Upload your first resume above.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
