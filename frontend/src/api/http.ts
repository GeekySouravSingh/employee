import axios from "axios";

const BASE_URL = "http://localhost:4000/";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => {
    const {
      data: { message },
    } = response;

    return response;
  },
  async (error) => {
    const response = error.response;

    //We can handle global error message right here like
    //server is down
    //accesToken expired

    return Promise.reject(response ?? error);
  }
);

export { http };
