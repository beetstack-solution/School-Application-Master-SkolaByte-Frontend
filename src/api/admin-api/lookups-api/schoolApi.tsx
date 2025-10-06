import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface SchoolProfileResponse {
    success: boolean;
    message: string;
    data: {
        data: SchoolProfile[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SchoolProfile {
    _id: string;
    name: string;
    code: string;
    type: 'Public' | 'Private' | 'Charter' | 'International';
    educationLevel: string;
    imageUrl: string[];
    boardAffiliation: string;
    address: Address;
    contact: Contact;
    facilities: Facilities;
    branchDetails: BranchDetail[];
    createdBy?: UserMeta;
    createdAt: string;
    updatedBy?: UserMeta;
}

export interface Address {
    _id: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface Contact {
    _id: string;
    phone?: string;
    email?: string;
    website?: string;
}

export interface Facilities {
    _id: string;
    library?: boolean;
    lab?: boolean;
    sports?: boolean;
    transport?: boolean;
    hostel?: boolean;
}

export interface BranchDetail {
    _id: string;
    name: string;
    code?: string;
    address: Address[];
}

export interface UserMeta {
    name?: string;
    email?: string;
}
  

export const getSchoolProfile = async (
    page: number,
    limit: number
  ): Promise<SchoolProfileResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response: AxiosResponse<SchoolProfileResponse> = await api.get(
        `/school-profile/`,{
            params: { page, limit },
              withCredentials: true,
              headers: {
                  "x-api-key": apikey,
                  "x-app-version": appVersion,
                  Authorization: `Bearer ${token}`,
              },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching School Profile",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch School Profile"
      );
    }
  };


  export const deleteSchoolProfile = async (id: string): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response: AxiosResponse<any> = await api.delete(
        `/school-profile/${id}`,{
              withCredentials: true,
              headers: {
                  "x-api-key": apikey,
                  "x-app-version": appVersion,
                  Authorization: `Bearer ${token}`,
              },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error deleting School Profile",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete School Profile"
      );
    }
  };

export const updateSchoolProfileStatus = async (
    id: string,
    status: any
  ): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response = await api.patch(
        `/school-profile/${id}/status`,
        { status },
        {
          withCredentials: true,
          headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating School Profile by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update School Profile by ID"
      );
    }
  };

export const createSchoolProfile = async (
    schoolData: any
  ): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response: AxiosResponse<any> = await api.post(
        "/school-profile",
        schoolData,
        {
          withCredentials: true,
          headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating School Profile",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create School Profile"
      );
    }
  };


export const getSchoolProfileById = async (
    id: string
  ): Promise<SchoolProfile> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response: AxiosResponse<SchoolProfile> = await api.get(
        `/school-profile/${id}`,
        {
          withCredentials: true,
          headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching School Profile by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch School Profile by ID"
      );
    }
  }


  export const updateSchoolProfileById = async (
    id: string,
    schoolData: any
  ): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
      const response: AxiosResponse<any> = await api.put(
        `/school-profile/${id}`,
        schoolData,
        {
          withCredentials: true,
          headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating School Profile by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update School Profile by ID"
      );
    }
  }

export const createdOnBoardedSchoolProfile = async (
  id: string,
  schoolData: unknown  // Fix parameter order
): Promise<unknown> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    if (!id) {
      throw new Error("School ID is required");
    }

    const response = await api.post(
      `/school-profile/${id}/onboard`,
      schoolData,  // Now correctly placed as second argument
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error(
        "Error creating Onboarded School Profile",
        axiosError.response?.data || error.message
      );
      throw new Error(
        axiosError.response?.data?.message || "Failed to create Onboarded School Profile"
      );
    }
    throw new Error("An unknown error occurred");
  }
};
