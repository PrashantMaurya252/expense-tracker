import axios from 'axios'


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URI

export const addExpenseAPI = async(data)=>{
    try {
        const response = await axios.post(`${BACKEND_URL}/expense/add-expense`,data)
    } catch (error) {
        console.log("Error in Add Expense",error)
    }
}