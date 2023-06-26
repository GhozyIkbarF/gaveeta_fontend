import axios from "axios";
import { rootPath } from "./Config";

const accessToken = localStorage.getItem('accessToken');
const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': "multipart/form-data"
    // 'Content-Type': 'application/json'
};

const Post = async (path, data) => {
    try {
        const res = await axios.post(`${rootPath}${path}`, data, { headers });
        return res;
    } catch (error) {
        console.log("error req post :", error.response.data);
        throw error;
    }
};


export const PostLogin = async (path, data) => {
    try {
        const res = await axios.post(`${rootPath}${path}`, data);
        return res;
    } catch (error) {
        console.log("error req post :", error.response.data);
        throw error;
    }
};

const authToken = 'EAAHn7n6UZBIcBACcufBVyBZBvZAeCloHfx1OFJgZCvm2JmGZBQhONvatC7mZB2aE1tqUsUmgKTOttt7g3DomIvhZBcoZBjIywEH3AJVVJGAZCnspOew2ONBzfiLAnMFrryyA4kNaZBUWxTASfxrG8GfjbETnMfFCRmxPDW0O9xxTQLmIOp50qWsKNq8AUTErjscLlOQZCXnSZAlJQAZDZD'
const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };

export const sendMessage = async (data) => {
    try {
        const res = await axios.post(`https://graph.facebook.com/v15.0/105964552456516/messages`, data, config);
        return res;
    } catch (error) {
        console.log("error req post :", error.response.data);
        throw error;
    }
};

export default Post;
