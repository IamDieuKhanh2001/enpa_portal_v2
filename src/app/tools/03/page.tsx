// src/app/tools/03/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Card, CardContent, CardHeader } from "@/component/common/Card";
import { Button } from "@/component/common/Button";
import { Alert } from "@/component/common/Alert";
import { IconLoader2 } from "@tabler/icons-react";
// --- Thay đổi import Toast ---
// import { ToastContainer } from 'react-toastify'; // << Bỏ import Container
// import 'react-toastify/dist/ReactToastify.css'; // << Giữ CSS nếu cần cho các tool khác
import { Toaster, toast } from "sonner"; // << Import Toaster và toast từ sonner
// -----------------------------

// Import các thành phần và logic đã tách
import EditableProductTable from "./components/EditableProductTable";

import PreviewModal from "./components/PreviewModal";
import { useJobPolling } from "./hooks/useJobPolling";
import { validateRows } from "./lib/validation";
import { createNewProductRow } from "./lib/utils";
import { templates } from "./constants";
import { useHeader } from "@/app/context/HeaderContext";
import type { ProductRow, AllErrors, BackendJobStatus } from "./types";

// Type cho Sonner toast ID (có thể là string hoặc number)
type SonnerToastId = string | number;

export default function TwoPriceImagePage() {
  // --- Khai báo State ---
  const [isClient, setIsClient] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<AllErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);
  const [modifiedRowIds, setModifiedRowIds] = useState<Set<string>>(new Set());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Refs to store active toast IDs for FTP uploads using Sonner
  const goldUploadToastIdRef = useRef<SonnerToastId | null>(null);
  const rcabinetUploadToastIdRef = useRef<SonnerToastId | null>(null);

  // --- Callback handlers for FTP status updates from the hook using Sonner ---
  const handleFtpSuccess = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      // Với Sonner, hiển thị toast success mới.
      // Có thể dismiss toast loading cũ trước nếu ID tồn tại.
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.success(message);
    },
    [] // No dependencies needed
  );

  const handleFtpError = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      // Cập nhật toast loading thành error hoặc hiển thị error mới nếu không có ID
      if (toastIdRef.current) {
        toast.error(message, { id: toastIdRef.current }); // Cập nhật toast loading thành error
        toastIdRef.current = null; // Xóa ID sau khi cập nhật
      } else {
        toast.error(message); // Hiển thị toast lỗi mới nếu không có ID loading
      }
    },
    [] // No dependencies
  );
  // ----------------------------------------------------------------

  // --- Sử dụng Custom Hook cho Polling ---
  const handleJobNotFound = useCallback(() => {
    setJobId(null);
    setGlobalAlert(
      "現在のジョブが見つかりませんでした。新しいジョブを開始します。"
    );
    // Dismiss any active upload toasts if job disappears
    if (goldUploadToastIdRef.current) {
      toast.dismiss(goldUploadToastIdRef.current);
      goldUploadToastIdRef.current = null;
    }
    if (rcabinetUploadToastIdRef.current) {
      toast.dismiss(rcabinetUploadToastIdRef.current);
      rcabinetUploadToastIdRef.current = null;
    }
  }, []);

  const {
    jobStatus,
    setJobStatus,
    isLoading: isPollingLoading,
    stopPolling,
  } = useJobPolling({
    jobId,
    isOpen: isPreviewModalOpen,
    onJobNotFound: handleJobNotFound,
    onFtpSuccess: handleFtpSuccess, // << Pass success handler
    onFtpError: handleFtpError, // << Pass error handler
  });
  //------------------------------------
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("二重価格セール画像生成");
  }, [setTitle]);

  // Khởi tạo component phía client và dòng đầu tiên
  useEffect(() => {
    setIsClient(true);
    const initialRow = createNewProductRow("initial-page-load");
    setProductRows([initialRow]);
    setModifiedRowIds(new Set([initialRow.id]));
  }, []);

  // Callback cập nhật productRows và modifiedRowIds
  const handleSetProductRows = useCallback(
    (newRowsOrFn: ProductRow[] | ((prev: ProductRow[]) => ProductRow[])) => {
      setProductRows((prevRows) => {
        const newRows =
          typeof newRowsOrFn === "function"
            ? newRowsOrFn(prevRows)
            : newRowsOrFn;

        if (typeof newRowsOrFn !== "function") {
          // Import case
          setModifiedRowIds(new Set(newRows.map((r) => r.id)));
          setJobId(null);
          setJobStatus(null);
        } else {
          // Delete/Reset case
          const currentIds = new Set(newRows.map((r) => r.id));
          setModifiedRowIds((prevModified) => {
            const nextModified = new Set(prevModified);
            prevModified.forEach((id) => {
              if (!currentIds.has(id)) {
                nextModified.delete(id);
              }
            });
            // Handle reset of the last row
            if (
              prevRows.length === 1 &&
              newRows.length === 1 &&
              prevRows[0].id !== newRows[0].id
            ) {
              nextModified.clear();
              nextModified.add(newRows[0].id);
              setJobId(null);
              setJobStatus(null);
            }
            return nextModified;
          });
        }
        return newRows;
      });
    },
    [setJobStatus]
  );

  // Xử lý đóng modal preview
  const handleCloseModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setIsApiLoading(false);
    stopPolling();
    // Dismiss any active upload toasts when closing modal manually
    if (goldUploadToastIdRef.current) {
      toast.dismiss(goldUploadToastIdRef.current);
      goldUploadToastIdRef.current = null;
    }
    if (rcabinetUploadToastIdRef.current) {
      toast.dismiss(rcabinetUploadToastIdRef.current);
      rcabinetUploadToastIdRef.current = null;
    }
  }, [stopPolling]);

  // Xử lý click nút Preview (tạo hoặc cập nhật job) - Sử dụng Sonner toast
  const handlePreviewClick = async () => {
    setGlobalAlert(null);
    const { errors: validationErrors, isValid } = validateRows(productRows);
    setErrors(validationErrors);
    setShowErrors(true);
    if (!isValid) {
      setGlobalAlert("入力内容にエラーがあります。確認してください。");
      return;
    }

    setIsApiLoading(true);
    setIsPreviewModalOpen(true);
    setShowErrors(false);

    try {
      let currentJobId = jobId;
      if (!currentJobId) {
        // POST
        console.log(">>> [DEBUG][Page] Creating new job (POST)");
        setJobStatus(null);
        const payload = { productRows };
        const response = await fetch("/api/tools/03/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok)
          throw new Error(
            `HTTP error ${response.status}: ${await response.text()}`
          );
        const data = await response.json();
        setJobId(data.jobId);
        setIsApiLoading(false);
        setModifiedRowIds(new Set());
        console.log(
          ">>> [DEBUG][Page] Job creation initiated. Polling will start."
        );
      } else {
        // PATCH
        console.log(
          ">>> [DEBUG][Page] Updating job (PATCH), Job ID:",
          currentJobId
        );
        const rowsToUpdate = productRows.filter((row) =>
          modifiedRowIds.has(row.id)
        );
        if (rowsToUpdate.length > 0) {
          setJobStatus((prev) =>
            prev
              ? {
                  ...prev,
                  status: "Processing",
                  progress: 0,
                  results: Object.entries(prev.results).reduce(
                    (acc, [key, val]) => {
                      (acc as any)[key] = modifiedRowIds.has(key)
                        ? {
                            ...val,
                            status: "Processing",
                            message: null,
                            filename: null,
                          }
                        : val;
                      return acc;
                    },
                    {} as BackendJobStatus["results"]
                  ),
                  total: productRows.length,
                  message: null,
                  endTime: null,
                  ftpUploadStatusGold: "idle",
                  ftpUploadErrorGold: null,
                  ftpUploadStatusRcabinet: "idle",
                  ftpUploadErrorRcabinet: null,
                }
              : null
          );
          const payload = { productRows: rowsToUpdate };
          const response = await fetch(`/api/tools/03/jobs/${currentJobId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok)
            throw new Error(
              `HTTP error ${response.status}: ${await response.text()}`
            );
          setIsApiLoading(false);
          setModifiedRowIds(new Set());
          console.log(
            ">>> [DEBUG][Page] Job update initiated. Polling should continue/restart."
          );
        } else {
          console.log(">>> [DEBUG][Page] No rows modified, skipping PATCH.");
          setIsApiLoading(false);
        }
      }
    } catch (error) {
      console.error(">>> [DEBUG][Page] Error in handlePreviewClick:", error);
      // Gọi toast.error của Sonner
      toast.error(
        `プレビュー処理中にエラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setIsApiLoading(false);
      if (
        !(
          error instanceof Error &&
          (error.message.includes("404") ||
            error.message.includes("Job not found"))
        )
      ) {
        setJobStatus((prev) =>
          prev
            ? {
                ...prev,
                status: "Failed",
                message: error instanceof Error ? error.message : String(error),
              }
            : null
        );
      }
    }
  };

  // Xử lý Download Zip - Sử dụng Sonner toast
  const handleDownloadZip = () => {
    if (!jobId || jobStatus?.status === "Failed") {
      // Gọi toast.error của Sonner
      toast.error("ダウンロードするジョブが見つからないか、失敗しました。");
      return;
    }
    window.open(`/api/tools/03/jobs/${jobId}/download`, "_blank");
  };

  // Xử lý Upload FTP - Sử dụng Sonner toast
  const handleUploadFTP = async (target: "gold" | "rcabinet") => {
    if (
      !jobId ||
      !jobStatus ||
      !["Completed", "Completed with errors"].includes(jobStatus.status)
    ) {
      // Gọi toast.error của Sonner
      toast.error(
        "アップロードするジョブが見つからないか、まだ完了していません。"
      );
      return;
    }

    const targetName = target === "gold" ? "Rakuten GOLD" : "R-Cabinet";
    const toastIdRef =
      target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
    const ftpStatusKey =
      target === "gold" ? "ftpUploadStatusGold" : "ftpUploadStatusRcabinet";
    const ftpErrorKey =
      target === "gold" ? "ftpUploadErrorGold" : "ftpUploadErrorRcabinet";

    if (toastIdRef.current || jobStatus[ftpStatusKey] === "uploading") {
      // Gọi toast.info của Sonner
      toast.info(`${targetName} へのアップロードは既に進行中です。`);
      return;
    }

    setJobStatus((prev) =>
      prev
        ? { ...prev, [ftpStatusKey]: "uploading", [ftpErrorKey]: null }
        : null
    );

    // Gọi toast.loading của Sonner và lưu ID
    toastIdRef.current = toast.loading(
      `${targetName} へのアップロードを開始しています...`
    );

    try {
      const response = await fetch(`/api/tools/03/jobs/${jobId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      if (response.status === 202) {
        console.log(
          `>>> [DEBUG][Page] ${targetName} upload initiated. Polling will track status.`
        );
        // Không làm gì với toast loading ở đây, hook sẽ xử lý kết quả
      } else {
        // Lỗi API ban đầu
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (e) {
          /* Ignore */
        }
        // Cập nhật toast loading thành error bằng Sonner
        if (toastIdRef.current) {
          toast.error(
            `${targetName} へのアップロード開始に失敗しました: ${errorDetail}`,
            { id: toastIdRef.current }
          );
          toastIdRef.current = null; // Xóa ref
        }
        setJobStatus((prev) =>
          prev
            ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorDetail }
            : null
        );
      }
    } catch (error) {
      // Lỗi mạng hoặc lỗi khác
      console.error(`Failed to start ${target} upload:`, error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // Cập nhật toast loading thành error bằng Sonner
      if (toastIdRef.current) {
        toast.error(
          `${targetName} へのアップロード開始に失敗しました: ${errorMessage}`,
          { id: toastIdRef.current }
        );
        toastIdRef.current = null; // Xóa ref
      }
      setJobStatus((prev) =>
        prev
          ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorMessage }
          : null
      );
    } finally {
      // No setIsLoading needed
    }
  };
  // ---------------------------------

  const isModalLoading = isApiLoading || isPollingLoading;

  // --- JSX Trả về ---
  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader title="1. テンプレート" />
        <CardContent>
          {/* ... (template display logic) ... */}
          <div className="relative">
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex-shrink-0 text-center w-auto"
                >
                  <div
                    className="flex items-start gap-2 cursor-pointer"
                    onClick={() => setSelectedImages(template.imgs)}
                  >
                    {template.imgs.map((imgSrc, index) => (
                      <img
                        key={index}
                        src={imgSrc}
                        alt={`${template.name} part ${index + 1}`}
                        className="w-36 h-36 object-cover rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Table */}
      {isClient && (
        <EditableProductTable
          rows={productRows}
          setRows={handleSetProductRows}
          errors={errors}
          showErrors={showErrors}
          setModifiedRowIds={setModifiedRowIds}
          jobId={jobId}
          setJobId={setJobId}
        />
      )}

      {/* Global Alert */}
      {globalAlert && <Alert variant="error">{globalAlert}</Alert>}

      {/* Preview Button */}
      <div className="flex justify-center pt-4">
        <Button
          color="primary"
          onClick={handlePreviewClick}
          disabled={isModalLoading && isPreviewModalOpen}
        >
          {isModalLoading && isPreviewModalOpen ? (
            <IconLoader2 className="animate-spin mr-2" />
          ) : null}
          画像生成
        </Button>
      </div>

      {/* Template Preview Modal */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImages(null)}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Template Preview ${index + 1}`}
                className="max-w-[45vw] max-h-[80vh] object-contain rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Generated Image Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        jobStatus={jobStatus}
        isLoading={isModalLoading}
        productRows={productRows}
        onDownloadZip={handleDownloadZip}
        onUploadFTP={handleUploadFTP}
        isUploadingGold={jobStatus?.ftpUploadStatusGold === "uploading"} // Lấy trạng thái từ jobStatus
        isUploadingRcabinet={jobStatus?.ftpUploadStatusRcabinet === "uploading"} // Lấy trạng thái từ jobStatus
      />

      {/* Thêm Toaster của Sonner vào cuối component Tool03 */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
