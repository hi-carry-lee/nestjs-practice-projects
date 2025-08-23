import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger, { type DraggerProps } from "antd/es/upload/Dragger";
import { useMemo } from "react";

interface CoverUploadProps {
  value?: string;
  // onChange是固定名称，因为 Form.Item 需要
  onChange?: (value: string) => void;
}

// 当组件被 Form.Item 包裹时，Ant Design 会自动向子组件注入：
// value: 当前字段的值（来自 form 的 cover 字段）
// onChange: 更新字段值的回调函数
// 所以，看似没有传递 value 和 onChange，但实际上是通过 Form.Item 的机制来处理的
export function CoverUpload(props: CoverUploadProps) {
  // ✅ 在组件顶部解构，否则 useMemo 依赖props或者 props.value时都不合适；
  const { value, onChange } = props;

  // 要想使用 antd 的 Dragger 组件，必须配置DraggerProps类型的对象，然后把它传递给 Dragger 组件
  // 通过useMemo来缓存这个对象，避免每次渲染都创建新的对象
  const uploadProps = useMemo<DraggerProps>(
    () => ({
      name: "file",
      action: "http://localhost:3000/book/upload",
      method: "post",
      // onChange：处理文件上传的各种状态
      onChange(info) {
        const { status } = info.file;
        if (status === "done") {
          // onChange：通知 Form 字段值变化
          onChange?.(info.file.response);
          message.success(`${info.file.name} 文件上传成功`);
        } else if (status === "error") {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    }),
    [onChange]
  );

  return (
    <div>
      {
        // 总是渲染上传窗口，如果 value有值则渲染图片
        value && (
          <img
            src={`http://localhost:3000/${props.value}`}
            alt="封面"
            width="100"
            style={{ marginBottom: 8, display: "block" }}
          />
        )
      }

      <Dragger {...uploadProps}>
        {/* 以ant-开头的class，是 Ant Design 中预定义的样式类 */}
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
      </Dragger>
    </div>
  );
}
