import { api } from './api';
import { DashboardResponse } from '../types/dashboard';

export const dashboardService = {
    getDashboard: async (): Promise<DashboardResponse> => {
        const response = await api.get('/v1/dashboard');
        return response.data;
    }
};