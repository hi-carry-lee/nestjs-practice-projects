import { Descriptions, Modal, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { getBookById } from "../../utils/request";
import { isAxiosError } from "axios";

interface BookData {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

interface BookDetailProps {
  id: number;
  isOpen: boolean;
  handleClose: () => void;
}

export function BookDetailModal(props: BookDetailProps) {
  const { id, isOpen } = props;
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !id) {
      setBookData(null); // 清空之前的数据
      return;
    }

    const loadBookData = async () => {
      setLoading(true);
      try {
        const res = await getBookById(id);
        if (res.status === 200) {
          setBookData(res.data);
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          message.error(error.response?.data?.message || "查询失败");
        } else {
          message.error("查询失败");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [id, isOpen]);

  return (
    <Modal
      title="图书详情"
      width={700}
      open={isOpen}
      onCancel={props.handleClose}
      footer={null}
    >
      <Spin spinning={loading}>
        {bookData && (
          <Descriptions
            bordered
            column={1}
            labelStyle={{ width: "120px", fontWeight: "bold" }}
            contentStyle={{ padding: "12px 16px" }}
          >
            <Descriptions.Item label="图书名称">
              {bookData.name}
            </Descriptions.Item>

            <Descriptions.Item label="作者">
              {bookData.author}
            </Descriptions.Item>

            <Descriptions.Item label="描述">
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {bookData.description}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="封面">
              <BookCover src={bookData.cover} />
            </Descriptions.Item>
          </Descriptions>
        )}

        {!loading && !bookData && (
          <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
            暂无数据
          </div>
        )}
      </Spin>
    </Modal>
  );
}

// ✅ 改进的图片组件
function BookCover({ src }: { src?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!src) {
    return <div style={{ color: "#999" }}>暂无封面</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {imageLoading && <div style={{ color: "#999" }}>加载中...</div>}

      {!imageError && (
        <img
          src={`http://localhost:3000/${src}`}
          alt="封面"
          style={{
            maxWidth: 200,
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: imageLoading ? "none" : "block",
          }}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      )}

      {imageError && (
        <div
          style={{
            color: "#999",
            padding: "20px",
            border: "1px dashed #d9d9d9",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          图片加载失败
        </div>
      )}
    </div>
  );
}
