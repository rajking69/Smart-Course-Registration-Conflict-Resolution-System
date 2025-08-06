import { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Course } from '../../types/course';
import CourseRegistration from './CourseRegistration';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface Props {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
    onRegistrationUpdate: () => void;
}

export default function CourseDetailModal({ course, isOpen, onClose, onRegistrationUpdate }: Props) {
    const { user } = useAuth();

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!course) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                {/* Modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            {/* Header */}
                            <Dialog.Title className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        {course.code} - {course.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {course.department}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </Dialog.Title>

                            {/* Content */}
                            <div className="mt-4 space-y-6">
                                {/* Description */}
                                <div>
                                    <h4 className="font-medium text-gray-900">Description</h4>
                                    <p className="mt-2 text-gray-600">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Key Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Credits</h4>
                                        <p className="mt-1 text-gray-600">{course.credits}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Instructor</h4>
                                        <p className="mt-1 text-gray-600">{course.instructor}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Enrollment</h4>
                                        <p className="mt-1 text-gray-600">
                                            {course.currentEnrollment} / {course.capacity} students
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Semester</h4>
                                        <p className="mt-1 text-gray-600">{course.semester}</p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div>
                                    <h4 className="font-medium text-gray-900">Schedule</h4>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">
                                            {course.schedule.days.join(', ')} at {course.schedule.time}
                                        </p>
                                    </div>
                                </div>

                                {/* Prerequisites */}
                                {course.prerequisites.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900">Prerequisites</h4>
                                        <ul className="mt-2 list-disc list-inside text-gray-600">
                                            {course.prerequisites.map((prereq) => (
                                                <li key={prereq}>{prereq}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Registration Section (for students only) */}
                                {user?.role === UserRole.STUDENT && (
                                    <CourseRegistration
                                        course={course}
                                        onRegistrationUpdate={onRegistrationUpdate}
                                    />
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
