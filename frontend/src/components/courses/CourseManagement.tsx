import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course } from '../../types/course';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface Registration {
    id: number;
    studentId: number;
    courseId: number;
    status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
    studentName: string;
    createdAt: string;
}

interface CourseRoster {
    course: Course;
    registrations: Registration[];
}

export default function CourseManagement() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([] as Course[]);
    const [selectedCourse, setSelectedCourse] = useState(null as Course | null);
    const [roster, setRoster] = useState([] as Registration[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadRoster(selectedCourse.id);
        }
    }, [selectedCourse]);

    const loadCourses = async () => {
        try {
            const response = await axios.get<{ courses: Course[] }>(
                'http://localhost:5000/api/courses'
            );
            setCourses(response.data.courses);
        } catch (err) {
            setError('Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRoster = async (courseId: number) => {
        try {
            setLoading(true);
            const response = await axios.get<{ registrations: Registration[] }>(
                `http://localhost:5000/api/courses/${courseId}/roster`
            );
            setRoster(response.data.registrations);
        } catch (err) {
            setError('Failed to load course roster');
            console.error('Error loading roster:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (registrationId: number, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/registrations/${registrationId}`, {
                status: newStatus
            });
            
            // Reload roster to show updated status
            if (selectedCourse) {
                loadRoster(selectedCourse.id);
            }
        } catch (err) {
            console.error('Error updating registration status:', err);
            setError('Failed to update registration status');
        }
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
            <h2 className="text-2xl font-bold mb-6">Course Management</h2>

            {/* Course Selection */}
            <div className="mb-8">
                <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">
                    Select Course
                </label>
                <select
                    id="course-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCourse?.id || ''}
                    onChange={(e) => {
                        const course = courses.find(c => c.id === Number(e.target.value));
                        setSelectedCourse(course || null);
                    }}
                >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.code} - {course.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Course Roster */}
            {selectedCourse && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Course Roster - {selectedCourse.code}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {selectedCourse.name}
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roster.map((registration) => (
                                    <tr key={registration.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {registration.studentName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                registration.status === 'waitlisted' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'}`}>
                                                {registration.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(registration.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {registration.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(registration.id, 'approved')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
