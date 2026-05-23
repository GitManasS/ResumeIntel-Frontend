import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../api';
import { setSelectedOrganization } from '../../features/org/orgSlice';

/** Redirect helper: sets org context from URL then opens recruiter workspace */
export default function OrgWorkspacePage() {
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: orgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationApi.list().then((r) => r.data.data),
  });

  useEffect(() => {
    const org = orgs?.find((o) => o._id === orgId);
    if (org) {
      dispatch(
        setSelectedOrganization({
          id: org._id,
          name: org.name,
          slug: org.slug,
        })
      );
      navigate('/recruiter', { replace: true });
    }
  }, [orgs, orgId, dispatch, navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
      Opening organization workspace…
    </div>
  );
}
