import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
import Generate from '@/pages/Generate';
import Editor from '@/pages/Editor';
import AutoAnimate from '@/pages/AutoAnimate';
import ReviewPlayer from '@/pages/ReviewPlayer';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import BrandKit from '@/pages/settings/BrandKit';
import AdminPanel from '@/pages/settings/AdminPanel';
import ReviewScreen from '@/pages/library/ReviewScreen';
import BlendUI from '@/pages/library/BlendUI';
import PlanSelection from '@/pages/onboarding/PlanSelection';
import WorkspaceWizard from '@/pages/onboarding/WorkspaceWizard';
import OnboardingChecklist from '@/pages/onboarding/OnboardingChecklist';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  let auth;
  try {
    auth = useAuth();
  } catch (e) {
    // Clerk not initialized, allow for dev
    return <>{children}</>;
  }

  const { isSignedIn, isLoaded } = auth;
  // For development without Clerk, always allow
  if (!isLoaded && !isSignedIn) return <>{children}</>;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Workspace Routes */}
      <Route element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings/brand" element={<BrandKit />} />
        <Route path="/settings/admin" element={<AdminPanel />} />
      </Route>

      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />

      <Route path="/review/:token" element={<ReviewPlayer />} />

      <Route
        path="/auto-animate"
        element={
          <ProtectedRoute>
            <AutoAnimate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Generate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library/review/:id"
        element={
          <ProtectedRoute>
            <ReviewScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library/blend"
        element={
          <ProtectedRoute>
            <BlendUI />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/plan"
        element={
          <ProtectedRoute>
            <PlanSelection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/workspace"
        element={
          <ProtectedRoute>
            <WorkspaceWizard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/checklist"
        element={
          <ProtectedRoute>
            <OnboardingChecklist />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
