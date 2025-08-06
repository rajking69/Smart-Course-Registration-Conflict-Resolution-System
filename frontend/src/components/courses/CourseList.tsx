import { useState, useEffect } from 'react';
import { Course, CourseFilters, PaginationInfo } from '../../types/course';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

export default function CourseList() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([] as Course[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({} as CourseFilters);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [departments, setDepartments] = useState([] as string[]);
    const [semesters, setSemesters] = useState([] as string[]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCourses();
        loadFiltersData();
    }, [filters, pagination.currentPage]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourses(
                pagination.currentPage,
                pagination.itemsPerPage,
                filters
            );
            setCourses(response.courses);
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadFiltersData = async () => {
        try {
            const [depts, sems] = await Promise.all([
                courseService.getDepartments(),
                courseService.getSemesters()
            ]);
            setDepartments(depts);
            setSemesters(sems);
        } catch (err) {
            console.error('Error loading filter data:', err);
        }
    };

    const handleFilterChange = (name: keyof CourseFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchTerm);
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filters */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="md:col-span-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="flex-1 p-2 border rounded"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Department Filter */}
                    <select
                        className="p-2 border rounded"
                        value={filters.department || ''}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    {/* Semester Filter */}
                    <select
                        className="p-2 border rounded"
                        value={filters.semester || ''}
                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                    >
                        <option value="">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>

                    {/* Instructor Filter */}
                    <select
                        className="p-2 border rounded"
                        value={filters.instructor || ''}
                        onChange={(e) => handleFilterChange('instructor', e.target.value)}
                    >
                        <option value="">All Instructors</option>
                        {/* Add unique instructors from courses */}
                        {Array.from(new Set(courses.map(c => c.instructor))).map(instructor => (
                            <option key={instructor} value={instructor}>{instructor}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course List */}
            <div className="grid gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {course.code} - {course.name}
                                </h3>
                                <p className="text-gray-600 mt-1">{course.description}</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                                    {course.credits} Credits
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Instructor</h4>
                                <p>{course.instructor}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Schedule</h4>
                                <p>{course.schedule.days.join(', ')} at {course.schedule.time}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Enrollment</h4>
                                <p>{course.currentEnrollment} / {course.capacity} students</p>
                            </div>
                        </div>

                        {course.prerequisites.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700">Prerequisites</h4>
                                <p className="text-gray-600">
                                    {course.prerequisites.join(', ')}
                                </p>
                            </div>
                        )}

                        {/* Registration button for students */}
                        {user?.role === 'student' && (
                            <div className="mt-4">
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                    disabled={course.currentEnrollment >= course.capacity}
                                >
                                    {course.currentEnrollment >= course.capacity
                                        ? 'Course Full'
                                        : 'Register'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
