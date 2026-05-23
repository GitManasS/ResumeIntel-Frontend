import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import ResumeUploadPage from '../pages/candidate/ResumeUploadPage';
import JDMatcherPage from '../pages/candidate/JDMatcherPage';
import InterviewPrepPage from '../pages/candidate/InterviewPrepPage';
import CandidateAnalyticsPage from '../pages/candidate/CandidateAnalyticsPage';
import CandidateJobsPage from '../pages/candidate/CandidateJobsPage';
import CandidateJobDetailPage from '../pages/candidate/CandidateJobDetailPage';
import MyApplicationsPage from '../pages/candidate/MyApplicationsPage';
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import JobPostingsPage from '../pages/recruiter/JobPostingsPage';
import CandidatesPage from '../pages/recruiter/CandidatesPage';
import RecruiterAnalyticsPage from '../pages/recruiter/RecruiterAnalyticsPage';
import PipelinePage from '../pages/recruiter/PipelinePage';
import CareerPortalPage from '../pages/careers/CareerPortalPage';
import CareerJobDetailPage from '../pages/careers/CareerJobDetailPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OrganizationsPage from '../pages/admin/OrganizationsPage';
import OrganizationDetailPage from '../pages/admin/OrganizationDetailPage';
import OrgWorkspacePage from '../pages/admin/OrgWorkspacePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/careers/:slug/jobs/:jobId" element={<CareerJobDetailPage />} />
      <Route path="/careers/:slug" element={<CareerPortalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/candidate"
        element={
          <ProtectedRoute candidateOnly>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute candidateOnly>
            <CandidateJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/jobs/:jobId"
        element={
          <ProtectedRoute candidateOnly>
            <CandidateJobDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute candidateOnly>
            <MyApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/resumes"
        element={
          <ProtectedRoute candidateOnly>
            <ResumeUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/jd-match"
        element={
          <ProtectedRoute candidateOnly>
            <JDMatcherPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/interview"
        element={
          <ProtectedRoute candidateOnly>
            <InterviewPrepPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/analytics"
        element={
          <ProtectedRoute candidateOnly>
            <CandidateAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter"
        element={
          <ProtectedRoute staffOnly permission="pipeline:view">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/pipeline"
        element={
          <ProtectedRoute staffOnly permission="pipeline:view">
            <PipelinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute staffOnly permission="jobs:view">
            <JobPostingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute staffOnly permission="candidates:search">
            <CandidatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/analytics"
        element={
          <ProtectedRoute staffOnly permission="analytics:org">
            <RecruiterAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute platformAdminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organizations"
        element={
          <ProtectedRoute platformAdminOnly>
            <OrganizationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organizations/:orgId"
        element={
          <ProtectedRoute platformAdminOnly>
            <OrganizationDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/org/:orgId"
        element={
          <ProtectedRoute platformAdminOnly>
            <OrgWorkspacePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
