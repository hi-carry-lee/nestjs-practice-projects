import { Button, Form, Input, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import "../../index.css";
import { register } from "../../utils/request";
import { isAxiosError } from "axios";

/*
Ant Design V5 和 React19的兼容性问题
安装：pnpm add @ant-design/v5-patch-for-react-19 --save
然后在使用antd的页面：import '@ant-design/v5-patch-for-react-19';

*/
interface RegisterUser {
  username: string;
  password: string;
  password2: string;
}

const onFinish = async (values: RegisterUser) => {
  console.log(values);
  if (values.password !== values.password2) {
    message.error("两次密码不一致");
    return;
  }

  try {
    const res = await register(values.username, values.password);

    if (res.status === 201 || res.status === 200) {
      message.success("注册成功");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  } catch (error: unknown) {
    // 原本是any类型，这里做了类型守卫：检查是否是 axios 错误
    if (isAxiosError(error)) {
      message.error(error.response?.data?.message || "注册失败");
    } else if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error("未知错误");
    }
  }
};

// Ant Design使用24格栅格系统，将整个表单分为两个column，通过分配span来控制每个的宽度；
// layout1: 标签占4格，输入框占20格（总共24格）
const layout1 = {
  labelCol: { span: 5 }, // label占4/24
  wrapperCol: { span: 20 }, // input占20/24
};

// layout2: 没有标签，输入框占满24格
const layout2 = {
  labelCol: { span: 0 }, // 无label
  wrapperCol: { span: 24 }, // input占满
};

export default function Register() {
  return (
    <div id="register-container">
      <h1>图书管理系统</h1>
      <Form
        {...layout1} // 布局配置
        onFinish={onFinish} // 表单提交处理
        colon={false} // 是否显示label后的冒号
        autoComplete="off" // 关闭浏览器自动填充
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="password2"
          rules={[{ required: true, message: "请输入确认密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="links">
            <a href="/login">已有账号？去登录</a>
          </div>
        </Form.Item>

        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
