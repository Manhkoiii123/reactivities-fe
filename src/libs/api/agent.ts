import axios from "axios";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

agent.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default agent;
