// src/component/common/StatusModal.tsx
import React from "react";
import { Card, CardContent } from "./Card"; // Import từ file Card.tsx
import { Button } from "./Button"; // Import từ file Button.tsx
import { cn } from "@/lib/utils"; // Giả sử đường dẫn này đúng
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

// Định nghĩa kiểu cho status và icon tương ứng
type StatusType = "success" | "error" | "warning" | "info";

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; iconBgClass: string; iconColorClass: string }
> = {
  success: {
    icon: IconCheck,
    iconBgClass: "bg-green-100",
    iconColorClass: "text-green-600",
  },
  error: {
    icon: IconX,
    iconBgClass: "bg-red-100",
    iconColorClass: "text-red-600",
  },
  warning: {
    icon: IconAlertTriangle,
    iconBgClass: "bg-yellow-100",
    iconColorClass: "text-yellow-600",
  },
  info: {
    icon: IconInfoCircle,
    iconBgClass: "bg-blue-100",
    iconColorClass: "text-blue-600",
  },
};

// Định nghĩa Props cho component
interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status?: StatusType; // Mặc định là 'info' nếu không truyền
  title: string;
  message?: string | React.ReactNode; // Nội dung mô tả tùy chọn
  children?: React.ReactNode; // Khu vực để chứa nội dung phức tạp hơn (như code box)
  actions?: React.ReactNode; // Cho phép truyền các nút bấm tùy chỉnh
  hideDefaultCloseButton?: boolean; // Ẩn nút "Đóng" mặc định nếu actions được cung cấp
  disableBackdropClick?: boolean; // Vô hiệu hóa đóng modal khi click backdrop
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  status = "info", // Mặc định là 'info'
  title,
  message,
  children,
  actions,
  hideDefaultCloseButton = false,
  disableBackdropClick = false,
}) => {
  if (!isOpen) return null;

  const {
    icon: IconComponent,
    iconBgClass,
    iconColorClass,
  } = statusConfig[status];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick} //
    >
      {/* Modal Content using Card */}
      <Card className="w-full max-w-lg overflow-hidden">
        {" "}
        {/*  */}
        <CardContent className="p-6 flex flex-col gap-4">
          {" "}
          {/*  */}
          {/* Icon */}
          <div className="flex justify-center mb-0">
            {" "}
            {/* Giảm mb */}
            <div className={cn("rounded-full p-3", iconBgClass)}>
              <IconComponent className={cn("w-8 h-8", iconColorClass)} />{" "}
              {/* Tăng kích thước icon */}
            </div>
          </div>
          {/* Title */}
          <h2 className="text-center text-xl font-bold mb-0">
            {" "}
            {/* Tăng kích thước title, giảm mb */}
            {title}
          </h2>
          {/* Message (Optional) */}
          {message && (
            <p className="text-center text-sm text-gray-600 mb-2">{message}</p>
          )}
          {/* Children (Optional Content Area) */}
          {children && <div className="mb-2">{children}</div>}
          {/* Actions */}
          <div className="flex justify-center mt-2 gap-4">
            {" "}
            {/* Canh giữa và thêm gap */}
            {actions ? (
              actions
            ) : !hideDefaultCloseButton ? (
              // Nút đóng mặc định nếu không có actions và không bị ẩn
              <Button onClick={onClose} color="grey" size="md">
                {" "}
                {/*  */}
                閉じる {/* Hoặc "OK", "Đóng" tùy ngữ cảnh */}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusModal;
