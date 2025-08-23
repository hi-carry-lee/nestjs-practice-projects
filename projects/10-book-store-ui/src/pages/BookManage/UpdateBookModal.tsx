import { Button, Form, Input, message, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { getBookById, updateBook } from "../../utils/request";
import { isAxiosError } from "axios";
import { CoverUpload } from "./Coverupload";
import { type Book } from "./index";
import { useCallback, useEffect } from "react";

interface UpdateBookModalProps {
  id: number;
  isOpen: boolean;
  handleClose: () => void;
  onUpdateSuccess?: (newBook: Book) => void;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface UpdateBook {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

export function UpdateBookModal(props: UpdateBookModalProps) {
  const { id } = props;
  // form 作为 useForm() 返回的稳定引用，可以放在 useCallback 依赖数组中；
  // 并非所有hook返回的函数都是稳定的。
  const [form] = useForm<UpdateBook>();

  const queryBookById = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const res = await getBookById(id);
      const { data } = res;
      if (res.status === 200 || res.status === 201) {
        form.setFieldValue("id", data.id);
        form.setFieldValue("name", data.name);
        form.setFieldValue("author", data.author);
        form.setFieldValue("description", data.description);
        form.setFieldValue("cover", data.cover);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || "查询失败");
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("未知错误");
      }
    }
  }, [id, form]);

  useEffect(() => {
    queryBookById();
  }, [queryBookById]);

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await updateBook({ ...values, id });

      if (res.status === 201 || res.status === 200) {
        message.success("更新成功");
        form.resetFields();
        props.handleClose();

        const newBook = res.data as Book;
        props.onUpdateSuccess?.(newBook);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || "更新失败");
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("未知错误");
      }
    }
  };

  return (
    <Modal
      title="更新图书"
      style={{ textAlign: "center" }}
      width={600}
      open={props.isOpen}
      onCancel={() => props.handleClose()}
      footer={
        <div style={{ textAlign: "right", paddingRight: "40px" }}>
          <Space>
            <Button onClick={() => props.handleClose()}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              更新
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        colon={false}
        {...layout}
        style={{ marginTop: "20px", paddingRight: "40px" }}
      >
        <Form.Item
          label="图书名称"
          name="name"
          rules={[{ required: true, message: "请输入图书名称!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
          rules={[{ required: true, message: "请输入图书作者!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入图书描述!" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="封面"
          name="cover"
          rules={[{ required: true, message: "请上传图书封面!" }]}
        >
          {/* 当组件被 Form.Item 包裹时，Ant Design 会自动向子组件注入：
              value: 当前字段的值（来自 form 的 cover 字段）
              onChange: 更新字段值的回调函数 */}
          <CoverUpload />
        </Form.Item>
      </Form>
    </Modal>
  );
}
