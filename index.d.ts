import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
export default class AxiosDigest {
    private readonly axios;
    private username;
    private passwd;
    constructor(username: string, passwd: string, customAxios?: AxiosInstance | AxiosStatic);
    set info(d: {
        username: string;
        passwd: string;
    });
    get info(): {
        username: string;
        passwd: string;
    };
    get(path: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    post(path: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    put(path: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    delete(path: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    head(path: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    patch(path: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    private getWwwAuth;
    private getAuthHeader;
}
