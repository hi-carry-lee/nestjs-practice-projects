import { RouterProvider, createBrowserRouter } from "react-router-dom";
import BookManage from "./pages/BookManage";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";

// React Router7推荐使用 createBrowserRouter 创建路由
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <BookManage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
