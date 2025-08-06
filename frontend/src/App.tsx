import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserRole, User } from './types/auth';
import Login from './components/Login';
import Register from './components/Register';
import CourseList from './components/courses/CourseList';
import CourseManagement from './components/courses/CourseManagement';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode | ((props: { user: User }) => React.ReactNode) }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (typeof children === 'function') {
        return <>{children({ user })}</>;
    }

    return <>{children}</>;
};

// Role-based redirect after login
const redirectBasedOnRole = (role: string) => {
    switch (role) {
        case 'student':
            return '/student/dashboard';
        case 'advisor':
            return '/advisor/dashboard';
        case 'admin':
            return '/admin/dashboard';
        default:
            return '/dashboard';
    }
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <CourseList />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/courses" element={
                        <ProtectedRoute>
                            <CourseList />
                        </ProtectedRoute>
                    } />

                    {/* Admin/Advisor routes */}
                    <Route path="/manage/courses" element={
                        <ProtectedRoute>
                            {({ user }) => 
                                user?.role === UserRole.ADMIN || user?.role === UserRole.ADVISOR ? (
                                    <CourseManagement />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        </ProtectedRoute>
                    } />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
