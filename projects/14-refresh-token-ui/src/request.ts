import axios from "axios";

/*
注意事项：
1. 在这里创建axios实例；
2. 用这个实例来执行拦截请求和响应；
3. 导出这个实例以供在其他地方使用；
*/

// 创建 axios 实例
const request = axios.create({
  baseURL: "http://localhost:3000",
});

// 在拦截器里面执行token刷新
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 为什么鼠标放在response显示any类型，还可以解构？
    // 因为 TypeScript 的类型检查是编译时的，而解构赋值是运行时的操作。即使 TypeScript 无法推断出准确的类型，JavaScript 在运行时仍然可以正常执行解构操作
    const { data, config } = error.response;
    console.log("data, config: ", data, config);
    if (data.statusCode === 401 && !config.url.includes("/user/refresh")) {
      const res = await refreshToken();

      if (res.status === 200) {
        return axios(config);
      } else {
        alert("登录过期，请重新登录");
        return Promise.reject(res.data);
      }
    } else {
      return error.response;
    }
  }
);

request.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

async function refreshToken() {
  const res = await axios.get("http://localhost:3000/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}

export default request;

/*
axios 错误对象的结构
当 axios 请求失败时，错误对象的结构是：
{
  response: {
    data: { statusCode: 401, message: "..." },
    config: { url: "...", method: "get", headers: {...} },
    status: 401,
    statusText: "Unauthorized"
  },
  request: {...},
  message: "..."
}
*/
