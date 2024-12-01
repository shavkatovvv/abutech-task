import axios from "axios";
import { loadState } from "./store/storage";

function getAccessToken() {
    const token = loadState("token");

    return token ? token.data.accessToken : null;
}

export const request = axios.create({
    baseURL: "https://dev.api-erp.najotedu.uz",
});

request.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
