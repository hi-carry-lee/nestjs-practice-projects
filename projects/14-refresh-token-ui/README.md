# 项目介绍

这是一个使用 refresh token 的示例项目，主要用于演示如何使用 refresh token 来刷新 access token。

## antd 和 react19 的兼容性问题

当前 2025 年 8 月，antd 和 React19 存在兼容性问题，解决办法如下：

1. 安装：pnpm add @ant-design/v5-patch-for-react-19 ;
2. 在 App.tsx 中：import '@ant-design/v5-patch-for-react-19';
