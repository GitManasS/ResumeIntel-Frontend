import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import { candidateLinks } from '../../utils/navLinks';
import { useSocket } from '../../sockets/SocketProvider';
import { resumeApi } from '../../api';
import toast from 'react-hot-toast';

export default function ResumeUploadPage() {
  const fileRef = useRef();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [selected, setSelected] = useState(null);

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
    refetchInterval: (query) => {
      const list = query.state.data;
      const parsing = list?.some((r) => r.status === 'parsing' || r.status === 'uploading');
      return parsing ? 4000 : false;
    },
  });

  const isParsing = useMemo(
    () => resumes?.some((r) => r.status === 'parsing' || r.status === 'uploading'),
    [resumes]
  );

  useEffect(() => {
    if (!socket) return;

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['resumes'] });

    const onReady = (payload) => {
      toast.success(
        payload?.score != null
          ? `Resume ready — ATS score ${Math.round(payload.score)}%`
          : 'Resume analysis complete!'
      );
      refresh();
    };

    const onFailed = () => {
      toast.error('Resume parsing failed. Try a PDF or check server logs.');
      refresh();
    };

    socket.on('resume:ready', onReady);
    socket.on('resume:failed', onFailed);
    return () => {
      socket.off('resume:ready', onReady);
      socket.off('resume:failed', onFailed);
    };
  }, [socket, queryClient]);

  const uploadMutation = useMutation({
    mutationFn: (file) => resumeApi.upload(file),
    onSuccess: () => {
      toast.success('Resume uploaded! Parsing in progress…');
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

      {isParsing && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          Analyzing your resume… This usually takes under a minute.
        </div>
      )}

      <Card title="Upload Resume" className="mb-8">
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">PDF or DOC/DOCX, max 5MB</p>
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
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      resume.status === 'ready'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                        : resume.status === 'parsing' || resume.status === 'uploading'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : resume.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {resume.status === 'parsing' ? 'Parsing…' : resume.status}
                  </span>
                  {resume.status === 'failed' && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Analysis failed. Re-upload a PDF or contact support.
                    </p>
                  )}
                  {resume.parsedData?.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {resume.parsedData.skills.slice(0, 8).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {resume.atsAnalysis?.improvementTips?.[0] && (
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      {resume.atsAnalysis.improvementTips[0]}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-slate-500">No resumes yet. Upload your first resume above.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
