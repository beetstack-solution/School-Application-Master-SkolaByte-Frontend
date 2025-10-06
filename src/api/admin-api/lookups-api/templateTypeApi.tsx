import axios, { AxiosResponse } from "axios";
import api from "@/api/axiosInstance";

export interface TemplateTypeResponse {
    success: boolean;
    message: string;
    data: {
        data: TemplateType[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface TemplateType {
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

export const getTemplateTypes = async (page: number, limit: number): Promise<TemplateTypeResponse> => {
    try {
        const response: AxiosResponse<TemplateTypeResponse> = await api.get(
            `lookups/template-type/`,
            {
                params: {
                    page: page,
                    limit: limit,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Template Types", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Template Types");
    }
}

export const createTemplateType = async (templateType: TemplateType): Promise<TemplateTypeResponse> => {
    try {
        const response: AxiosResponse<TemplateTypeResponse> = await api.post(
            `lookups/template-type/`,
            templateType
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating Template Type", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Template Type");
    }
}

export const updateTemplateType = async (id: string, templateType: any): Promise<any> => {
    try {
        const response = await api.put<any>(
            `lookups/template-type/${id}`,
            templateType
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Template Type", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Template Type");
    }
}

export const deleteTemplateType = async (id: string): Promise<TemplateTypeResponse> => {
    try {
        const response: AxiosResponse<TemplateTypeResponse> = await api.delete(
            `lookups/template-type/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting Template Type", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete Template Type");
    }
}

export const getTemplateTypeById = async (id: string): Promise<TemplateTypeResponse> => {
    try {
        const response: AxiosResponse<TemplateTypeResponse> = await api.get(
            `lookups/template-type/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Template Type by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Template Type by ID");
    }
}

export const updateTemplateTypeStatusById = async (id: string, status: boolean): Promise<TemplateTypeResponse> => {
    try {
        const response: AxiosResponse<TemplateTypeResponse> = await api.patch(
            `lookups/template-type/${id}/status`,
            { status: status }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Template Type status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Template Type status");
    }
}