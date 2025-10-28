// src/app/tools/03/types/index.ts

/**
 * Định nghĩa cấu trúc dữ liệu cho một dòng sản phẩm trong bảng.
 */
export type ProductRow = {
  id: string; // ID duy nhất cho mỗi dòng (có thể là UUID tạm thời phía client)
  productCode: string; // Mã quản lý sản phẩm (商品管理番号)
  template: string; // Tên template được chọn (テンプレート)
  startDate: string; // Thời gian bắt đầu (YYYY-MM-DDTHH:mm) (開始日時)
  endDate: string; // Thời gian kết thúc (YYYY-MM-DDTHH:mm) (終了日時)
  priceType: string; // Loại giá gốc (当店通常価格, メーカー希望小売価格, クーポン利用で, custom) (二重価格)
  customPriceType: string; // Giá trị tùy chỉnh nếu priceType là 'custom'
  regularPrice: string; // Giá gốc (số dưới dạng string) (価格)
  salePrice: string; // Giá sale (số dưới dạng string) (セール価格)
  saleText: string; // Text hiển thị cho sale (セール文言)
  discount: string; // Text hiển thị discount (tự động tính, vd: "20%OFF", "1000円OFF")
  discountType: "percent" | "yen" | ""; // Loại discount được chọn ('percent' hoặc 'yen') (割引表示)
  mobileStartDate: string; // Thời gian bắt đầu trên mobile (YYYY-MM-DDTHH:mm) (楽天モバイル開始日時)
  mobileEndDate: string; // Thời gian kết thúc trên mobile (YYYY-MM-DDTHH:mm) (楽天モバイル終了日時)
};

/**
 * Định nghĩa cấu trúc lỗi cho một dòng sản phẩm.
 * Các key tương ứng với các trường trong ProductRow có thể bị lỗi.
 */
export type RowErrors = {
  productCode?: string;
  startDate?: string;
  endDate?: string;
  regularPrice?: string;
  salePrice?: string;
  saleText?: string;
};

/**
 * Định nghĩa cấu trúc chứa tất cả lỗi, map từ ID dòng sang đối tượng RowErrors.
 */
export type AllErrors = { [key: string]: RowErrors };

/**
 * Định nghĩa cấu trúc kết quả xử lý ảnh từ backend cho một item.
 */
export type BackendImageResult = {
  status: "Processing" | "Success" | "Error" | "Pending"; // Trạng thái xử lý
  filename: string | null; // Tên file ảnh đã tạo (nếu thành công)
  message: string | null; // Thông báo lỗi (nếu có)
};

/**
 * Định nghĩa các trạng thái có thể có của quá trình upload FTP.
 */
export type FtpUploadStatus = "idle" | "uploading" | "success" | "failed";

/**
 * Định nghĩa cấu trúc đầy đủ cho trạng thái của một job xử lý ảnh từ backend.
 */
export type BackendJobStatus = {
  jobId: string; // ID của job
  status:
    | "Pending" // Đang chờ xử lý
    | "Processing" // Đang xử lý
    | "Completed" // Hoàn thành tất cả
    | "Completed with errors" // Hoàn thành nhưng có lỗi ở một số item
    | "Failed"; // Job thất bại hoàn toàn
  progress: number; // Số lượng item đã xử lý (thành công hoặc lỗi)
  total: number; // Tổng số item cần xử lý
  results: { [rowId: string]: BackendImageResult }; // Kết quả chi tiết cho từng item (map từ rowId)
  startTime: number; // Thời gian bắt đầu job (timestamp)
  endTime: number | null; // Thời gian kết thúc job (timestamp, null nếu chưa xong)
  message: string | null; // Thông báo lỗi chung của cả job (nếu có)
  ftpUploadStatusGold?: FtpUploadStatus; // Trạng thái upload lên Rakuten GOLD
  ftpUploadErrorGold?: string | null; // Lỗi khi upload lên GOLD
  ftpUploadStatusRcabinet?: FtpUploadStatus; // Trạng thái upload lên R-Cabinet
  ftpUploadErrorRcabinet?: string | null; // Lỗi khi upload lên R-Cabinet
};
