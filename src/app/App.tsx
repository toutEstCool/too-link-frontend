import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ProtectedRoute, PublicOnlyRoute } from './providers/AuthGuard';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import CreateSubscriberPage from '@/pages/create-subscriber';
import SubscribersPage from '@/pages/subscribers';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <DashboardPage />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribers"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <SubscribersPage />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribers/create"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <CreateSubscriberPage />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;

