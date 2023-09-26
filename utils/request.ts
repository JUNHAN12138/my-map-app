import axios from "axios";

var request = axios.create({
  // 后台接口的基准地址
  baseURL: "http://localhost:8888/",
  timeout: 5000,
  changeOrigin: true,
});

// 添加请求拦截器
request.interceptors.request.use(
  (config: any) => {
    return config;
  },
  function (error: any) {
    //对相应错误做点什么
    return Promise.reject(error);
  }
);

//拦截器响应
request.interceptors.response.use(
  (response: { data: any }) => {
    return response.data;
  },
  function (error: any) {
    //对相应错误做点什么
    return Promise.reject(error);
  }
);

export default request;
