// src/app/tools/03/hooks/useJobPolling.ts
import { useState, useEffect, useRef, useCallback } from "react";
// --- Thay đổi import Toast ---
// import { toast } from "react-toastify";
import { toast } from "sonner"; // << Import từ sonner
// -----------------------------
import type { BackendJobStatus } from "../types";

// --- Interface và các helper function giữ nguyên ---
interface UseJobPollingProps {
  jobId: string | null;
  isOpen: boolean;
  onJobNotFound?: () => void;
  onPollingError?: (error: Error) => void;
  onFtpSuccess?: (target: "gold" | "rcabinet", message: string) => void;
  onFtpError?: (target: "gold" | "rcabinet", message: string) => void;
}

function isFtpFinalState(status?: string | null): boolean {
  return status === "success" || status === "failed";
}

function isFtpUploading(status?: string | null): boolean {
  return status === "uploading";
}

function isJobProcessingFinished(status?: string | null): boolean {
  return !["Pending", "Processing"].includes(status || "");
}
// --------------------------------------------------

export function useJobPolling({
  jobId,
  isOpen,
  onJobNotFound,
  onPollingError,
  onFtpSuccess,
  onFtpError,
}: UseJobPollingProps) {
  // --- State và Refs giữ nguyên ---
  const [jobStatus, setJobStatus] = useState<BackendJobStatus | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousJobStatusRef = useRef<BackendJobStatus | null>(null);
  const latestIsOpenRef = useRef(isOpen);
  const latestJobIdRef = useRef(jobId);
  const onJobNotFoundRef = useRef(onJobNotFound);
  const onPollingErrorRef = useRef(onPollingError);
  const onFtpSuccessRef = useRef(onFtpSuccess);
  const onFtpErrorRef = useRef(onFtpError);

  useEffect(() => {
    latestIsOpenRef.current = isOpen;
    latestJobIdRef.current = jobId;
    onJobNotFoundRef.current = onJobNotFound;
    onPollingErrorRef.current = onPollingError;
    onFtpSuccessRef.current = onFtpSuccess;
    onFtpErrorRef.current = onFtpError;
  }, [isOpen, jobId, onJobNotFound, onPollingError, onFtpSuccess, onFtpError]);

  useEffect(() => {
    previousJobStatusRef.current = jobStatus;
  }, [jobStatus]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log("[Hook] stop interval");
    }
  }, []);
  // -----------------------------

  const runPollingIteration = useCallback(async () => {
    const currentIsOpen = latestIsOpenRef.current;
    const targetJobId = latestJobIdRef.current;
    if (!currentIsOpen || !targetJobId || !pollingIntervalRef.current) {
      if (pollingIntervalRef.current) stopPolling();
      return;
    }

    try {
      const response = await fetch(`/api/tools/03/jobs/${targetJobId}/status`);

      if (
        !latestIsOpenRef.current ||
        latestJobIdRef.current !== targetJobId ||
        !pollingIntervalRef.current
      ) {
        if (pollingIntervalRef.current) stopPolling();
        return;
      }

      if (response.status === 404) {
        // Gọi toast.error của Sonner
        toast.error("ジョブが見つかりません。");
        stopPolling();
        setJobStatus(null);
        onJobNotFoundRef.current?.();
        return;
      }

      if (!response.ok) {
        onPollingErrorRef.current?.(
          new Error(`Polling failed with status ${response.status}`)
        );
        return; // Thử lại ở lần poll sau
      }

      const newData: BackendJobStatus = await response.json();
      console.log("[Hook] polling RECEIVED:", JSON.stringify(newData));
      const prevData = previousJobStatusRef.current;
      setJobStatus(newData); // Cập nhật state

      // --- Kiểm tra chuyển đổi trạng thái và gọi toast/callback ---

      // Chuyển đổi trạng thái Job Processing
      if (
        prevData?.status &&
        !isJobProcessingFinished(prevData.status) &&
        isJobProcessingFinished(newData.status)
      ) {
        if (newData.status === "Completed")
          // Gọi toast.success của Sonner
          toast.success("画像の生成が完了しました。");
        else if (newData.status === "Completed with errors")
          // Gọi toast.warn của Sonner
          toast.warning("一部のプレビュー生成に失敗しました。");
        else if (newData.status === "Failed")
          // Gọi toast.error của Sonner
          toast.error(
            `画像の生成に失敗しました: ${newData.message || "不明なエラー"}`
          );
      }

      // Chuyển đổi trạng thái GOLD FTP (Gọi callback)
      if (
        isFtpUploading(prevData?.ftpUploadStatusGold) &&
        isFtpFinalState(newData.ftpUploadStatusGold)
      ) {
        if (newData.ftpUploadStatusGold === "success") {
          onFtpSuccessRef.current?.(
            "gold",
            "GOLDへのアップロードが完了しました。"
          );
        } else {
          onFtpErrorRef.current?.(
            "gold",
            `GOLDへのアップロードに失敗しました: ${
              newData.ftpUploadErrorGold || "不明なエラー"
            }`
          );
        }
      }

      // Chuyển đổi trạng thái R-Cabinet FTP (Gọi callback)
      if (
        isFtpUploading(prevData?.ftpUploadStatusRcabinet) &&
        isFtpFinalState(newData.ftpUploadStatusRcabinet)
      ) {
        if (newData.ftpUploadStatusRcabinet === "success") {
          onFtpSuccessRef.current?.(
            "rcabinet",
            "R-Cabinetへのアップロードが完了しました。"
          );
        } else {
          onFtpErrorRef.current?.(
            "rcabinet",
            `R-Cabinetへのアップロードに失敗しました: ${
              newData.ftpUploadErrorRcabinet || "不明なエラー"
            }`
          );
        }
      }
      // --------------------------------------------------------

      // --- Xác định khi nào dừng polling ---
      const shouldStop =
        newData.status === "Failed" ||
        (isJobProcessingFinished(newData.status) &&
          isFtpFinalState(newData.ftpUploadStatusGold) &&
          isFtpFinalState(newData.ftpUploadStatusRcabinet));

      if (shouldStop) {
        stopPolling();
      }
    } catch (error) {
      console.error("[Hook] polling error:", error);
      onPollingErrorRef.current?.(error as Error);
      // Không dừng polling khi có lỗi mạng, để thử lại
    }
  }, [stopPolling]); // Dependencies giữ nguyên

  // --- useEffect quản lý interval giữ nguyên logic ---
  useEffect(() => {
    const shouldPoll =
      isOpen &&
      !!jobId &&
      jobStatus &&
      (!isJobProcessingFinished(jobStatus.status) ||
        isFtpUploading(jobStatus.ftpUploadStatusGold) ||
        isFtpUploading(jobStatus.ftpUploadStatusRcabinet));
    const initialLoad = isOpen && !!jobId && !jobStatus;

    let firstRunTimeoutId: NodeJS.Timeout | null = null;

    if (shouldPoll || initialLoad) {
      if (!pollingIntervalRef.current) {
        firstRunTimeoutId = setTimeout(() => {
          if (latestIsOpenRef.current && latestJobIdRef.current === jobId) {
            runPollingIteration();
          }
          firstRunTimeoutId = null;
        }, 100);
        pollingIntervalRef.current = setInterval(runPollingIteration, 3000);
        console.log("[Hook] start interval (polling needed)");
      }
    } else {
      if (firstRunTimeoutId) clearTimeout(firstRunTimeoutId);
      if (pollingIntervalRef.current) {
        stopPolling();
        console.log("[Hook] stop interval (polling no longer needed)");
      }
    }
    return () => {
      if (firstRunTimeoutId) clearTimeout(firstRunTimeoutId);
      stopPolling();
      console.log("[Hook] interval cleanup on unmount/deps change");
    };
  }, [isOpen, jobId, jobStatus, stopPolling, runPollingIteration]);
  // ------------------------------------------

  // --- isLoading giữ nguyên ---
  const isLoading =
    (isOpen && !!jobId && !jobStatus) ||
    jobStatus?.status === "Processing" ||
    jobStatus?.status === "Pending" ||
    isFtpUploading(jobStatus?.ftpUploadStatusGold) ||
    isFtpUploading(jobStatus?.ftpUploadStatusRcabinet);

  return { jobStatus, setJobStatus, isLoading, stopPolling };
}
