import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateQuotePage } from './pages/CreateQuotePage';
import { QuoteHistoryPage } from './pages/QuoteHistoryPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { QuoteBasicInfoPage } from './pages/QuoteBasicInfoPage';
import { QuoteProductionPage } from './pages/QuoteProductionPage';
import { QuoteAdvancedPage } from './pages/QuoteAdvancedPage';
import { QuoteReviewPage } from './pages/QuoteReviewPage';
import { Button } from './components/ui/button';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold">VID-QUO</Link>
              <div className="flex gap-4">
                <Link to="/">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link to="/create-quote">
                  <Button variant="ghost">Create Quote</Button>
                </Link>
                <Link to="/history">
                  <Button variant="ghost">History</Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost">Settings</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile?.full_name}
              </span>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote"
        element={
          <ProtectedRoute>
            <CreateQuotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote/basic"
        element={
          <ProtectedRoute>
            <QuoteBasicInfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote/production"
        element={
          <ProtectedRoute>
            <QuoteProductionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote/advanced"
        element={
          <ProtectedRoute>
            <QuoteAdvancedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote/review"
        element={
          <ProtectedRoute>
            <QuoteReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <QuoteHistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AccountSettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  console.log('App rendering');
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};
