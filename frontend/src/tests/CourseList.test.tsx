import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseList from '../components/courses/CourseList';
import { courseService } from '../services/courseService';
import { testUsers } from './test-utils';

// Mock the course service
vi.mock('../services/courseService');

const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Programming',
    description: 'Basic programming concepts',
    credits: 3,
    capacity: 30,
    currentEnrollment: 20,
    instructor: 'John Doe',
    schedule: {
      days: ['Monday', 'Wednesday'],
      time: '09:00-10:30'
    },
    prerequisites: [],
    department: 'Computer Science',
    semester: 'Fall 2025'
  },
  {
    id: 2,
    code: 'CS102',
    name: 'Data Structures',
    description: 'Basic data structures and algorithms',
    credits: 3,
    capacity: 25,
    currentEnrollment: 25,
    instructor: 'Jane Smith',
    schedule: {
      days: ['Tuesday', 'Thursday'],
      time: '11:00-12:30'
    },
    prerequisites: ['CS101'],
    department: 'Computer Science',
    semester: 'Fall 2025'
  }
];

describe('CourseList Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Setup default mock implementations
    vi.mocked(courseService.getCourses).mockResolvedValue({
      courses: mockCourses,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 10
      }
    });
  });

  it('renders course list with correct data', async () => {
    render(<CourseList />);

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeInTheDocument();
    });

    expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('20 / 30 students')).toBeInTheDocument();
  });

  it('shows loading state while fetching courses', () => {
    vi.mocked(courseService.getCourses).mockImplementation(() => new Promise(() => {}));
    render(<CourseList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when course loading fails', async () => {
    vi.mocked(courseService.getCourses).mockRejectedValue(new Error('Failed to load courses'));
    render(<CourseList />);
    
    expect(await screen.findByText(/failed to load courses/i)).toBeInTheDocument();
  });

  it('filters courses based on search input', async () => {
    render(<CourseList />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search courses/i);
    await userEvent.type(searchInput, 'Data Structures');
    
    // Submit search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Verify service was called with search term
    expect(courseService.getCourses).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        search: 'Data Structures'
      })
    );
  });

  it('handles pagination correctly', async () => {
    // Mock pagination data
    vi.mocked(courseService.getCourses).mockResolvedValueOnce({
      courses: mockCourses,
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 4,
        itemsPerPage: 2
      }
    });

    render(<CourseList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeInTheDocument();
    });

    // Click next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Verify service was called with page 2
    expect(courseService.getCourses).toHaveBeenCalledWith(
      2,
      expect.anything(),
      expect.anything()
    );
  });

  it('shows course capacity status correctly', async () => {
    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('CS101')).toBeInTheDocument();
    });

    // CS101 has space
    expect(screen.getByText('20 / 30 students')).toBeInTheDocument();
    
    // CS102 is full
    expect(screen.getByText('25 / 25 students')).toBeInTheDocument();
    expect(screen.getByText('Course Full')).toBeInTheDocument();
  });
});
