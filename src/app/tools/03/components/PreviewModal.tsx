// src/app/tools/03/components/PreviewModal.tsx
import React from "react";
import { Button } from "@/component/common/Button";
import { cn } from "@/lib/utils";
import type { BackendJobStatus, FtpUploadStatus, ProductRow } from "../types";
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconX,
  IconDownload,
  IconUpload,
  IconCircleX,
  IconCloudUpload,
  IconCloudCheck,
  IconCloudOff,
} from "@tabler/icons-react";
import {
  getJobStatusIcon,
  getJobStatusText,
  getFtpStatusIcon,
  getFtpStatusText,
} from "../lib/utils"; // Import utils

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobStatus: BackendJobStatus | null;
  isLoading: boolean; // Loading ban đầu hoặc khi đang polling
  productRows: ProductRow[];
  onDownloadZip: () => void;
  onUploadFTP: (target: "gold" | "rcabinet") => void;
  isUploadingGold: boolean; // Trạng thái loading tạm thời của nút bấm Gold
  isUploadingRcabinet: boolean; // Trạng thái loading tạm thời của nút bấm R-Cabinet
}

function PreviewModal({
  isOpen,
  onClose,
  jobStatus,
  isLoading, // Trạng thái loading tổng hợp từ hook polling và API call ban đầu
  productRows,
  onDownloadZip,
  onUploadFTP,
  isUploadingGold,
  isUploadingRcabinet,
}: PreviewModalProps) {
  // **** THÊM CONSOLE LOG Ở ĐÂY ****
  console.log(
    ">>> [DEBUG][PreviewModal V2 LOG ADDED] Rendering with jobStatus prop:",
    JSON.stringify(jobStatus) // Stringify để log đầy đủ object
  );
  console.log(
    ">>> [DEBUG][PreviewModal V2 LOG ADDED] isLoading prop:",
    isLoading
  );
  // ********************************

  if (!isOpen) return null;

  // Calculate progress
  const currentTotal = jobStatus?.total ?? productRows.length;
  const currentProgress = jobStatus?.progress ?? 0;
  const progressPercentage = currentTotal
    ? (currentProgress / currentTotal) * 100
    : 0;

  // Xác định trạng thái job và FTP
  const isJobFinished =
    jobStatus?.status === "Completed" ||
    jobStatus?.status === "Completed with errors";
  const isJobFailed = jobStatus?.status === "Failed";
  const isJobRunning =
    jobStatus?.status === "Processing" || jobStatus?.status === "Pending";

  // Biến kiểm tra xem có đang upload FTP nào không (bao gồm cả trạng thái loading nút bấm và trạng thái thực từ backend)
  const isAnyFtpUploading =
    isUploadingGold ||
    isUploadingRcabinet ||
    jobStatus?.ftpUploadStatusGold === "uploading" ||
    jobStatus?.ftpUploadStatusRcabinet === "uploading";

  // Biến kiểm tra xem có thể thực hiện hành động (Download/Upload) không
  const canPerformActions = isJobFinished && !isJobFailed;

  // Create a map from row ID to product code for easy lookup
  const rowIdToProductCodeMap = productRows.reduce((acc, row) => {
    acc[row.id] = row.productCode;
    return acc;
  }, {} as { [key: string]: string });

  // Get a set of current row IDs to filter results later
  const currentRowIds = new Set(productRows.map((row) => row.id));

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">画像プレビュー</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 flex-grow overflow-y-auto">
          {/* Status Bar */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md border space-y-2">
            {/* Job Status Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getJobStatusIcon(jobStatus?.status ?? "Pending")}
                <span className="font-medium">
                  {getJobStatusText(jobStatus?.status ?? "Pending")}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {currentProgress} / {currentTotal} 件処理済み
              </span>
            </div>
            {/* Progress Bar */}
            {(isJobRunning || isLoading) && !isJobFailed && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    // If overall loading is true but status isn't processing yet, show pulse
                    isLoading && jobStatus?.status !== "Processing"
                      ? "bg-gray-400 animate-pulse"
                      : "bg-blue-600"
                  )}
                  style={{
                    // Show 100% width pulse if initial loading, otherwise show percentage
                    width: `${
                      isLoading && jobStatus?.status !== "Processing"
                        ? 100
                        : progressPercentage
                    }%`,
                  }}
                ></div>
              </div>
            )}
            {/* FTP Status Line */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-200 mt-2">
              {/* GOLD Status */}
              <div className="flex items-center space-x-1">
                <span>GOLD:</span>
                {getFtpStatusIcon(jobStatus?.ftpUploadStatusGold)}
                <span title={jobStatus?.ftpUploadErrorGold ?? undefined}>
                  {getFtpStatusText(
                    jobStatus?.ftpUploadStatusGold,
                    jobStatus?.ftpUploadErrorGold
                  )}
                </span>
              </div>
              {/* R-Cabinet Status */}
              <div className="flex items-center space-x-1">
                <span>R-Cabinet:</span>
                {getFtpStatusIcon(jobStatus?.ftpUploadStatusRcabinet)}
                <span title={jobStatus?.ftpUploadErrorRcabinet ?? undefined}>
                  {getFtpStatusText(
                    jobStatus?.ftpUploadStatusRcabinet,
                    jobStatus?.ftpUploadErrorRcabinet
                  )}
                </span>
              </div>
            </div>
            {/* General Job Error Message */}
            {jobStatus?.message && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {jobStatus.message}
              </div>
            )}
            {/* Warning for partial completion */}
            {jobStatus?.status === "Completed with errors" &&
              !jobStatus.message && (
                <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                  一部の画像の生成に失敗しました。詳細は各画像をご確認ください。
                </div>
              )}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Skeleton Loading State */}
            {isLoading &&
              (!jobStatus || Object.keys(jobStatus.results).length === 0) &&
              Array.from({ length: productRows.length }).map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm animate-pulse"
                >
                  <div className="w-40 h-40 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            {/* Actual Image Results */}
            {jobStatus?.results &&
              Object.entries(jobStatus.results)
                .filter(([rowId]) => currentRowIds.has(rowId))
                .map(([rowId, result]) => {
                  const productCode =
                    rowIdToProductCodeMap[rowId] || `item-${rowId.slice(-3)}`;
                  const cacheBuster =
                    jobStatus?.endTime || jobStatus?.startTime || Date.now();
                  const imageUrl =
                    result.status === "Success" &&
                    result.filename &&
                    jobStatus?.jobId
                      ? `/api/tools/03/jobs/${
                          jobStatus.jobId
                        }/image/${encodeURIComponent(
                          result.filename
                        )}?v=${cacheBuster}`
                      : "/img/placeholder_error.png"; // Placeholder if error or processing

                  return (
                    <div
                      key={rowId}
                      className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm"
                    >
                      <div className="w-40 h-40 mb-2 flex items-center justify-center bg-gray-100 rounded">
                        {result.status === "Processing" ||
                        result.status === "Pending" ? (
                          <IconLoader2
                            size={32}
                            className="animate-spin text-blue-400"
                          />
                        ) : (
                          <img
                            src={imageUrl}
                            alt={`Preview for ${productCode}`}
                            className="max-w-full max-h-full object-contain rounded"
                            // Optional: Add error handling for images
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = "/img/placeholder_error.png";
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="text-sm font-medium truncate w-full"
                        title={productCode}
                      >
                        {" "}
                        {productCode}{" "}
                      </p>
                      <div className="flex items-center text-xs mt-1">
                        {result.status === "Success" && (
                          <IconCircleCheck
                            size={14}
                            className="text-green-500 mr-1 flex-shrink-0"
                          />
                        )}
                        {result.status === "Error" && (
                          <IconCircleX
                            size={14}
                            className="text-red-500 mr-1 flex-shrink-0"
                          />
                        )}
                        {(result.status === "Processing" ||
                          result.status === "Pending") && (
                          <IconLoader2
                            size={14}
                            className="text-blue-500 mr-1 flex-shrink-0 animate-spin"
                          />
                        )}
                        <span
                          className={cn(
                            "truncate",
                            result.status === "Success" && "text-green-600",
                            result.status === "Error" && "text-red-600",
                            (result.status === "Processing" ||
                              result.status === "Pending") &&
                              "text-blue-600"
                          )}
                          title={result.message ?? result.status}
                        >
                          {result.message ? result.message : result.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="flex justify-center items-center p-4 border-t space-x-3 bg-gray-50">
          <Button color="grey" onClick={onClose}>
            {" "}
            修正 (閉じる){" "}
          </Button>
          <Button
            color="secondary"
            onClick={onDownloadZip}
            // Vô hiệu hóa nếu job chưa xong/lỗi HOẶC đang upload FTP
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            <IconDownload size={18} className="mr-1.5" /> 全画像をダウンロード
          </Button>
          <Button
            color="primary"
            onClick={() => onUploadFTP("gold")}
            // Vô hiệu hóa nếu job chưa xong/lỗi HOẶC đang upload FTP (bất kỳ cái nào)
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {/* Vẫn hiển thị loader dựa trên trạng thái GOLD cụ thể */}
            {isUploadingGold ||
            jobStatus?.ftpUploadStatusGold === "uploading" ? (
              <IconLoader2 size={18} className="mr-1.5 animate-spin" />
            ) : (
              <IconUpload size={18} className="mr-1.5" />
            )}
            GOLDにアップロード
          </Button>
          <Button
            color="primary"
            onClick={() => onUploadFTP("rcabinet")}
            // Vô hiệu hóa nếu job chưa xong/lỗi HOẶC đang upload FTP (bất kỳ cái nào)
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {/* Vẫn hiển thị loader dựa trên trạng thái R-Cabinet cụ thể */}
            {isUploadingRcabinet ||
            jobStatus?.ftpUploadStatusRcabinet === "uploading" ? (
              <IconLoader2 size={18} className="mr-1.5 animate-spin" />
            ) : (
              <IconUpload size={18} className="mr-1.5" />
            )}
            R-Cabinetにアップロード
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal; // Export component
