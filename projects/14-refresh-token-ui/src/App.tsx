// import axios from "axios";
import request from "./request";
import { useEffect, useState } from "react";
import { message } from "antd";
import "@ant-design/v5-patch-for-react-19";

/*
注意事项：
1. 在这里使用 request 实例来执行请求，而不是直接使用 axios；
*/

function App() {
  const [noLogin, setNoLogin] = useState();
  const [loginGuard, setLoginGuard] = useState();

  async function login() {
    const { data } = await request.post("http://localhost:3000/user/login", {
      username: "hello",
      password: "123456",
    });
    console.log(data);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  async function query() {
    const { data: noLoginData } = await request.get(
      "http://localhost:3000/no-login"
    );
    const { data: loginGuardData } = await request.get(
      "http://localhost:3000/login-guard"
      // {headers: {
      //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //   },}
    );

    setNoLogin(noLoginData);
    setLoginGuard(loginGuardData);
  }

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      login();
    }
    query();
  }, []);

  async function handleWithLogin() {
    try {
      await request.get("http://localhost:3000/login-guard");
      message.success("访问成功");
    } catch (error) {
      message.error("访问失败");
      console.log(error);
    }
  }

  function handleRemoveToken() {
    localStorage.removeItem("access_token");
  }

  return (
    <div>
      <div>
        <p>{noLogin}</p>
        <p>{loginGuard}</p>
      </div>
      <div>
        <button onClick={handleWithLogin}>访问需要登录的接口</button>
        <button onClick={handleRemoveToken}>让token过期</button>
      </div>
    </div>
  );
}

export default App;
