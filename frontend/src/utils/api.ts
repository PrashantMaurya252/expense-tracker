import axios,{ AxiosRequestConfig } from 'axios'


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URI

// export const addExpenseAPI = async(data)=>{
//     try {
//         const response = await axios.post(`${BACKEND_URL}/expense/add-expense`,data,{withCredentials:true})
//         let data ={
//             success:response.data.success,
//             message:response.data.message
//         }
//         return data
//     } catch (error) {
//         console.log("Error in Add Expense",error)
//         data ={
//              success:false,
//             message:error.message || "Something went wrong while adding expense"
//         }
//         return data
//     }
// }


interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

export const callApi = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await axios({
      method,
      url: `${BACKEND_URL}${endpoint}`,
      data: body,
      withCredentials: true,
      ...config,
    });

    return {
      status: response.status,
      success: response.data.success,
      message: response.data.message,
      data: response.data.data, // optional, only if backend returns data
    };
  } catch (error: any) {
    console.error("API Error:", error);

    return {
      status: error.response?.status || 500,
      success: false,
      message: error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};