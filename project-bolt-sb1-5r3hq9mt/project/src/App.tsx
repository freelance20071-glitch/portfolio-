import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AdminLogin from '@/pages/admin/AdminLogin';
import ProtectedRoute from '@/pages/admin/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ProjectDetailsPage = lazy(() => import('@/pages/public/ProjectDetailsPage'));
const DashboardOverview = lazy(() => import('@/pages/admin/DashboardOverview'));
const ProjectsAdmin = lazy(() => import('@/pages/admin/ProjectsAdmin'));
const SkillsAdmin = lazy(() => import('@/pages/admin/SkillsAdmin'));
const ServicesAdmin = lazy(() => import('@/pages/admin/ServicesAdmin'));
const TestimonialsAdmin = lazy(() => import('@/pages/admin/TestimonialsAdmin'));
const ExperienceAdmin = lazy(() => import('@/pages/admin/ExperienceAdmin'));
const MessagesAdmin = lazy(() => import('@/pages/admin/MessagesAdmin'));
const ProfileAdmin = lazy(() => import('@/pages/admin/ProfileAdmin'));
const SettingsAdmin = lazy(() => import('@/pages/admin/SettingsAdmin'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-800" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950">
      <p className="text-6xl font-bold text-primary">404</p>
      <p className="text-slate-500">Page not found</p>
      <a href="/" className="btn-outline">Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />

              {/* Admin login */}
              <Route path="/admin" element={<AdminLogin />} />
              {/* Admin dashboard (protected) */}
              <Route
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<DashboardOverview />} />
                <Route path="/admin/projects" element={<ProjectsAdmin />} />
                <Route path="/admin/skills" element={<SkillsAdmin />} />
                <Route path="/admin/experience" element={<ExperienceAdmin />} />
                <Route path="/admin/services" element={<ServicesAdmin />} />
                <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
                <Route path="/admin/messages" element={<MessagesAdmin />} />
                <Route path="/admin/profile" element={<ProfileAdmin />} />
                <Route path="/admin/settings" element={<SettingsAdmin />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
