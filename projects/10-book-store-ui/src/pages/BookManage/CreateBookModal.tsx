import { Button, Form, Input, message, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { createBook } from "../../utils/request";
import { isAxiosError } from "axios";
import type { Book } from "./index";
import { CoverUpload } from "./Coverupload";

interface CreateBookModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onCreateSuccess?: (newBook: Book) => void; // 新增：创建成功的回调
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface CreateBook {
  name: string;
  author: string;
  description: string;
  cover: string;
}

export function CreateBookModal(props: CreateBookModalProps) {
  const [form] = useForm<CreateBook>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await createBook(values);

      if (res.status === 201 || res.status === 200) {
        message.success("创建成功");
        form.resetFields();
        props.handleClose();

        const newBook = res.data as Book;

        // window.location.reload();
        // 调用父组件传递的刷新方法，而不是刷新整个页面
        props.onCreateSuccess?.(newBook);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || "创建失败");
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("未知错误");
      }
    }
  };

  return (
    <Modal
      title="新增图书"
      style={{ textAlign: "center" }}
      width={600} // 官方推荐的设置宽度方式，高度由内容指定
      open={props.isOpen}
      // 这个是Modal右上角的关闭按钮
      onCancel={() => props.handleClose()}
      // onOk={handleOk}
      // okText={"创建"}
      // 用footer属性来设置底部按钮，方便自定义样式
      // 使用 footer 属性之后，上面的两个就不需要了
      footer={
        <div style={{ textAlign: "right", paddingRight: "40px" }}>
          <Space>
            <Button onClick={() => props.handleClose()}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              创建
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
