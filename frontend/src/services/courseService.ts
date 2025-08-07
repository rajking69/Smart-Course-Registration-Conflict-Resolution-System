import axios from 'axios';
import { CourseFilters, CourseListResponse } from '../types/course';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const courseService = {
    async getCourses(
        page: number = 1,
        limit: number = 10,
        filters?: CourseFilters
    ): Promise<CourseListResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.department && { department: filters.department }),
            ...(filters?.semester && { semester: filters.semester }),
            ...(filters?.instructor && { instructor: filters.instructor }),
            ...(filters?.search && { search: filters.search })
        });

        const response = await axios.get(`${API_URL}/courses?${params}`);
        return response.data;
    },

    async getDepartments(): Promise<string[]> {
        const response = await axios.get(`${API_URL}/departments`);
        return response.data;
    },

    async getSemesters(): Promise<string[]> {
        const response = await axios.get(`${API_URL}/semesters`);
        return response.data;
    }
};
