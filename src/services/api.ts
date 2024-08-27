import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        Email?: string,
        baseURL?: string,
    }
}

function getCookie(name: any){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        let res = parts.pop()?.split(';')?.shift();
        return res;
    }else{
        return null;
    }
}

const api = axios.create({
    baseURL: 'http://localhost:3333'
    // baseURL: 'http://192.168.100.9:3333',
});

api.defaults.headers.common['token'] = getCookie("token") || "";

export default api;