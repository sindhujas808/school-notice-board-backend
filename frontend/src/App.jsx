import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import PublicNoticeBoard from './pages/PublicNoticeBoard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

import StudentDashboard from './pages/StudentDashboard';

import TeacherDashboard from './pages/TeacherDashboard';
import NoticeCreation from './pages/NoticeCreation';
import EditNoticePage from './pages/EditNoticePage';
import Analytics from './pages/Analytics';

import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';

import NoticeDetails from './components/NoticeDetails';
import NotificationCenter from './components/NotificationCenter';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="app-container">
            <NavigationBar />

            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicNoticeBoard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/notices/:id" element={<NoticeDetails />} />

                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'TEACHER', 'PARENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/notices" element={<StudentDashboard />} />
                  <Route path="/student/profile" element={<Profile />} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
                  <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                  <Route path="/teacher/create-notice" element={<NoticeCreation />} />
                  <Route path="/teacher/edit-notice/:id" element={<EditNoticePage />} />
                  <Route path="/teacher/analytics" element={<Analytics />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                </Route>

                {/* Shared Authenticated Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/notifications" element={<NotificationCenter />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<PublicNoticeBoard />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
