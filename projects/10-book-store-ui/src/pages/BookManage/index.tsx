import { Button, Card, Form, Input, message, Popconfirm } from "antd";
import "../../index.css";
import { useCallback, useEffect, useState } from "react";
import { deleteBookById, getBookList } from "../../utils/request";
import { isAxiosError } from "axios";
import { CreateBookModal } from "./CreateBookModal";
import { UpdateBookModal } from "./UpdateBookModal";
import { BookDetailModal } from "./BookDetailModal";

export interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

export function BookManage() {
  const [bookList, setBookList] = useState<Array<Book>>([]);
  const [name, setName] = useState("");
  const [isCreateBookModalOpen, setCraeteBookModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number>(0);
  const [isUpdateBookModalOpen, setUpdateBookModalOpen] = useState(false);
  const [detailId, setDetailId] = useState<number>(0);
  const [isDetailBookModalOpen, setDetailBookModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getBookList(name);

      if (data.status === 201 || data.status === 200) {
        setBookList(data.data);
      }
    } catch (error: unknown) {
      // 原本是any类型，这里做了类型守卫：检查是否是 axios 错误
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || "查询失败");
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("未知错误");
      }
    }
  }, [name]);

  // 处理创建图书成功的回调，将创建成功后返回的book 添加到列表，节省一次查询
  const handleCreateSuccess = useCallback(
    (newBook?: Book) => {
      if (newBook) {
        // 直接添加新书到列表开头
        setBookList((prevList) => [newBook, ...prevList]);
      } else {
        // 如果没有返回新书数据，则重新获取
        fetchData();
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function searchBook(values: { name: string }) {
    setName(values.name);
  }

  const handleAddBook = () => {
    setCraeteBookModalOpen(true);
  };

  const handleUpdateClick = (id: number) => {
    setUpdateId(id);
    setUpdateBookModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteBookById(id);
    // 因为使用json文件模拟数据库，这里延迟执行，否则获取的数据是旧数据；
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  return (
    <div id="bookManage">
      {/* 创建图书弹窗 */}
      <CreateBookModal
        isOpen={isCreateBookModalOpen}
        handleClose={() => {
          setCraeteBookModalOpen(false);
        }}
        onCreateSuccess={handleCreateSuccess}
      ></CreateBookModal>
      <UpdateBookModal
        id={updateId}
        isOpen={isUpdateBookModalOpen}
        handleClose={() => {
          setUpdateBookModalOpen(false);
        }}
        onUpdateSuccess={handleCreateSuccess}
      ></UpdateBookModal>
      <BookDetailModal
        id={detailId}
        isOpen={isDetailBookModalOpen}
        handleClose={() => {
          setDetailBookModalOpen(false);
        }}
      ></BookDetailModal>
      <h1>图书管理系统</h1>
      <div className="content">
        <div className="book-search">
          <Form
            onFinish={searchBook}
            name="search"
            layout="inline"
            colon={false}
          >
            <Form.Item label="图书名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="">
              <Button type="primary" htmlType="submit">
                搜索图书
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "green", marginLeft: "10px" }}
                onClick={handleAddBook}
              >
                添加图书
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="book-list">
          {bookList.map((book) => {
            return (
              <Card
                className="card"
                key={book.id}
                hoverable
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src={`http://localhost:3000/${book.cover}`}
                  />
                }
              >
                <h2>{book.name}</h2>
                <div>{book.author}</div>
                <div className="links">
                  <a
                    href="#"
                    onClick={() => {
                      setDetailId(book.id);
                      setDetailBookModalOpen(true);
                    }}
                  >
                    详情
                  </a>
                  <a href="#" onClick={() => handleUpdateClick(book.id)}>
                    编辑
                  </a>
                  <Popconfirm
                    title="图书删除"
                    description="确认删除吗？"
                    onConfirm={() => handleDelete(book.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a href="#">删除</a>
                  </Popconfirm>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BookManage;
