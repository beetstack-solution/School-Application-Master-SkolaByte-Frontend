import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface PaperSizeResponse {
    success: boolean;
    message: string;
    data: {
        data: PaperSize[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PaperSize {
    _id: string;
    name: string;
    description: string;
    status: boolean;
    createdBy: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedBy: {
        name?: string;
        email?: string;
    };
    userUpdatedDate?: string;
}

export const getPaperSizes = async (page: number, limit: number): Promise<PaperSizeResponse> => {
    try {
        const response: AxiosResponse<PaperSizeResponse> = await api.get(
            `lookups/paper-size/`,
            {
                params: {
                    page: page,
                    limit: limit,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Paper Sizes", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Paper Sizes");
    }
}

export const createPaperSize = async (paperSize: PaperSize): Promise<PaperSizeResponse> => {
    try {
        const response: AxiosResponse<PaperSizeResponse> = await api.post(
            `lookups/paper-size/`,
            paperSize
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating Paper Size", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Paper Size");
    }
}

export const updatePaperSize = async (id: string, paperSize: any): Promise<any> => {
    try {
        const response = await api.put<any>(
            `lookups/paper-size/${id}`,
            paperSize
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Paper Size", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Paper Size");
    }
}

export const deletePaperSize = async (id: string): Promise<PaperSizeResponse> => {
    try {
        const response: AxiosResponse<PaperSizeResponse> = await api.delete(
            `lookups/paper-size/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting Paper Size", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete Paper Size");
    }
}

export const getPaperSizeById = async (id: string): Promise<PaperSizeResponse> => {
    try {
        const response: AxiosResponse<PaperSizeResponse> = await api.get(
            `lookups/paper-size/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Paper Size by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Paper Size by ID");
    }
}

export const updatePaperSizeStatusById = async (id: string, status: boolean): Promise<PaperSizeResponse> => {
    try {
        const response: AxiosResponse<PaperSizeResponse> = await api.patch(
            `lookups/paper-size/${id}/status`,
            { status: status }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Paper Size status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Paper Size status");
    }
}