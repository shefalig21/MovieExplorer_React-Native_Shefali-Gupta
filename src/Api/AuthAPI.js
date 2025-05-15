import axios from "axios";

const baseURL='https://movie-explorer-ror-varun.onrender.com';

export const registerUser=async(name,email,password)=>{
    try{
        const response=await axios.post(`${baseURL}/api/v1/signup`,{
            user: {
              name,
              email,
              password,
            }
          });
        
        return response.data;
    }
    catch(error)
    {
        console.log("Error registering:",error.response?.data || error.message);
        throw error;
    }  
}

export const loginUser=async(email, password)=>{
    try{
        const response=await axios.post(`${baseURL}/api/v1/login`,{
            email,
            password,
        });
        return response.data;
    }
    catch(error)
    {
        console.log("Error logging in:",error.response?.data || error.message);
        throw error;
    }
}

