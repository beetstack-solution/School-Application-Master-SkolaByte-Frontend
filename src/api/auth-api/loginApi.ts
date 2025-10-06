import axios from "axios";
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
interface Address {
  street: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  _id: string;
}
 
interface PaymentAddress {
  GSTNumber: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  _id: string;    
}
 
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: Address;
  paymentAddress: PaymentAddress;
  status: boolean;
  isDeleted: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy: string;
  userUpdatedDate: string;
  deletedAt: string;
  deletedBy: string;
  [key: string]: any;
}
 
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
 
export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      {
        withCredentials: true,
        headers: {
          'x-api-key': apikey,
          'x-app-version': appVersion,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error logging in!", error);
    throw error;
  }
};