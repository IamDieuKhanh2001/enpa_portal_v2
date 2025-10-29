// src/app/tools/03/components/EditableProductTable.tsx
"use client";

import React, { useId, useRef } from "react";
import { Table } from "@/component/common/Table"; // 新しいTableコンポーネントをインポート
import { TextBox } from "@/component/common/TextBox"; // 新しいTextBoxコンポーネントをインポート (高さ調整のため保持)
import SelectBox from "@/component/common/SelectBox"; // 新しいSelectBoxコンポーネントをインポート (高さ調整のため保持)
import { Button } from "@/component/common/Button"; // Buttonコンポーネントをインポート
import { Card, CardHeader, CardContent } from "@/component/common/Card"; // Cardコンポーネントをインポート
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { ProductRow, AllErrors, RowErrors } from "../types"; // 型定義をインポート
import { templates } from "../constants"; // 定数をインポート
import {
  createNewProductRow,
  calculateDiscountDisplay,
  parseJapaneseDate,
} from "../lib/utils"; // ユーティリティ関数をインポート

// エラー表示用コンポーネント (このテーブルでのみ使用するため、ここに保持)
const ErrorDisplay = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="group relative flex items-center pr-2">
      <IconAlertCircle size={16} className="text-red-500 cursor-pointer" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {message}
      </div>
    </div>
  );
};

