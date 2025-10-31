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
  // --- LAZY LOAD (START) ---
  IconChevronDown, // 「さらに表示」ボタン用のアイコンを追加
  // --- LAZY LOAD (END) ---
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
  isLoading: boolean; // 初期ローディングまたはポーリング中
  productRows: ProductRow[];
  onDownloadZip: () => void;
  onUploadFTP: (target: "gold" | "rcabinet") => void;
  isUploadingGold: boolean; // Goldボタンの一時的なローディング状態
  isUploadingRcabinet: boolean; // R-Cabinetボタンの一時的なローディング状態
  // --- LAZY LOAD (START) ---
  // lazy load 用の props を追加
  visibleCount: number;
  onLoadMore: () => void;
  // --- LAZY LOAD (END) ---
}

function PreviewModal({
  isOpen,
  onClose,
  jobStatus,
  isLoading, // ポーリングフックと最初のAPI呼び出しからの統合ローディング状態
  productRows,
  onDownloadZip,
  onUploadFTP,
  isUploadingGold,
  isUploadingRcabinet,
  // --- LAZY LOAD (START) ---
  // lazy load の props を受け取る
  visibleCount,
  onLoadMore,
  // --- LAZY LOAD (END) ---
}: PreviewModalProps) {
  // **** CONSOLE LOG 追加 ****
  console.log(
    ">>> [DEBUG][PreviewModal V2 LOG ADDED] jobStatus prop でレンダリング中:",
    JSON.stringify(jobStatus) // 完全なオブジェクトをログに記録するために Stringify する
  );
  console.log(
    ">>> [DEBUG][PreviewModal V2 LOG ADDED] isLoading prop:",
    isLoading
  );
  // ********************************

  if (!isOpen) return null;

  // 進捗を計算
  const currentTotal = jobStatus?.total ?? productRows.length;
  const currentProgress = jobStatus?.progress ?? 0;
  const progressPercentage = currentTotal
    ? (currentProgress / currentTotal) * 100
    : 0;

  // ジョブとFTPのステータスを判断
  const isJobFinished =
    jobStatus?.status === "Completed" ||
    jobStatus?.status === "Completed with errors";
  const isJobFailed = jobStatus?.status === "Failed";
  const isJobRunning =
    jobStatus?.status === "Processing" || jobStatus?.status === "Pending";

  // いずれかのFTPがアップロード中かどうかのフラグ（ボタンのローディング状態とバックエンドからの実際の状態を含む）
  const isAnyFtpUploading =
    isUploadingGold ||
    isUploadingRcabinet ||
    jobStatus?.ftpUploadStatusGold === "uploading" ||
    jobStatus?.ftpUploadStatusRcabinet === "uploading";

  // アクション（ダウンロード/アップロード）が実行可能かどうか
  const canPerformActions = isJobFinished && !isJobFailed;

  // --- 修正: ロジックをコンポーネント内部に移動 ---

  // 簡単に検索できるように、行IDから商品管理番号へのマップを作成
  const rowIdToProductCodeMap = productRows.reduce((acc, row) => {
    acc[row.id] = row.productCode;
    return acc;
  }, {} as { [key: string]: string });

  // 後で結果をフィルタリングするために、現在の行IDのセットを取得
  const currentRowIds = new Set(productRows.map((row) => row.id));

  // --- LAZY LOAD (START) ---
  // 新しいレンダリングロジック: productRows (正しい順序) を使用し、スライスする
  // 実際に jobId を持つ行をフィルタリング (送信されなかった空行を除外)
  const relevantRows = jobStatus?.results
    ? productRows.filter((row) => currentRowIds.has(row.id) && jobStatus.results[row.id])
    : productRows.filter((row) => currentRowIds.has(row.id));


  const visibleRows = relevantRows.slice(0, visibleCount);
  const totalRelevantRows = relevantRows.length;
  const hasMore = totalRelevantRows > visibleCount;
  // --- LAZY LOAD (END) ---
  // --- 修正終了 ---

  return (
    // モーダル背景
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* モーダルコンテンツ */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">画像プレビュー</h2>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IconX size={24} />
          </button> */}
        </div>

        {/* ボディ (スクロール可能) */}
        <div className="p-6 flex-grow overflow-y-auto">
          {/* ステータスバー */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md border space-y-2">
            {/* ジョブステータス行 */}
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
            {/* プログレスバー */}
            {(isJobRunning || isLoading) && !isJobFailed && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    // 全体がローディング中だがステータスがまだ処理中でない場合、パルス表示
                    isLoading && jobStatus?.status !== "Processing"
                      ? "bg-gray-400 animate-pulse"
                      : "bg-blue-600"
                  )}
                  style={{
                    // 初期ローディング中は100%幅のパルスを表示、それ以外は進捗率を表示
                    width: `${
                      isLoading && jobStatus?.status !== "Processing"
                        ? 100
                        : progressPercentage
                    }%`,
                  }}
                ></div>
              </div>
            )}
            {/* FTPステータス行 */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-200 mt-2">
              {/* GOLD ステータス */}
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
              {/* R-Cabinet ステータス */}
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
            {/* 一般ジョブエラーメッセージ */}
            {jobStatus?.message && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {jobStatus.message}
              </div>
            )}
            {/* 部分完了の警告 */}
            {jobStatus?.status === "Completed with errors" &&
              !jobStatus.message && (
                <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                  一部の画像の生成に失敗しました。詳細は各画像をご確認ください。
                </div>
              )}
          </div>

          {/* 画像グリッド */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* --- LAZY LOAD (START) --- */}
            {/* スケルトンローディング状態 (10個のスケルトンのみレンダリング) */}
            {isLoading &&
              (!jobStatus || Object.keys(jobStatus.results).length === 0) &&
              Array.from({ length: Math.min(productRows.length, visibleCount) }).map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm animate-pulse"
                >
                  <div className="w-40 h-40 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}

            {/* 実際の画像結果 (新しいレンダリングロジック) */}
            {/* 1. `visibleRows` (スライス済み、正しい順序) をマップする
              2. `jobStatus.results` から `row.id` を使って `result` を取得
            */}
            {jobStatus?.results &&
              visibleRows.map((row) => {
                  const rowId = row.id;
                  const result = jobStatus.results[rowId];
                  const productCode =
                    rowIdToProductCodeMap[rowId] || `item-${rowId.slice(-3)}`;
                  const cacheBuster =
                    jobStatus?.endTime || jobStatus?.startTime || Date.now();

                  // result がまだない場合は、デフォルトで処理中とする
                  const status = result?.status ?? "Pending";
                  const message = result?.message;

                  const imageUrl =
                    status === "Success" &&
                    result.filename &&
                    jobStatus?.jobId
                      ? `/api/tools/03/jobs/${
                          jobStatus.jobId
                        }/image/${encodeURIComponent(
                          result.filename
                        )}?v=${cacheBuster}`
                      : ""; // プレースホルダー

                  return (
                    <div
                      key={rowId}
                      className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm"
                    >
                      <div className="w-40 h-40 mb-2 flex items-center justify-center bg-gray-100 rounded">
                        {status === "Processing" ||
                        status === "Pending" ? (
                          <IconLoader2
                            size={32}
                            className="animate-spin text-blue-400"
                          />
                        ) : (
                          <img
                            src={imageUrl}
                            alt={`Preview for ${productCode}`}
                            className="max-w-full max-h-full object-contain rounded"
                            // オプション: 画像のエラーハンドリングを追加
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // 無限ループを防止
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
                        {status === "Success" && (
                          <IconCircleCheck
                            size={14}
                            className="text-green-500 mr-1 flex-shrink-0"
                          />
                        )}
                        {status === "Error" && (
                          <IconCircleX
                            size={14}
                            className="text-red-500 mr-1 flex-shrink-0"
                          />
                        )}
                        {(status === "Processing" ||
                          status === "Pending") && (
                          <IconLoader2
                            size={14}
                            className="text-blue-500 mr-1 flex-shrink-0 animate-spin"
                          />
                        )}
                        <span
                          className={cn(
                            "truncate",
                            status === "Success" && "text-green-600",
                            status === "Error" && "text-red-600",
                            (status === "Processing" ||
                              status === "Pending") &&
                              "text-blue-600"
                          )}
                          title={message ?? status}
                        >
                          {message ? message : status}
                        </span>
                      </div>
                    </div>
                  );
                })}
             {/* --- LAZY LOAD (END) --- */}
          </div>

          {/* --- LAZY LOAD (START) --- */}
          {/* 「さらに表示」ボタン */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button
                color="secondary"
                onClick={onLoadMore}
                className="inline-flex items-center"
                // このボタンは仕様上、無効化されない
              >
                <IconChevronDown size={18} className="mr-1.5" />
                {/* さらに {Math.min(10, totalRelevantRows - visibleCount)} 件表示 */}
                さらに表示
              </Button>
            </div>
          )}
          {/* --- LAZY LOAD (END) --- */}

        </div>

        {/* フッター アクションボタン */}
        <div className="flex justify-center items-center p-4 border-t space-x-3 bg-gray-50">
          <Button color="grey" onClick={onClose}>
            {" "}
            修正 (閉じる){" "}
          </Button>
          <Button
            color="secondary"
            onClick={onDownloadZip}
            // ジョブが未完了/エラー、またはFTPアップロード中の場合は無効化
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            <IconDownload size={18} className="mr-1.5" /> 全画像をダウンロード
          </Button>
          <Button
            color="primary"
            onClick={() => onUploadFTP("gold")}
            // ジョブが未完了/エラー、またはいずれかのFTPアップロード中の場合は無効化
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {/* GOLD の特定の状態に基づいてローダーを表示 */}
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
            // ジョブが未完了/エラー、またはいずれかのFTPアップロード中の場合は無効化
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {/* R-Cabinet の特定の状態に基づいてローダーを表示 */}
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

export default PreviewModal; // コンポーネントをエクスポート
