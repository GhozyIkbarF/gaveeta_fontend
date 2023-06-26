import axios from "axios";
import { rootPath } from "./Config";

const accessToken = localStorage.getItem('accessToken');
const Get = async (path) => {
    try {
        const res = await axios.get(`${rootPath}${path}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res;
    } catch (error) {
        throw error;
    }
};

export default Get;