import store from "@/redux/store";

 
export const getAdminBearerToken = () => {
  const token = store
  .getState().user.token;
  if (!token) {
    console.error("No artist token found");
    throw new Error("Authentication token is missing");
  }
  return token;
};

export const setSchoolApiKey = (key: string) => {
  localStorage.setItem("school_api_key", key);
};
 
export const getSchoolApiKey = (): string | null => {
  return localStorage.getItem("school_api_key");
};
 
export const clearSchoolApiKey = () => {
  localStorage.removeItem("school_api_key");
};