// コンポーネントのPropsインターフェース
interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
  setModifiedRowIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  jobId: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function EditableProductTable({
  rows,
  setRows,
  errors,
  showErrors,
  setModifiedRowIds,
  jobId,
  setJobId,
}: EditableProductTableProps) {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // テーブル内の入力変更ハンドラー
  const handleInputChange = (
    id: string,
    field: keyof ProductRow,
    value: string
  ) => {
    let processedValue: string | number = value;
    // 価格フィールドの入力値処理 (数字と小数点のみ許可)
    if (field === "regularPrice" || field === "salePrice") {
      processedValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updatedRow = { ...row, [field]: processedValue };
        // 価格または割引タイプが変更された場合、割引表示を再計算
        if (
          ["regularPrice", "salePrice", "discountType"].includes(
            field as string
          )
        ) {
          updatedRow.discount = calculateDiscountDisplay(
            updatedRow.regularPrice,
            updatedRow.salePrice,
            updatedRow.discountType
          );
        }
        // 二重価格でcustomが選択された場合のリセット (もし削除後に別の選択肢を選んだ場合)
        if (field === "priceType" && value !== "custom") {
          updatedRow.customPriceType = "";
        }
        return updatedRow;
      })
    );
    // 変更された行のIDを記録
    setModifiedRowIds((prev) => new Set(prev).add(id));
  };

  // 新しい行を追加
  const addRow = () => {
    const newRow = createNewProductRow(baseId);
    setRows((prev) => [...prev, newRow]);
    setModifiedRowIds((prev) => new Set(prev).add(newRow.id));
  };

  // 複数の新しい行を追加
  const addMultipleRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) =>
      createNewProductRow(`${baseId}-${i}`)
    );
    setRows((prev) => [...prev, ...newRows]);
    setModifiedRowIds((prev) => {
      const newSet = new Set(prev);
      newRows.forEach((row) => newSet.add(row.id));
      return newSet;
    });
  };

  // 行を削除
  const deleteRow = (id: string) => {
    setRows((prev) => {
      if (prev.length > 1) {
        // 複数行ある場合は対象行をフィルタリング
        return prev.filter((row) => row.id !== id);
      }
      if (prev.length === 1 && prev[0].id === id) {
        // 最後の行を削除する場合は、新しい初期行にリセットし、jobIdもリセット
        console.log(
          ">>> [DEBUG][Table] 最後の行が削除されたため、テーブルとjobIdをリセットします"
        );
        setJobId(null); // 親コンポーネントのjobIdをリセット
        const initialRow = createNewProductRow("initial-reset");
        // modifiedRowIdsの更新は親コンポーネント(page.tsx)のhandleSetProductRowsで行う
        return [initialRow];
      }
      return prev;
    });
    // modifiedRowIdsからの削除も親コンポーネントのhandleSetProductRowsで行う
  };

  // CSVファイル選択ダイアログを開く
  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  // 選択されたCSVファイルの処理 (変更なし、トーストは親で行う)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.trim().split(/\r\n|\n/);
        if (lines.length < 2)
          throw new Error("CSVファイルが空か、ヘッダーしかありません。");

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        if (
          !headers.includes("商品管理番号") ||
          !headers.includes("テンプレート")
        ) {
          throw new Error(
            "CSVヘッダーに必要な列（商品管理番号, テンプレート）が含まれていません。"
          );
        }

        const headerMapping: { [key: string]: keyof ProductRow | string } = {
          商品管理番号: "productCode",
          テンプレート: "template",
          開始日時: "startDate",
          終了日時: "endDate",
          二重価格: "priceType", // CSVのヘッダー名が'二重価格'の場合
          // もしCSVのヘッダー名が異なる場合はここを修正 (例: '価格種別': 'priceType')
          価格: "regularPrice",
          セール価格: "salePrice",
          セール文言: "saleText",
          割引表示: "discountType",
          楽天モバイル開始日時: "mobileStartDate",
          楽天モバイル終了日時: "mobileEndDate",
        };
        const standardPriceTypes = [
          "当店通常価格",
          "メーカー希望小売価格",
          "クーポン利用で",
        ];
        const newRows: ProductRow[] = [];
        const importedModifiedIds = new Set<string>();

        lines.slice(1).forEach((line, lineIndex) => {
          if (!line.trim()) return;
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const rowData = createNewProductRow(`${baseId}-csv-${lineIndex}`);

          headers.forEach((header, index) => {
            const key = headerMapping[header];
            const value = values[index];
            if (!key || value === undefined) return;

            if (key === "priceType") {
              // custom オプションは削除されたので、標準タイプのみをチェック
              if (standardPriceTypes.includes(value)) {
                rowData.priceType = value;
                rowData.customPriceType = ""; // カスタム値はクリア
              } else {
                // 標準タイプ以外の場合（空も含む）、デフォルトに設定
                rowData.priceType = "当店通常価格";
                rowData.customPriceType = "";
              }
            } else if (
              [
                "startDate",
                "endDate",
                "mobileStartDate",
                "mobileEndDate",
              ].includes(key)
            ) {
              (rowData as any)[key] = parseJapaneseDate(value); // 日付をパース
            } else if (key === "discountType") {
              rowData.discountType = value === "円" ? "yen" : "percent"; // 割引タイプを設定
            } else {
              (rowData as any)[key] = value; // その他の値を直接設定
            }
          });

          // 割引表示を計算
          rowData.discount = calculateDiscountDisplay(
            rowData.regularPrice,
            rowData.salePrice,
            rowData.discountType
          );

          if (rowData.productCode) {
            newRows.push(rowData);
            importedModifiedIds.add(rowData.id);
          }
        });

        if (newRows.length > 0) {
          setRows(newRows); // 親コンポーネントのstateを更新
          // modifiedRowIdsとjobIdの更新は親に任せる
          // ここでトーストを呼び出す代わりに、親コンポーネントが処理する
          // toast.success(`CSVファイルを読み込み、${newRows.length}件の商品を追加しました。`);
        } else {
          // toast.warn("CSVファイルの読み込みに失敗したか、有効な商品データが含まれていません。");
          throw new Error(
            "CSVファイルの読み込みに失敗したか、有効な商品データが含まれていません。"
          ); // エラーをスローして親でキャッチ
        }
      } catch (error) {
        console.error("CSV解析エラー:", error);
        // トースト表示は親で行う
        // toast.error(`CSVファイルの解析中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
        // エラーを再スローするか、親コンポーネントに通知する仕組みが必要
      } finally {
        // ファイル入力をリセット
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      // toast.error("ファイルの読み込み中にエラーが発生しました。"); // トースト表示は親で行う
      console.error("ファイル読み込みエラー");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file, "Shift_JIS"); // Shift_JISで読み込み
  };

  if (rows.length === 0) return null; // 行がない場合は何も表示しない

  // スタイル定義
  // Table.InputCell 用の基本スタイル (中央揃え、切り捨て)
  const inputCellStyle = "text-sm text-center truncate";
  // Table.SelectBox 用の基本スタイル (左揃え、切り捨て、枠線なし)
  const selectCellStyle =
    "text-sm text-left truncate !border-0 !shadow-none !ring-0 focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  // 階層入力用 (高さ均等化のため flex-1 を使用)
  const tieredContainerStyle = "flex flex-col h-full"; // Td内に適用
  const tieredInputStyle =
    "flex-1 w-full h-auto min-h-[32px] px-2 py-1 text-sm border-0 rounded-none focus:ring-1 focus:ring-inset focus:ring-primary"; // 各入力要素に適用

  return (
    <Card>
      {/* CSVインポート用の非表示input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: "none" }}
      />
      {/* カードヘッダー */}
      <CardHeader
        title="2. 商品情報入力"
        description="は必須項目です。"
        showDescAsterisk
        buttonGroup={
          <>
            <Button color="secondary" onClick={addRow}>
              行を追加
            </Button>
            <Button color="secondary" onClick={() => addMultipleRows(5)}>
              5行を追加
            </Button>
            <Button color="grey" onClick={handleImportCSV}>
              CSVで一括取り込む
            </Button>
          </>
        }
      />
      <CardContent className="pb-8">
        {/* テーブル本体 */}
        <Table.Root className="w-full table-fixed">
          {/* テーブルヘッダー */}
          <Table.Head>
            <Table.Row>
              <Table.Th width="w-[3%]" center>
                {" "}
                ID{" "}
              </Table.Th>
              <Table.Th width="w-[9%]">
                {" "}
                商品管理番号<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[13%]">
                {" "}
                テンプレート<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[13%]">
                {" "}
                開始 / 終了日時<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[11%]">
                {" "}
                二重価格<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[7%]">
                {" "}
                価格<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[7%]">
                {" "}
                セール価格<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[9%]">
                {" "}
                割引表示<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[14%]">
                {" "}
                セール文言<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[13%]">
                {" "}
                楽天モバイル
                <br /> 開始 / 終了日時{" "}
              </Table.Th>
              <Table.Th width="w-[3%]" center>
                {" "}
                削除{" "}
              </Table.Th>
            </Table.Row>
          </Table.Head>
          {/* テーブルボディ */}
          <Table.Body>
            {rows.map((row, index) => {
              const rowErrors = errors[row.id] || {};
              // エラーがあるかどうかをチェックするヘルパー関数
              const hasError = (fieldName: keyof RowErrors): boolean =>
                showErrors && !!rowErrors[fieldName];
              // エラーメッセージを取得するヘルパー関数
              const getErrorMsg = (
                fieldName: keyof RowErrors
              ): string | undefined =>
                showErrors ? rowErrors[fieldName] : undefined;

              return (
                <Table.Row key={row.id}>
                  {/* 行番号 */}
                  <Table.Td center className="p-2 align-middle">
                    {" "}
                    {index + 1}{" "}
                  </Table.Td>

                  {/* 商品管理番号 */}
                  <Table.InputCell
                    id={`productCode-${row.id}`}
                    name={`productCode-${row.id}`}
                    placeholder="番号を入力"
                    className={inputCellStyle} // 中央揃えスタイル適用
                    value={row.productCode}
                    onChange={(e) =>
                      handleInputChange(row.id, "productCode", e.target.value)
                    }
                    errorMsg={getErrorMsg("productCode")}
                  />

                  {/* テンプレート */}
                  <Table.SelectBox
                    id={`template-${row.id}`}
                    value={row.template}
                    onChange={(e) =>
                      handleInputChange(row.id, "template", e.target.value)
                    }
                    className={selectCellStyle} // 枠線なしスタイル適用
                  >
                    {templates.map((t) => (
                      <Table.Option key={t.id} value={t.name}>
                        {t.name}
                      </Table.Option>
                    ))}
                  </Table.SelectBox>

                  {/* 開始 / 終了日時 */}
                  <Table.Td className="p-0 align-top">
                    {/* flexコンテナを追加して高さを均等に分割 */}
                    <div className={tieredContainerStyle}>
                      <div className="relative border-b border-gray-300">
                        {" "}
                        {/* 境界線を追加 */}
                        <TextBox
                          type="datetime-local"
                          label=""
                          showLabel={false}
                          id={`startDate-${row.id}`}
                          name={`startDate-${row.id}`}
                          className={cn(
                            tieredInputStyle, // 均等高さスタイル
                            hasError("startDate") &&
                              "!ring-1 !ring-red-500 !ring-inset"
                          )}
                          value={row.startDate}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                        {hasError("startDate") && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <ErrorDisplay message={rowErrors.startDate} />
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <TextBox
                          type="datetime-local"
                          label=""
                          showLabel={false}
                          id={`endDate-${row.id}`}
                          name={`endDate-${row.id}`}
                          className={cn(
                            tieredInputStyle, // 均等高さスタイル
                            hasError("endDate") &&
                              "!ring-1 !ring-red-500 !ring-inset"
                          )}
                          value={row.endDate}
                          onChange={(e) =>
                            handleInputChange(row.id, "endDate", e.target.value)
                          }
                        />
                        {hasError("endDate") && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <ErrorDisplay message={rowErrors.endDate} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Table.Td>

                  {/* 二重価格 */}
                  <Table.SelectBox
                    id={`priceType-${row.id}`}
                    value={row.priceType} // customオプションが削除されたので row.priceType を直接使用
                    onChange={(e) =>
                      handleInputChange(row.id, "priceType", e.target.value)
                    }
                    className={selectCellStyle} // 枠線なしスタイル適用
                  >
                    {/* オプションを直接マッピング */}
                    <Table.Option value="当店通常価格">
                      当店通常価格
                    </Table.Option>
                    <Table.Option value="メーカー希望小売価格">
                      メーカー希望小売価格
                    </Table.Option>
                    <Table.Option value="クーポン利用で">
                      クーポン利用で
                    </Table.Option>
                    {/* custom オプションは削除 */}
                  </Table.SelectBox>

                  {/* 価格 */}
                  <Table.InputCell
                    type="text"
                    inputMode="decimal"
                    id={`regularPrice-${row.id}`}
                    name={`regularPrice-${row.id}`}
                    className={inputCellStyle} // 中央揃えスタイル適用
                    value={row.regularPrice}
                    onChange={(e) =>
                      handleInputChange(row.id, "regularPrice", e.target.value)
                    }
                    errorMsg={getErrorMsg("regularPrice")}
                  />

                  {/* セール価格 */}
                  <Table.InputCell
                    type="text"
                    inputMode="decimal"
                    id={`salePrice-${row.id}`}
                    name={`salePrice-${row.id}`}
                    className={inputCellStyle} // 中央揃えスタイル適用
                    value={row.salePrice}
                    onChange={(e) =>
                      handleInputChange(row.id, "salePrice", e.target.value)
                    }
                    errorMsg={getErrorMsg("salePrice")}
                  />

                  {/* 割引表示 */}
                  {/* 割引表示 */}
                  <Table.Td className="p-0 align-top">
                    {/* flexコンテナを追加して高さを均等に分割 */}
                    <div className={tieredContainerStyle}>
                      <div className="border-b border-gray-300">
                        {" "}
                        {/* 境界線を追加 */}
                        {/* Table.SelectBox はこのレイアウトでは使えないため、通常のSelectBoxコンポーネントを使用 */}
                        <SelectBox
                          id={`discountType-${row.id}`}
                          // tieredInputStyle を適用して固定高さを設定
                          classNameSelect={cn(
                            tieredInputStyle,
                            "text-center truncate !border-0"
                          )}
                          options={[
                            { value: "percent", label: "%" },
                            { value: "yen", label: "円" },
                          ]}
                          value={row.discountType}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "discountType",
                              e.target.value
                            )
                          }
                          classNameParent="!mb-0 h-auto" // h-full を h-auto に変更 (flex itemが自身の高さを決定)
                        />
                      </div>
                      <TextBox
                        label=""
                        showLabel={false}
                        id={`discount-${row.id}`}
                        name={`discount-${row.id}`}
                        className={cn(
                          tieredInputStyle, // tieredInputStyle を適用して固定高さを設定
                          "text-center bg-gray-100"
                        )}
                        value={row.discount}
                        readOnly
                      />
                    </div>
                  </Table.Td>

                  {/* セール文言 */}
                  <Table.InputCell
                    id={`saleText-${row.id}`}
                    name={`saleText-${row.id}`}
                    placeholder="文言を入力"
                    className={inputCellStyle} // 中央揃えスタイル適用
                    value={row.saleText}
                    onChange={(e) =>
                      handleInputChange(row.id, "saleText", e.target.value)
                    }
                    errorMsg={getErrorMsg("saleText")}
                  />

                  {/* 楽天モバイル 開始 / 終了日時 */}
                  <Table.Td className="p-0 align-top">
                    {/* flexコンテナを追加して高さを均等に分割 */}
                    <div className={tieredContainerStyle}>
                      <div className="relative border-b border-gray-300">
                        {" "}
                        {/* 境界線を追加 */}
                        <TextBox
                          type="datetime-local"
                          label=""
                          showLabel={false}
                          id={`mobileStartDate-${row.id}`}
                          name={`mobileStartDate-${row.id}`}
                          className={cn(tieredInputStyle)} // 均等高さスタイル
                          value={row.mobileStartDate}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "mobileStartDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="relative">
                        <TextBox
                          type="datetime-local"
                          label=""
                          showLabel={false}
                          id={`mobileEndDate-${row.id}`}
                          name={`mobileEndDate-${row.id}`}
                          className={cn(tieredInputStyle)} // 均等高さスタイル
                          value={row.mobileEndDate}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "mobileEndDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </Table.Td>

                  {/* 削除 */}
                  <Table.Button
                    onClick={() => deleteRow(row.id)}
                    className="p-1 text-gray-400 hover:text-red-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                    disabled={rows.length <= 1 && !!jobId}
                  >
                    <IconTrash size={20} />
                  </Table.Button>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
