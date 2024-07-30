import { FormInputs } from "../app/employee/form";
import { LoginupFormInputs } from "../app/login/page";
import { SignupFormInputs } from "../app/signup/page";
import { http } from "./http";

interface ISort {
  sortBy?: string;
  sortType?: number;
}

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

export const getUsers = async (sortBy?: string, sortType?: number) => {
  try {
    const response = await http.get(`/user/users`, {
      params: {
        sortBy,
        sortType,
      },
    });
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const update = async (id: string, payload: FormInputs) => {
  try {
    const response = await http.put(`/user/${id}`, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const removeUser = async (id: string) => {
  try {
    const response = await http.delete(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
