import { LoginupFormInputs } from "../app/login/page";
import { SignupFormInputs } from "../app/signup/page";
import { http } from "./http";

export const registerUser = async (payload: SignupFormInputs) => {
  try {
    const response = await http.post(`/user/signup`, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const login = async (payload: LoginupFormInputs) => {
  try {
    const response = await http.post(`/user/signin`, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const signOut = async () => {
  try {
    const response = await http.post(`/user/signout`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getProfile = async () => {
  try {
    const response = await http.get(`/user/my-profile`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
