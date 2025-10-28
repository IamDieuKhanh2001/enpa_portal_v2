// src/app/tools/03/lib/utils.ts
import React from "react";
import type { ProductRow, BackendJobStatus, FtpUploadStatus } from "../types";
import { templates } from "../constants";
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconX,
  IconCloudUpload,
  IconCloudCheck,
  IconCloudOff,
} from "@tabler/icons-react";

/**
 * Tạo một đối tượng ProductRow mới với giá trị mặc định.
 * @param idPrefix - Tiền tố cho ID (thường là baseId từ useId).
 * @returns Một đối tượng ProductRow mới.
 */
export const createNewProductRow = (idPrefix: string): ProductRow => ({
  id: `${idPrefix}-${Date.now()}`, // Tạo ID duy nhất dựa trên thời gian
  productCode: "",
  template: templates[0]?.name || "", // Lấy template đầu tiên làm mặc định
  startDate: "",
  endDate: "",
  priceType: "当店通常価格", // Giá trị mặc định
  customPriceType: "",
  regularPrice: "",
  salePrice: "",
  saleText: "",
  discount: "", // Sẽ được tính toán sau
  discountType: "percent", // Mặc định là %
  mobileStartDate: "",
  mobileEndDate: "",
});

/**
 * Tính toán và định dạng chuỗi hiển thị giảm giá (%OFF hoặc 円OFF).
 * @param regularPriceStr - Giá gốc (dạng string).
 * @param salePriceStr - Giá sale (dạng string).
 * @param type - Loại giảm giá ('percent' hoặc 'yen').
 * @returns Chuỗi hiển thị giảm giá hoặc chuỗi rỗng.
 */
export const calculateDiscountDisplay = (
  regularPriceStr: string,
  salePriceStr: string,
  type: "percent" | "yen" | ""
): string => {
  const regularPrice = parseFloat(regularPriceStr);
  const salePrice = parseFloat(salePriceStr);
  // Kiểm tra tính hợp lệ của giá và loại giảm giá
  if (
    type &&
    !isNaN(regularPrice) &&
    !isNaN(salePrice) &&
    regularPrice > salePrice // Chỉ tính khi giá gốc > giá sale
  ) {
    if (type === "percent") {
      // Thêm kiểm tra regularPrice > 0 trước khi chia
      if (regularPrice > 0) {
        const percentage = Math.round(
          // Làm tròn phần trăm
          ((regularPrice - salePrice) / regularPrice) * 100
        );
        // Đảm bảo kết quả phép toán là số trước khi dùng trong template literal
        if (!isNaN(percentage)) {
          return `${percentage}%OFF`;
        }
      }
    } else {
      // type === 'yen'
      const difference = Math.round(regularPrice - salePrice); // Làm tròn số tiền Yên
      // Đảm bảo kết quả phép toán là số
      if (!isNaN(difference)) {
        return `${difference.toLocaleString()}円OFF`; // Định dạng số tiền và thêm ký hiệu Yên
      }
    }
  }
  return ""; // Trả về rỗng nếu không hợp lệ hoặc chia cho 0
};

/**
 * Chuyển đổi chuỗi ngày tháng tiếng Nhật (vd: "10月27日16:44") sang định dạng ISO (YYYY-MM-DDTHH:mm).
 * Giả định năm là năm hiện tại hoặc năm sau nếu tháng nhập vào nhỏ hơn tháng hiện tại.
 * @param dateStr - Chuỗi ngày tháng tiếng Nhật.
 * @returns Chuỗi định dạng ISO hoặc chuỗi rỗng nếu không parse được.
 */
export const parseJapaneseDate = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes("月")) return ""; // Kiểm tra cơ bản
  // Regex để trích xuất tháng, ngày, giờ, phút
  const match = dateStr.match(/(\d{1,2})月(\d{1,2})日(\d{1,2}):(\d{1,2})/);
  if (!match) return "";

  const [, month, day, hour, minute] = match.map(Number); // Chuyển các group thành số

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth trả về 0-11

  // Xác định năm: nếu tháng nhập < tháng hiện tại => năm sau, ngược lại là năm hiện tại
  const year = month < currentMonth ? currentYear + 1 : currentYear;

  // Định dạng các thành phần thành 2 chữ số (vd: '01', '09')
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");
  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  // Trả về định dạng YYYY-MM-DDTHH:mm
  return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
};

/**
 * Trả về Icon tương ứng với trạng thái của Job.
 * @param status - Trạng thái Job ('Pending', 'Processing', 'Completed', etc.).
 * @returns React Node của Icon hoặc null.
 */
export const getJobStatusIcon = (
  status: BackendJobStatus["status"] | "Pending"
): React.ReactNode => {
  switch (status) {
    case "Pending":
      return <IconLoader2 className="h-5 w-5 text-gray-500" />;
    case "Processing":
      return <IconLoader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case "Completed":
      return <IconCircleCheck className="h-5 w-5 text-green-500" />;
    case "Completed with errors":
      return <IconAlertCircle className="h-5 w-5 text-yellow-500" />;
    case "Failed":
      return <IconX className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả tương ứng với trạng thái của Job.
 * @param status - Trạng thái Job.
 * @returns Chuỗi mô tả trạng thái.
 */
export const getJobStatusText = (
  status: BackendJobStatus["status"] | "Pending"
): string => {
  switch (status) {
    case "Pending":
      return "待機中...";
    case "Processing":
      return "画像生成中...";
    case "Completed":
      return "完了しました";
    case "Completed with errors":
      return "一部エラーで完了しました";
    case "Failed":
      return "失敗しました";
    default:
      return "不明";
  }
};

/**
 * Trả về Icon tương ứng với trạng thái Upload FTP.
 * @param status - Trạng thái FTP ('idle', 'uploading', 'success', 'failed').
 * @returns React Node của Icon hoặc null.
 */
export const getFtpStatusIcon = (status?: FtpUploadStatus): React.ReactNode => {
  switch (status) {
    case "uploading":
      return (
        <IconCloudUpload className="h-4 w-4 animate-pulse text-blue-500" />
      );
    case "success":
      return <IconCloudCheck className="h-4 w-4 text-green-500" />;
    case "failed":
      return <IconCloudOff className="h-4 w-4 text-red-500" />;
    case "idle":
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả tương ứng với trạng thái Upload FTP (bao gồm cả lỗi).
 * @param status - Trạng thái FTP.
 * @param error - Thông báo lỗi (nếu có).
 * @returns Chuỗi mô tả trạng thái hoặc null.
 */
export const getFtpStatusText = (
  status?: FtpUploadStatus,
  error?: string | null
): string | null => {
  switch (status) {
    case "uploading":
      return "アップロード中...";
    case "success":
      return "アップロード完了";
    case "failed":
      return error || "アップロード失敗"; // Hiển thị lỗi cụ thể nếu có
    case "idle":
    default:
      return null;
  }
};
