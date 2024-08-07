import { http } from "./http";

export interface IDepartment {
  name: string;
}

export const create = async () => {
  try {
    const response = await http.post(`/department/create`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getAll = async () => {
  try {
    const response = await http.get(`/department/getAll`);
    console.log("response", response);

    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getOne = async (id: string) => {
  try {
    console.log("department getOne", id);

    const response = await http.get(`/department/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const updateOne = async (id: string, payload: IDepartment) => {
  try {
    const response = await http.post(`/department/update/${id}`, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
