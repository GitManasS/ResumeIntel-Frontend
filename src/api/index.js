import client from './client';

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
  me: () => client.get('/auth/me'),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (data) => client.post('/auth/reset-password', data),
};

export const resumeApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    // Let axios set Content-Type with boundary — manual multipart header breaks uploads
    return client.post('/resumes/upload', formData);
  },
  list: (params) => client.get('/resumes', { params }),
  get: (id) => client.get(`/resumes/${id}`),
  delete: (id) => client.delete(`/resumes/${id}`),
  setPrimary: (id) => client.patch(`/resumes/${id}/primary`),
  reanalyze: (id, data) => client.post(`/resumes/${id}/reanalyze`, data),
};

export const jdMatchApi = {
  create: (data) => client.post('/jd-match', data),
  list: (params) => client.get('/jd-match', { params }),
  get: (id) => client.get(`/jd-match/${id}`),
};

export const interviewApi = {
  generate: (data) => client.post('/interview/generate', data),
  list: (params) => client.get('/interview', { params }),
  get: (id) => client.get(`/interview/${id}`),
};

export const jobApi = {
  list: (params) => client.get('/jobs', { params }),
  get: (id) => client.get(`/jobs/${id}`),
  create: (data) => client.post('/jobs', data),
  myJobs: (params) => client.get('/jobs/recruiter/mine', { params }),
  myApplications: () => client.get('/jobs/candidate/applications'),
  apply: (id, resumeId) => client.post(`/jobs/${id}/apply`, { resumeId }),
  rank: (id) => client.post(`/jobs/${id}/rank`),
  shortlist: (jobId, candidateId) =>
    client.post(`/jobs/${jobId}/shortlist/${candidateId}`),
  searchCandidates: (params) =>
    client.get('/jobs/recruiter/candidates/search', { params }),
  update: (id, data) => client.put(`/jobs/${id}`, data),
  delete: (id) => client.delete(`/jobs/${id}`),
};

export const analyticsApi = {
  candidate: () => client.get('/analytics/candidate'),
  recruiter: () => client.get('/analytics/recruiter'),
  admin: () => client.get('/analytics/admin'),
};

export const notificationApi = {
  list: (params) => client.get('/notifications', { params }),
  markRead: (id) => client.patch(`/notifications/${id}/read`),
  markAllRead: () => client.patch('/notifications/read-all'),
};

export const pipelineApi = {
  getBoard: (params) => client.get('/pipeline/board', { params }),
  moveStage: (id, data) => client.patch(`/pipeline/${id}/stage`, data),
  assignOwner: (id, ownerId) => client.patch(`/pipeline/${id}/owner`, { ownerId }),
};

export const hiringApi = {
  filterCandidates: (q) => client.get('/hiring/search/filters/candidates', { params: { q } }),
  filterSkills: (q) => client.get('/hiring/search/filters/skills', { params: { q } }),
  search: (params) => client.get('/hiring/search', { params }),
  analytics: () => client.get('/hiring/analytics'),
  auditLogs: (params) => client.get('/hiring/audit-logs', { params }),
  addNote: (applicationId, data) => client.post(`/hiring/applications/${applicationId}/notes`, data),
  getNotes: (applicationId) => client.get(`/hiring/applications/${applicationId}/notes`),
  getTimeline: (applicationId) => client.get(`/hiring/applications/${applicationId}/timeline`),
  scheduleInterview: (data) => client.post('/hiring/interviews', data),
  listInterviews: (params) => client.get('/hiring/interviews', { params }),
  listPools: () => client.get('/hiring/talent-pools'),
  createPool: (data) => client.post('/hiring/talent-pools', data),
  addToPool: (poolId, data) => client.post(`/hiring/talent-pools/${poolId}/candidates`, data),
};

export const careerApi = {
  getOrg: (slug) => client.get(`/careers/${slug}`),
  getJobs: (slug, params) => client.get(`/careers/${slug}/jobs`, { params }),
  getJob: (slug, jobId) => client.get(`/careers/${slug}/jobs/${jobId}`),
};

export const organizationApi = {
  list: () => client.get('/organizations'),
  get: (orgId) => client.get(`/organizations/${orgId}`),
  create: (data) => client.post('/organizations', data),
  update: (orgId, data) => client.patch(`/organizations/${orgId}`, data),
  listMembers: (orgId) => client.get(`/organizations/${orgId}/members`),
  addMember: (orgId, data) => client.post(`/organizations/${orgId}/members`, data),
  updateMember: (orgId, userId, data) =>
    client.patch(`/organizations/${orgId}/members/${userId}`, data),
  removeMember: (orgId, userId) => client.delete(`/organizations/${orgId}/members/${userId}`),
};
