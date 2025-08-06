import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { ReactNode } from 'react';

// Test user data
export const testUsers = {
  student: {
    id: 1,
    username: 'testStudent',
    email: 'student@test.com',
    role: UserRole.STUDENT,
    firstName: 'Test',
    lastName: 'Student'
  },
  advisor: {
    id: 2,
    username: 'testAdvisor',
    email: 'advisor@test.com',
    role: UserRole.ADVISOR,
    firstName: 'Test',
    lastName: 'Advisor'
  },
  admin: {
    id: 3,
    username: 'testAdmin',
    email: 'admin@test.com',
    role: UserRole.ADMIN,
    firstName: 'Test',
    lastName: 'Admin'
  }
};

// Custom render with providers
export function render(ui: ReactNode, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper });
}
