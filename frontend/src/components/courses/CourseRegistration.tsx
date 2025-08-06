import { useState } from 'react';
import axios from 'axios';
import { Course } from '../../types/course';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
    course: Course;
    onRegistrationUpdate: () => void;
}

interface RegistrationResponse {
    message: string;
    status: 'success' | 'waitlisted' | 'error';
    position?: number; // Waitlist position if applicable
    missingPrerequisites?: string[]; // List of missing prerequisite courses
}

export default function CourseRegistration({ course, onRegistrationUpdate }: Props) {
    const { user } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(null as RegistrationResponse | null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleRegistration = async () => {
        if (!user) return;
        
        setIsRegistering(true);
        setRegistrationStatus(null);

        try {
            const response = await axios.post<RegistrationResponse>('http://localhost:5000/api/courses/register', {
                courseId: course.id
            });

            setRegistrationStatus(response.data);
            onRegistrationUpdate(); // Refresh course list/status
            setShowConfirmation(false);
        } catch (error: any) {
            setRegistrationStatus({
                status: 'error',
                message: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsRegistering(false);
        }
    };

    const getStatusColor = () => {
        if (!registrationStatus) return '';
        switch (registrationStatus.status) {
            case 'success': return 'text-green-600';
            case 'waitlisted': return 'text-yellow-600';
            case 'error': return 'text-red-600';
            default: return '';
        }
    };

    return (
        <div>
            {/* Registration Button */}
            {!showConfirmation && (
                <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isRegistering || course.currentEnrollment >= course.capacity}
                    className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {course.currentEnrollment >= course.capacity ? 'Course Full' : 'Register for Course'}
                </button>
            )}

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-lg mb-2">Confirm Registration</h4>
                    <p className="mb-4">
                        Are you sure you want to register for {course.code} - {course.name}?
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRegistration}
                            disabled={isRegistering}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 
                                     disabled:opacity-50"
                        >
                            {isRegistering ? 'Registering...' : 'Confirm'}
                        </button>
                        <button
                            onClick={() => setShowConfirmation(false)}
                            disabled={isRegistering}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Registration Status/Feedback */}
            {registrationStatus && (
                <div className={`mt-4 p-4 rounded-lg ${getStatusColor()} bg-opacity-10`}>
                    <p className="font-medium">{registrationStatus.message}</p>
                    
                    {/* Waitlist Position */}
                    {registrationStatus.status === 'waitlisted' && registrationStatus.position && (
                        <p className="mt-2">
                            Your position on the waitlist: {registrationStatus.position}
                        </p>
                    )}

                    {/* Missing Prerequisites */}
                    {registrationStatus.missingPrerequisites && registrationStatus.missingPrerequisites.length > 0 && (
                        <div className="mt-2">
                            <p>Missing prerequisites:</p>
                            <ul className="list-disc list-inside ml-4">
                                {registrationStatus.missingPrerequisites.map((prereq) => (
                                    <li key={prereq}>{prereq}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
