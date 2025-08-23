import axios from "axios";
import type { CreateBook } from "../pages/BookManage/CreateBookModal";
import type { UpdateBook } from "../pages/BookManage/UpdateBookModal";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

export async function register(username: string, password: string) {
  return await axiosInstance.post("/user/register", {
    username,
    password,
  });
}

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

export async function getBookList(name: string) {
  return await axiosInstance.get("/book/list", {
    params: {
      name,
    },
  });
}

export async function createBook(book: CreateBook) {
  return await axiosInstance.post("/book/create", book);
}

export async function updateBook(book: UpdateBook) {
  return await axiosInstance.put("/book/update", book);
}

export async function getBookById(id: number) {
  return await axiosInstance.get(`/book/${id}`);
}

export async function deleteBookById(id: number) {
  return await axiosInstance.delete(`/book/delete/${id}`);
}
