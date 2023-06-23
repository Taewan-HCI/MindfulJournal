import axios, { AxiosInstance, isAxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

const TOKEN_KEY = 'accessToken';
const NOT_AUTHORIZED_MESSAGE = 'Could not validate credentials';

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response.data.detail === NOT_AUTHORIZED_MESSAGE
    ) {
      localStorage.removeItem(TOKEN_KEY);
      alert('유효하지 않은 토큰입니다. 다시 로그인해 주세요.');
      window.location.replace('/');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
