import axios, { AxiosResponse } from "axios";
import api from "@/api/axiosInstance";

export interface CertificateTemplateResponse {
    success: boolean;
    message: string;
    data: {
        data: CertificateTemplate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CertificateTemplate {
    // _id: string;
    name: string;
    templateType:string;
    paperSize: string;
    smartTag: string;
    header: string;
    content: string;
    footer: string;
    // status: boolean;
    // createdBy:string;
    // createdAt: string;
    // updatedBy:string;
    // userUpdatedDate?: string;
}

export const getCertificateTemplates = async (page: number, limit: number): Promise<CertificateTemplateResponse> => {
    try {
        const response: AxiosResponse<CertificateTemplateResponse> = await api.get(
            `certificate-template/`,
            {
                params: {
                    page: page,
                    limit: limit,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Certificate Templates", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Certificate Templates");
    }
}

export const createCertificateTemplate = async (certificateData: CertificateTemplate): Promise<CertificateTemplateResponse> => {
    try {
        const response: AxiosResponse<CertificateTemplateResponse> = await api.post(
            `certificate-template/`,
            certificateData
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating Certificate Template", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Certificate Template");
    }
}

export const updateCertificateTemplate = async (id: string, certificateData: any): Promise<any> => {
    try {
        const response = await api.put<any>(
            `certificate-template/${id}`,
            certificateData
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Certificate Template", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Certificate Template");
    }
}

export const deleteCertificateTemplate = async (id: string): Promise<CertificateTemplateResponse> => {
    try {
        const response: AxiosResponse<CertificateTemplateResponse> = await api.delete(
            `certificate-template/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting Certificate Template", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete Certificate Template");
    }
}

export const getCertificateTemplateById = async (id: string): Promise<CertificateTemplateResponse> => {
    try {
        const response: AxiosResponse<CertificateTemplateResponse> = await api.get(
            `certificate-template/${id}`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Certificate Template by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Certificate Template by ID");
    }
}

export const updateCertificateTemplateStatusById = async (id: string, status: boolean): Promise<CertificateTemplateResponse> => {
    try {
        const response: AxiosResponse<CertificateTemplateResponse> = await api.patch(
            `certificate-template/${id}/status`,
            { status: status }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Certificate Template status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Certificate Template status");
    }
}