import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface AttendanceSummaryResponse {
    success: boolean;
    message: string;
    data: AttendanceSummary[];
}

export interface AttendanceSummary {
    className: string;
    divisionName: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
}



export const fetchAttendanceReports = async (startDate: string, endDate: string): Promise<AttendanceSummaryResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await axios.get<AttendanceSummaryResponse>(
            `${API_BASE_URL}/attendance-report/summary`,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
               params: {
                    startDate,
                    endDate,
                    },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching attendance reports",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch attendance reports"
        );
    }
};
