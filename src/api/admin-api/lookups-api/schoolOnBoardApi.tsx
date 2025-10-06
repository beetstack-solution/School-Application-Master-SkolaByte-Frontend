import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface SchoolOnboardResponse {
  success: boolean;
  message: string;
  data: SchoolOnboardItem[];
}

export interface SchoolOnboardItem {
  _id: string;
  schoolId: SchoolDetails;
  schoolCode: string;
  dbName: string;
  mongoUri: string;
  systemKey: string;
  username: string;
  password: string;
  plainPassword: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SchoolDetails {
  _id: string;
  name: string;
  code: string;
  establishmentYear: number;
  type: string;
  educationLevel: string;
  imageUrl: string[];
  boardAffiliation: string;
  onBoarded: boolean;
  address: Address;
  contact: Contact;
  principalName: string;
  facilities: Facilities;
  branchDetails: BranchDetail[];
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  _id: string;
}

export interface Contact {
  phone: string;
  email: string;
  website: string;
  _id: string;
}

export interface Facilities {
  library: boolean;
  lab: boolean;
  sports: boolean;
  transport: boolean;
  hostel: boolean;
  _id: string;
}

export interface BranchDetail {
  name: string;
  code: string;
  address: Address[];
  _id: string;
}


export const getSchoolOnboardList = async (): Promise<SchoolOnboardResponse> => {
  try {
      const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
    const response: AxiosResponse<SchoolOnboardResponse> = await api.get(
      `/school-onboard`,
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
  }
    catch (error) {
        console.error("Error fetching school onboard list:", error);
        throw error;
    }

}


export const getSchoolOnboardById = async (id: string): Promise<SchoolOnboardItem> => {
  try {
    const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
    const response: AxiosResponse<SchoolOnboardItem> = await api.get(
      `/school-onboard/${id}`,
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
  } catch (error) {
    console.error("Error fetching school onboard by ID:", error);
    throw error;
  }
}