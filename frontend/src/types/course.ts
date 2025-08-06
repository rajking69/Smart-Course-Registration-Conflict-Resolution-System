export interface CourseSchedule {
    days: string[];
    time: string;
}

export interface Course {
    id: number;
    code: string;
    name: string;
    description: string;
    credits: number;
    capacity: number;
    currentEnrollment: number;
    instructor: string;
    schedule: CourseSchedule;
    prerequisites: string[];
    department: string;
    semester: string;
}

export interface CourseFilters {
    department?: string;
    semester?: string;
    instructor?: string;
    search?: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface CourseListResponse {
    courses: Course[];
    pagination: PaginationInfo;
}
