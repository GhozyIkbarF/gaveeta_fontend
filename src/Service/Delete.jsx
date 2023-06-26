import axios from "axios";
import { rootPath } from "./Config";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

const Delete = async (path) => {
  try {
    const res = await axios.delete(`${rootPath}${path}`, {headers});
    return res;
  } catch (error) {
    console.log("error req DELETE :", error.response.data);
    throw error;
  }
};

export default Delete;