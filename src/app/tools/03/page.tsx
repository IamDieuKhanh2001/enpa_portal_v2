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
import { IconLoader2, IconRefresh } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";
import debounce from "lodash/debounce";

// コンポーネントとロジックの分離
import EditableProductTable from "./components/EditableProductTable";
import PreviewModal from "./components/PreviewModal";
import RestoreSessionPopup from "./components/RestoreSessionPopup";
import ResetConfirmPopup from "./components/ResetConfirmPopup";
import { useJobPolling } from "./hooks/useJobPolling";
import { validateRows } from "./lib/validation";
import { createNewProductRow } from "./lib/utils";
import { templates } from "./constants";
import type { ProductRow, AllErrors, BackendJobStatus } from "./types";

// Sonner toast ID の型
type SonnerToastId = string | number;

// localStorage のキー
const LOCAL_STORAGE_KEY = "tool03_session_data_v2";

// --- LAZY LOAD (START) ---
// 一度に表示する画像数
const BATCH_SIZE = 10;
// --- LAZY LOAD (END) ---

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

  // --- LAZY LOAD (START) ---
  // 表示を許可する画像数を追跡する State
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  // --- LAZY LOAD (END) ---

  // セッション復元
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [restoredData, setRestoredData] = useState<ProductRow[] | null>(null);
  const initialLoadRef = useRef(true);

  // リセット確認ポップアップ
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const goldUploadToastIdRef = useRef<SonnerToastId | null>(null);
  const rcabinetUploadToastIdRef = useRef<SonnerToastId | null>(null);

  // --- FTP用コールバック (変更なし) ---
  const handleFtpSuccess = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.success(message); // メッセージは日本語で渡される想定
    },
    []
  );
  const handleFtpError = useCallback(
    (target: "gold" | "rcabinet", message: string) => {
      const toastIdRef =
        target === "gold" ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
      if (toastIdRef.current) {
        toast.error(message, { id: toastIdRef.current }); // メッセージは日本語で渡される想定
        toastIdRef.current = null;
      } else {
        toast.error(message); // メッセージは日本語で渡される想定
      }
    },
    []
  );
  // -----------------------------------

  // --- ポーリング用カスタムフック (変更なし) ---
  const handleJobNotFound = useCallback(() => {
    setJobId(null);
    setGlobalAlert(
      "現在のジョブが見つかりませんでした。新しいジョブを開始します。"
    );
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

  // --- localStorage ロジック (変更なし) ---
  const saveStateToLocalStorage = useCallback(
    debounce((rowsToSave: ProductRow[]) => {
      try {
        const isDefaultEmptyRow =
          rowsToSave.length === 1 &&
          !rowsToSave[0].productCode &&
          !rowsToSave[0].startDate &&
          !rowsToSave[0].endDate &&
          !rowsToSave[0].regularPrice &&
          !rowsToSave[0].salePrice;

        if (!isDefaultEmptyRow) {
          console.log(
            "[LocalStorage] 状態を保存中...",
            `(${rowsToSave.length} 行)`
          );
          const dataString = JSON.stringify(rowsToSave);
          localStorage.setItem(LOCAL_STORAGE_KEY, dataString);
        } else {
          console.log(
            "[LocalStorage] デフォルトの空行を検出、ストレージから削除します。"
          );
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (error) {
        console.error("localStorage への状態保存エラー:", error);
        toast.error(
          "セッションデータの保存中にエラーが発生しました。ストレージがいっぱいかもしれません。"
        );
      }
    }, 1500),
    []
  );

  useEffect(() => {
    if (!initialLoadRef.current && isClient && productRows.length > 0) {
      saveStateToLocalStorage(productRows);
    }
  }, [productRows, saveStateToLocalStorage, isClient]);

  useEffect(() => {
    setIsClient(true);
    if (initialLoadRef.current) {
      try {
        const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataString) {
          const parsedData: ProductRow[] = JSON.parse(savedDataString);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setRestoredData(parsedData);
            setShowRestorePopup(true);
            console.log(
              "[LocalStorage] 保存されたセッションを発見、復元ポップアップを表示します。"
            );
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            initializeEmptyRow();
          }
        } else {
          initializeEmptyRow();
        }
      } catch (error) {
        console.error("localStorage からの状態読み込みエラー:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        initializeEmptyRow();
        toast.error("保存されたセッションデータの読み込み中にエラーが発生しました。");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 空行の初期化ロジック (変更なし) ---
  const initializeEmptyRow = (idPrefix = "initial-load-empty") => {
    console.log(`[Session] 空行で初期化します (prefix: ${idPrefix}).`);
    const initialRow = createNewProductRow(idPrefix);
    setProductRows([initialRow]);
    setModifiedRowIds(new Set([initialRow.id]));
    setJobId(null);
    setJobStatus(null);
    setGlobalAlert(null);
    setShowErrors(false);
    setErrors({});
    clearSavedSession(); // リセット時に古いセッションも削除することを保証
    initialLoadRef.current = false; // 読み込み完了フラグ
  };
  // ----------------------------------------------

  const handleRestoreSession = (restore: boolean) => {
    setShowRestorePopup(false);
    if (restore && restoredData) {
      console.log("[LocalStorage] セッションを復元しています...");
      setProductRows(restoredData);
      setModifiedRowIds(
        new Set(restoredData.map((r) => r.id))
      );
      toast.success("前のセッションを復元しました。");
    } else {
      console.log("[LocalStorage] 新しいセッションを開始します。");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      initializeEmptyRow("initial-new-session"); // 新しい空行を初期化
    }
    setRestoredData(null);
    initialLoadRef.current = false; // 読み込み完了フラグ
  };

  const clearSavedSession = useCallback(() => {
    console.log("[LocalStorage] 保存されたセッションをクリアします。");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);
  // --- localStorage ロジック終了 ---

  // --- handleSetProductRows ロジック (変更なし) ---
  const handleSetProductRows = useCallback(
    (newRowsOrFn: ProductRow[] | ((prev: ProductRow[]) => ProductRow[])) => {
      setProductRows((prevRows) => {
        let newRows: ProductRow[];
        let operation: "set" | "append" | "delete" | "reset" | "unknown" =
          "unknown";

        if (typeof newRowsOrFn !== "function") {
          // 1. "Set" の場合 (空のテーブルへのインポート)
          newRows = newRowsOrFn;
          operation = "set";
        } else {
          // 2. 関数型更新の場合 (Append, Delete, Reset)
          newRows = newRowsOrFn(prevRows);
          if (newRows.length > prevRows.length) {
            operation = "append";
          } else if (
            prevRows.length === 1 &&
            newRows.length === 1 &&
            prevRows[0].id !== newRows[0].id
          ) {
            operation = "reset";
          } else {
            operation = "delete";
          }
        }

        // `operation` に基づいて他の State を更新
        const currentIds = new Set(newRows.map((r) => r.id));
        setModifiedRowIds((prevModified) => {
          const nextModified = new Set(prevModified);

          // 存在しなくなった ID を削除
          prevModified.forEach((id) => {
            if (!currentIds.has(id)) {
              nextModified.delete(id);
            }
          });

          if (operation === "set") {
            // "Set" (空のテーブルへのインポート): 全てリセットし、新しい ID をすべて追加
            nextModified.clear();
            newRows.forEach((r) => nextModified.add(r.id));
            setJobId(null);
            setJobStatus(null);
            clearSavedSession();
          } else if (operation === "append") {
            // "Append" (CSV追記インポート): 新しい ID を追加、ジョブはリセットしない
            const addedRows = newRows.slice(prevRows.length);
            addedRows.forEach((row) => nextModified.add(row.id));
            // ここでは jobId やセッションをリセットしない
          } else if (operation === "reset") {
            // "Reset" (最後の行の削除): 全てリセット
            nextModified.clear();
            nextModified.add(newRows[0].id);
            setJobId(null);
            setJobStatus(null);
            clearSavedSession();
          }
          // "delete" または "unknown" は ID の削除のみ (上記で実施済み)

          return nextModified;
        });

        return newRows;
      });
    },
    [setJobStatus, clearSavedSession] // 依存関係は不変
  );
  // -----------------------------------------------------------

  const handleCloseModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setIsApiLoading(false);
    stopPolling();
    // --- LAZY LOAD (START) ---
    // モーダルを閉じる際に表示数をリセット
    setVisibleCount(BATCH_SIZE);
    // --- LAZY LOAD (END) ---
    if (goldUploadToastIdRef.current) {
      toast.dismiss(goldUploadToastIdRef.current);
      goldUploadToastIdRef.current = null;
    }
    if (rcabinetUploadToastIdRef.current) {
      toast.dismiss(rcabinetUploadToastIdRef.current);
      rcabinetUploadToastIdRef.current = null;
    }
    if (jobStatus?.status === "Completed") {
      clearSavedSession();
    }
  }, [stopPolling, jobStatus, clearSavedSession]);

  // --- リセットボタンのロジック (変更なし) ---
  const handleResetClick = () => {
    // テーブルが既に空の場合はポップアップ不要
    if (
      productRows.length === 1 &&
      !productRows[0].productCode &&
      !productRows[0].startDate &&
      !productRows[0].regularPrice
    ) {
      toast.info("テーブルは既に空です。");
      return;
    }
    setShowResetConfirm(true);
  };

  const handleResetConfirm = (confirm: boolean) => {
    setShowResetConfirm(false);
    if (confirm) {
      initializeEmptyRow("manual-reset");
      toast.success("テーブルをリセットしました。");
    }
  };
  // ---------------------------------------

  // handlePreviewClick 関数 (修正済み)
  const handlePreviewClick = async () => {
    setGlobalAlert(null);
    const { errors: validationErrors, isValid } = validateRows(productRows);
    setErrors(validationErrors);
    setShowErrors(true);
    if (!isValid) {
      setGlobalAlert("入力内容にエラーがあります。確認してください。");
      return;
    }

    clearSavedSession();
    setIsApiLoading(true);
    setIsPreviewModalOpen(true);
    setShowErrors(false);
    // --- LAZY LOAD (START) ---
    // モーダルを開く際に表示数をリセット
    setVisibleCount(BATCH_SIZE);
    // --- LAZY LOAD (END) ---

    try {
      let currentJobId = jobId;
      if (!currentJobId) {
        // --- POST ロジック (新規ジョブ作成) ---
        console.log(">>> [DEBUG][Page] 新規ジョブを作成中 (POST)");
        const payload = { productRows };
        const response = await fetch("/api/tools/03/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorDetail = `HTTPエラー! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
          } catch (e) { /* JSON パースエラーは無視 */ }
          throw new Error(errorDetail);
        }

        const data: { jobId: string; totalItems: number } =
          await response.json();
        const newJobId = data.jobId;

        setJobId(newJobId);
        setJobStatus({
          jobId: newJobId,
          status: "Pending", // この状態で "待機中..." と表示される
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
        setIsApiLoading(false);
        setModifiedRowIds(new Set());
        console.log(">>> [DEBUG][Page] 新規ジョブ作成完了, Job ID:", newJobId);
      } else {
        // --- PATCH ロジック (ジョブ更新) ---
        console.log(
          ">>> [DEBUG][Page] ジョブを更新中 (PATCH), Job ID:",
          currentJobId
        );
        console.log(
          ">>> [DEBUG] PATCH フィルター前の modifiedRowIds:",
          modifiedRowIds
        );
        const rowsToUpdate = productRows.filter((row) =>
          modifiedRowIds.has(row.id)
        );
        console.log(">>> [DEBUG] PATCH 対象の rowsToUpdate:", rowsToUpdate);

        if (rowsToUpdate.length > 0) {
          setJobStatus((prev) => ({
            jobId: currentJobId,
            startTime: prev?.startTime ?? Date.now() / 1000,
            status: "Processing", // "Processing" (画像生成中...) に設定
            progress: 0,
            total: productRows.length,
            results: prev?.results ?? {},
            message: null,
            endTime: null,
            ftpUploadStatusGold: "idle",
            ftpUploadErrorGold: null,
            ftpUploadStatusRcabinet: "idle",
            ftpUploadErrorRcabinet: null,
          }));

          const payload = { productRows: rowsToUpdate };
          const response = await fetch(`/api/tools/03/jobs/${currentJobId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            let errorDetail = `HTTPエラー! status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* JSON パースエラーは無視 */ }
            throw new Error(errorDetail);
          }

          setIsApiLoading(false);
          setModifiedRowIds(new Set());
          console.log(
            ">>> [DEBUG][Page] ジョブ更新を開始しました。ポーリングが続行/再開されます。"
          );
        } else {
          console.log(">>> [DEBUG][Page] 変更された行がないため、PATCH をスキップします。");
          setIsApiLoading(false);
        }
      }
    } catch (error) {
      console.error("ジョブの開始または更新に失敗しました:", error);
      toast.error(
        `ジョブの開始/更新に失敗しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
      setIsApiLoading(false);
      setIsPreviewModalOpen(false);
    }
  };

  // ダウンロード/アップロード関数 (変更なし)
  const handleDownloadZip = () => {
    if (!jobId || jobStatus?.status === "Failed") {
      toast.error("ダウンロードするジョブが見つからないか、失敗しました。");
      return;
    }
    window.open(`/api/tools/03/jobs/${jobId}/download`, "_blank");
  };

  const handleUploadFTP = async (target: "gold" | "rcabinet") => {
    if (
      !jobId ||
      !jobStatus ||
      !["Completed", "Completed with errors"].includes(jobStatus.status)
    ) {
      toast.error("アップロードするジョブが見つからないか、まだ完了していません。");
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
      toast.info(`${targetName} へのアップロードは既に進行中です。`);
      return;
    }
    setJobStatus((prev) =>
      prev ? { ...prev, [ftpStatusKey]: "uploading", [ftpErrorKey]: null } : null
    );
    toastIdRef.current = toast.loading(
      `${targetName} へのアップロードを開始しています...`
    );

    try {
      const response = await fetch(`/api/tools/03/jobs/${jobId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target }),
      });
      if (response.status === 202) {
        console.log(
          `>>> [DEBUG][Page] ${targetName} アップロード開始。ポーリングでステータスを追跡します。`
        );
      } else {
        let errorDetail = `HTTPエラー! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (e) { /* 無視 */ }
        if (toastIdRef.current) {
          toast.error(
            `${targetName} へのアップロード開始に失敗しました: ${errorDetail}`,
            { id: toastIdRef.current }
          );
          toastIdRef.current = null;
        }
        setJobStatus((prev) =>
          prev
            ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorDetail }
            : null
        );
      }
    } catch (error) {
      console.error(`${target} アップロードの開始に失敗:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (toastIdRef.current) {
        toast.error(
          `${targetName} へのアップロード開始に失敗しました: ${errorMessage}`,
          { id: toastIdRef.current }
        );
        toastIdRef.current = null;
      }
      setJobStatus((prev) =>
        prev
          ? { ...prev, [ftpStatusKey]: "failed", [ftpErrorKey]: errorMessage }
          : null
      );
    }
  };
  // ---------------------------------

  const isModalLoading = isApiLoading || isPollingLoading;

  // --- LAZY LOAD (START) ---
  // ジョブが実行中かどうかを判断 (テーブルを無効化するため)
  const isJobRunning =
    jobStatus?.status === "Processing" || jobStatus?.status === "Pending";
  // 全体のローディング状態 (最初の API 呼び出しも含む)
  const isProcessing =
    isApiLoading || (isPollingLoading && !jobStatus) || isJobRunning;
  // --- LAZY LOAD (END) ---

  // --- JSX Return ---
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">二重価格画像作成</h1>

      {/* テンプレート選択 (変更なし) */}
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
      {isClient && !showRestorePopup && (
        <EditableProductTable
          rows={productRows}
          setRows={handleSetProductRows}
          errors={errors}
          showErrors={showErrors}
          setModifiedRowIds={setModifiedRowIds}
          jobId={jobId}
          setJobId={setJobId}
          // --- LAZY LOAD (START) ---
          // `disabled` プロパティを渡す
          disabled={isProcessing && isPreviewModalOpen}
          // --- LAZY LOAD (END) ---
        />
      )}
      {isClient && showRestorePopup && (
        <div className="text-center p-10 text-gray-500">
          セッションデータを読み込み中...
        </div>
      )}

      {/* グローバルアラート */}
      {globalAlert && <Alert variant="error">{globalAlert}</Alert>}

      {/* ボタン群 (更新) */}
      {!showRestorePopup && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <Button
            color="secondary"
            onClick={handleResetClick}
            // --- LAZY LOAD (START) ---
            // モーダルが開いていて処理中の場合は無効化
            disabled={isProcessing && isPreviewModalOpen}
            // --- LAZY LOAD (END) ---
            className="inline-flex items-center"
          >
            <IconRefresh size={18} className="mr-1.5" />
            リセット
          </Button>
          <Button
            color="primary"
            onClick={handlePreviewClick}
            // --- LAZY LOAD (START) ---
            // モーダルが開いていて処理中の場合は無効化
            disabled={isProcessing && isPreviewModalOpen}
            // --- LAZY LOAD (END) ---
            className="inline-flex items-center"
          >
            {/* --- LAZY LOAD (START) ---
             // モーダルが開いていて処理中の場合のみスピナーを表示
            // --- LAZY LOAD (END) --- */}
            {isProcessing && isPreviewModalOpen ? (
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

      {/* 生成画像プレビューモーダル */}
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
        // --- LAZY LOAD (START) ---
        // State とハンドラ関数を渡す
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
        // --- LAZY LOAD (END) ---
      />

      {/* セッション復元ポップアップ (変更なし) */}
      {showRestorePopup && (
        <RestoreSessionPopup onResponse={handleRestoreSession} />
      )}

      {/* Reset popup (変更なし) */}
      {showResetConfirm && (
        <ResetConfirmPopup onResponse={handleResetConfirm} />
      )}

      {/* Sonner Toaster (変更なし) */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
