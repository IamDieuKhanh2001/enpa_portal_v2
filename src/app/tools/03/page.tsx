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
import { Toaster, toast } from "sonner";
import debounce from "lodash/debounce"; // debounce を lodash からインポート

// 分割されたコンポーネントとロジックをインポート
import EditableProductTable from "./components/EditableProductTable";
import PreviewModal from "./components/PreviewModal";
import RestoreSessionPopup from "./components/RestoreSessionPopup"; // 新しいポップアップをインポート
import { useJobPolling } from "./hooks/useJobPolling";
import { validateRows } from "./lib/validation";
import { createNewProductRow } from "./lib/utils";
import { templates } from "./constants";
import type { ProductRow, AllErrors, BackendJobStatus } from "./types";

// Sonner toast ID の型
type SonnerToastId = string | number;

// localStorage のキー
const LOCAL_STORAGE_KEY = "tool03_session_data_v2"; // 古いバージョンとの衝突を避けるために _v2 を追加

export default function TwoPriceImagePage() {
  // --- State の宣言 ---
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

  // セッション復元用の State
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [restoredData, setRestoredData] = useState<ProductRow[] | null>(null);
  const initialLoadRef = useRef(true); // localStorage を初回のみチェックするためのフラグ

  const goldUploadToastIdRef = useRef<SonnerToastId | null>(null);
  const rcabinetUploadToastIdRef = useRef<SonnerToastId | null>(null);

  // --- FTP ステータス更新用のコールバックハンドラー (Sonner 使用) ---
  const handleFtpSuccess = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.success(message);
    },
    []
  );

  const handleFtpError = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      if (toastIdRef.current) {
        toast.error(message, { id: toastIdRef.current });
        toastIdRef.current = null;
      } else {
        toast.error(message);
      }
    },
    []
  );
  // ----------------------------------------------------------------

  // --- ポーリング用カスタムフック ---
  const handleJobNotFound = useCallback(() => {
    setJobId(null);
    setGlobalAlert(
      "現在のジョブが見つかりませんでした。新しいジョブを開始します。"
    );
    // ジョブが見つからない場合、アクティブなアップロードトーストを閉じる
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
    onFtpSuccess: handleFtpSuccess,
    onFtpError: handleFtpError,
  });
  //------------------------------------

  // --- localStorage ロジック ---

  // State を localStorage に保存する関数 (debounce 使用)
  const saveStateToLocalStorage = useCallback(
    debounce((rowsToSave: ProductRow[]) => {
      try {
        // デフォルトの完全に空の行でない場合のみ保存
        const isDefaultEmptyRow =
          rowsToSave.length === 1 &&
          !rowsToSave[0].productCode &&
          !rowsToSave[0].startDate &&
          !rowsToSave[0].endDate &&
          !rowsToSave[0].regularPrice &&
          !rowsToSave[0].salePrice;

        if (!isDefaultEmptyRow) {
          console.log(
            "[LocalStorage] Saving state...",
            `(${rowsToSave.length} rows)`
          );
          const dataString = JSON.stringify(rowsToSave);
          localStorage.setItem(LOCAL_STORAGE_KEY, dataString);
        } else {
          // デフォルトの空行の場合はストレージから削除
          console.log(
            "[LocalStorage] Default empty row detected, removing from storage."
          );
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving state to localStorage:", error);
        toast.error(
          "セッションデータの保存中にエラーが発生しました。ストレージがいっぱいかもしれません。"
        );
      }
    }, 1500), // 1.5秒の debounce
    []
  );

  // productRows を監視し、localStorage に保存する useEffect
  useEffect(() => {
    // 初回ロード時 (復元処理を待つため) およびクライアントサイドでのみ保存
    if (!initialLoadRef.current && isClient && productRows.length > 0) {
      saveStateToLocalStorage(productRows);
    }
  }, [productRows, saveStateToLocalStorage, isClient]);

  // コンポーネントマウント時に localStorage を読み込む useEffect
  useEffect(() => {
    setIsClient(true); // クライアントサイドレンダリングをマーク

    if (initialLoadRef.current) {
      try {
        const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataString) {
          const parsedData: ProductRow[] = JSON.parse(savedDataString);
          // データが有効かチェック (配列であり、空でない)
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setRestoredData(parsedData);
            setShowRestorePopup(true);
            console.log(
              "[LocalStorage] Found saved session, showing restore popup."
            );
          } else {
            // 無効なデータの場合、削除して空行を初期化
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            initializeEmptyRow();
          }
        } else {
          // データがない場合、空行を初期化
          initializeEmptyRow();
        }
      } catch (error) {
        console.error("Error reading state from localStorage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // エラーデータを削除
        initializeEmptyRow();
        toast.error("保存されたセッションデータの読み込み中にエラーが発生しました。");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // マウント時に一度だけ実行

  // 最初の空行を初期化する関数
  const initializeEmptyRow = () => {
    console.log("[LocalStorage] Initializing with an empty row.");
    const initialRow = createNewProductRow("initial-load-empty");
    setProductRows([initialRow]);
    setModifiedRowIds(new Set([initialRow.id]));
    initialLoadRef.current = false; // 初回ロード完了をマーク
  };

  // ユーザーがセッション復元を選択したときの処理関数
  const handleRestoreSession = (restore: boolean) => {
    setShowRestorePopup(false);
    if (restore && restoredData) {
      console.log("[LocalStorage] Restoring session...");
      setProductRows(restoredData);
      setModifiedRowIds(
        new Set(restoredData.map((r) => r.id)) // 最初はすべて変更済みとしてマーク
      );
      toast.success("前のセッションを復元しました。");
    } else {
      console.log("[LocalStorage] Starting new session.");
      // 復元しない場合、古いデータを削除して新規開始
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      initializeEmptyRow(); // 'いいえ' を選択した場合も空行を初期化
    }
    setRestoredData(null); // 一時データをクリア
    initialLoadRef.current = false; // 初回ロード完了をマーク
  };

  // 完了時またはリセット時にセッションをクリアする関数
  const clearSavedSession = useCallback(() => {
    console.log("[LocalStorage] Clearing saved session.");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  // --- localStorage ロジック終了 ---

  // productRows と modifiedRowIds を更新するコールバック (変更なし)
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
          setJobId(null); // Import時はJobをリセット
          setJobStatus(null);
          clearSavedSession(); // Import時は古いセッションもクリア
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
            // 最後の行のリセット処理
            if (
              prevRows.length === 1 &&
              newRows.length === 1 &&
              prevRows[0].id !== newRows[0].id
            ) {
              nextModified.clear();
              nextModified.add(newRows[0].id);
              setJobId(null); // Jobもリセット
              setJobStatus(null);
              clearSavedSession(); // テーブルリセット時もクリア
            }
            return nextModified;
          });
        }
        return newRows;
      });
    },
    [setJobStatus, clearSavedSession] // clearSavedSession を依存関係に追加
  );

  // プレビューモーダルを閉じる処理 (ジョブ完了時に clearSavedSession を追加)
  const handleCloseModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setIsApiLoading(false);
    stopPolling();
    // アクティブなアップロードトーストを閉じる (変更なし)
    if (goldUploadToastIdRef.current) { toast.dismiss(goldUploadToastIdRef.current); goldUploadToastIdRef.current = null; }
    if (rcabinetUploadToastIdRef.current) { toast.dismiss(rcabinetUploadToastIdRef.current); rcabinetUploadToastIdRef.current = null; }

    // ジョブがエラーなしで完了した場合、保存されたセッションをクリア
    if (jobStatus?.status === "Completed") {
      clearSavedSession();
    }
  }, [stopPolling, jobStatus, clearSavedSession]); // clearSavedSession を依存関係に追加

  // =================================================================
  // === HÀM ĐÃ SỬA ĐỔI ===
  // =================================================================
  const handlePreviewClick = async () => {
    setGlobalAlert(null);
    const { errors: validationErrors, isValid } = validateRows(productRows);
    setErrors(validationErrors);
    setShowErrors(true);
    if (!isValid) {
      setGlobalAlert("入力内容にエラーがあります。確認してください。");
      return;
    }

    // --- Xóa session đã lưu khi bắt đầu tạo job ---
    clearSavedSession();
    // ------------------------------------------

    setIsApiLoading(true);
    setIsPreviewModalOpen(true);
    setShowErrors(false);

    try {
      let currentJobId = jobId;
      if (!currentJobId) {
        // --- LOGIC POST (TẠO JOB MỚI) ---
        console.log(">>> [DEBUG][Page] Creating new job (POST)");
        const payload = { productRows };
        const response = await fetch("/api/tools/03/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorDetail = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
          } catch (e) { /* Bỏ qua lỗi parse JSON */ }
          throw new Error(errorDetail);
        }

        const data: { jobId: string; totalItems: number } = await response.json();
        const newJobId = data.jobId;

        setJobId(newJobId);
        // Đặt trạng thái ban đầu là "Pending" - modal sẽ hiển thị "待機中..."
        // useJobPolling sẽ ngay lập tức poll và cập nhật sang "Processing"
        setJobStatus({
          jobId: newJobId,
          status: "Pending", // Trạng thái này sẽ hiển thị "待機中..."
          progress: 0,
          total: data.totalItems,
          results: {},
          startTime: Date.now() / 1000,
          endTime: null,
          message: null,
          ftpUploadStatusGold: "idle",
          ftpUploadErrorGold: null,
          ftpUploadStatusRcabinet: "idle",
          ftpUploadErrorRcabinet: null,
        });
        setIsApiLoading(false); // Ngừng loading API (polling sẽ tiếp tục)
        setModifiedRowIds(new Set()); // Reset các dòng đã sửa đổi
        console.log(">>> [DEBUG][Page] New job created, Job ID:", newJobId);
      } else {
        // --- LOGIC PATCH (CẬP NHẬT JOB) ---
        console.log(">>> [DEBUG][Page] Updating job (PATCH), Job ID:", currentJobId);

        console.log(">>> [DEBUG] modifiedRowIds before PATCH filter:", modifiedRowIds);
        const rowsToUpdate = productRows.filter((row) => modifiedRowIds.has(row.id));
        console.log(">>> [DEBUG] rowsToUpdate for PATCH:", rowsToUpdate);

        if (rowsToUpdate.length > 0) {

          // --- SỬA ĐỔI LOGIC: Đơn giản hóa việc cập nhật trạng thái ---
          // Đặt trạng thái thành "Processing" để đảm bảo polling
          // tiếp tục hoặc bắt đầu lại một cách chính xác.
          setJobStatus((prev) => ({
             // Giữ lại jobId, startTime từ `prev` nếu có, nếu không thì dùng `currentJobId`
            jobId: currentJobId,
            startTime: prev?.startTime ?? Date.now() / 1000,
            status: "Processing", // Đặt là "Processing" (画像生成中...)
            progress: 0, // Reset tiến trình (polling sẽ cập nhật)
            total: productRows.length, // Cập nhật tổng số
            results: prev?.results ?? {}, // Tạm giữ kết quả cũ (sẽ được cập nhật bởi polling)
            message: null,
            endTime: null,
            ftpUploadStatusGold: "idle", // Reset FTP
            ftpUploadErrorGold: null,
            ftpUploadStatusRcabinet: "idle", // Reset FTP
            ftpUploadErrorRcabinet: null,
          }));
          // --- KẾT THÚC SỬA ĐỔI ---

          const payload = { productRows: rowsToUpdate };
          const response = await fetch(`/api/tools/03/jobs/${currentJobId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* Bỏ qua lỗi parse JSON */ }
            throw new Error(errorDetail);
          }

          setIsApiLoading(false); // Ngừng loading API
          setModifiedRowIds(new Set()); // Reset các dòng đã sửa đổi
          console.log(">>> [DEBUG][Page] Job update initiated. Polling should continue/restart.");

        } else {
          // Không có dòng nào thay đổi, chỉ cần mở modal (polling sẽ không chạy nếu job đã hoàn thành)
          console.log(">>> [DEBUG][Page] No rows modified, skipping PATCH.");
          setIsApiLoading(false);
        }
      }
    } catch (error) {
      // Xử lý lỗi chung khi gọi API (POST hoặc PATCH)
      console.error("Failed to start or update job:", error);
      toast.error(`ジョブの開始/更新に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`);
      setIsApiLoading(false);
      setIsPreviewModalOpen(false); // Đóng modal nếu có lỗi
      // Không reset jobId, vì job có thể đã tồn tại
      // setJobId(null);
      // setJobStatus(null);
    }
  };
  // =================================================================
  // === KẾT THÚC HÀM ĐÃ SỬA ĐỔI ===
  // =================================================================


  // ZIPダウンロード処理 (変更なし)
  const handleDownloadZip = () => {
    if (!jobId || jobStatus?.status === "Failed") {
      toast.error("ダウンロードするジョブが見つからないか、失敗しました。");
      return;
    }
    window.open(`/api/tools/03/jobs/${jobId}/download`, "_blank");
  };

  // FTPアップロード処理 (変更なし)
  const handleUploadFTP = async (target: "gold" | "rcabinet") => {
    if (!jobId || !jobStatus || !["Completed", "Completed with errors"].includes(jobStatus.status)) {
       toast.error("アップロードするジョブが見つからないか、まだ完了していません。");
       return;
    }
    const targetName = target === "gold" ? "Rakuten GOLD" : "R-Cabinet";
    const toastIdRef = target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
    const ftpStatusKey = target === "gold" ? "ftpUploadStatusGold" : "ftpUploadStatusRcabinet";
    const ftpErrorKey = target === "gold" ? "ftpUploadErrorGold" : "ftpUploadErrorRcabinet";

    if (toastIdRef.current || jobStatus[ftpStatusKey] === "uploading") {
       toast.info(`${targetName} へのアップロードは既に進行中です。`);
       return;
    }
    setJobStatus((prev) => prev ? { ...prev, [ftpStatusKey]: "uploading", [ftpErrorKey]: null } : null);
    toastIdRef.current = toast.loading(`${targetName} へのアップロードを開始しています...`);

    try {
      const response = await fetch(`/api/tools/03/jobs/${jobId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target }),
       });
      if (response.status === 202) {
          console.log(`>>> [DEBUG][Page] ${targetName} upload initiated. Polling will track status.`);
      } else {
          let errorDetail = `HTTP error! status: ${response.status}`;
          try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
          if (toastIdRef.current) { toast.error(`${targetName} へのアップロード開始に失敗しました: ${errorDetail}`, { id: toastIdRef.current }); toastIdRef.current = null; }
          setJobStatus((prev) => prev ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorDetail } : null);
      }
    } catch (error) {
       console.error(`Failed to start ${target} upload:`, error);
       const errorMessage = error instanceof Error ? error.message : String(error);
       if (toastIdRef.current) { toast.error(`${targetName} へのアップロード開始に失敗しました: ${errorMessage}`, { id: toastIdRef.current }); toastIdRef.current = null; }
       setJobStatus((prev) => prev ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorMessage } : null);
    }
  };
  // ---------------------------------

  const isModalLoading = isApiLoading || isPollingLoading;

  // --- JSX Return ---
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">二重価格画像作成</h1>

      {/* テンプレート選択 */}
      <Card>
        <CardHeader title="1. テンプレート選択" />
        <CardContent>
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

      {/* 編集可能テーブル */}
      {/* 初回ロード後かつポップアップが表示されていない場合にのみテーブルをレンダリング */}
      {isClient && !showRestorePopup && (
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
      {/* ポップアップ待機中にローディングインジケーターを表示 */}
      {isClient && showRestorePopup && (
         <div className="text-center p-10 text-gray-500">セッションデータを読み込み中...</div>
      )}

      {/* グローバルアラート */}
      {globalAlert && <Alert variant="error">{globalAlert}</Alert>}

      {/* プレビューボタン */}
      {/* ポップアップが表示されていない場合にのみボタンを表示 */}
      {!showRestorePopup && (
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
      )}

      {/* テンプレートプレビューモーダル (変更なし) */}
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

      {/* 生成画像プレビューモーダル (変更なし) */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        jobStatus={jobStatus}
        isLoading={isModalLoading}
        productRows={productRows}
        onDownloadZip={handleDownloadZip}
        onUploadFTP={handleUploadFTP}
        isUploadingGold={jobStatus?.ftpUploadStatusGold === "uploading"}
        isUploadingRcabinet={jobStatus?.ftpUploadStatusRcabinet === "uploading"}
      />

      {/* セッション復元ポップアップ */}
      {showRestorePopup && (
        <RestoreSessionPopup onResponse={handleRestoreSession} />
      )}

      {/* Sonner Toaster */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
