import Axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE(config).then(({ data }: AxiosResponse<T>) => data);
};
