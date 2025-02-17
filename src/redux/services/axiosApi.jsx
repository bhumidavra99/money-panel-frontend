import axios from "axios";
import { toast } from "react-toastify";

export const apiInstance = axios.create({
  baseURL:process.env.REACT_APP_BASE_URL1,
});
apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message, {
        autoClose: 2000,
        pauseOnHover: false,
      });
    }

    return Promise.reject(error);
    
  }
);
