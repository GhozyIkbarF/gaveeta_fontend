import axios from "axios";
import { rootPath } from "./Config";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
};


const Update = async (path, data) => {
    try {
        const res = await axios.patch(`${rootPath}${path}`, data, { headers });
        return res;
    } catch (error) {
        console.log("error req update :", error.response.data);
        throw error;
    }
};


export default Update;
