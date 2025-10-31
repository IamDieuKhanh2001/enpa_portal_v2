// src/app/tools/03/components/EditableProductTable.tsx
"use client";

import React, { useId, useRef } from "react";
import { toast } from "sonner";
import { Table } from "@/component/common/Table";
import { TextBox } from "@/component/common/TextBox";
import SelectBox from "@/component/common/SelectBox";
import { Button } from "@/component/common/Button";
import { Card, CardHeader, CardContent } from "@/component/common/Card";
// --- LAZY LOAD (START) ---
import { IconAlertCircle, IconTrash, IconLoader2 } from "@tabler/icons-react";
// --- LAZY LOAD (END) ---
import { cn } from "@/lib/utils";
import type { ProductRow, AllErrors, RowErrors } from "../types";
import { templates } from "../constants";
import {
  createNewProductRow,
  calculateDiscountDisplay,
  parseJapaneseDate,
} from "../lib/utils";

// ErrorDisplay
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

// Interface
interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
  setModifiedRowIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  jobId: string | null;
  setJobId: React.Dispatch<React.SetStateAction<string | null>>;
  // --- LAZY LOAD (START) ---
  disabled?: boolean;
  // --- LAZY LOAD (END) ---
}

export default function EditableProductTable({
  rows,
  setRows,
  errors,
  showErrors,
  setModifiedRowIds,
  jobId,
  setJobId,
  // --- LAZY LOAD (START) ---
  disabled = false,
  // --- LAZY LOAD (END) ---
}: EditableProductTableProps) {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handleInputChange
  const handleInputChange = (
    id: string,
    field: keyof ProductRow,
    value: string
  ) => {
    let processedValue: string | number = value;

    if (field === "regularPrice" || field === "salePrice") {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updatedRow = { ...row, [field]: processedValue };
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
        if (field === "priceType" && value !== "custom") {
          updatedRow.customPriceType = "";
        }
        return updatedRow;
      })
    );
    setModifiedRowIds((prev) => new Set(prev).add(id));
  };

  // addRow
  const addRow = () => {
    const newRow = createNewProductRow(baseId);
    setRows((prev) => [...prev, newRow]);
    setModifiedRowIds((prev) => new Set(prev).add(newRow.id));
  };

  // addMultipleRows
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

  // deleteRow
  const deleteRow = (id: string) => {
    setRows((prev) => {
      if (prev.length > 1) {
        return prev.filter((row) => row.id !== id);
      }
      if (prev.length === 1 && prev[0].id === id) {
        console.log(
          ">>> [DEBUG][Table] 最後の行が削除されたため、テーブルとjobIdをリセットします"
        );
        setJobId(null);
        const initialRow = createNewProductRow("initial-reset");
        return [initialRow];
      }
      return prev;
    });
  };

  // handleImportCSV
  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  // handleFileChange
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.trim().split(/\r\n|\n/);
        if (lines.length < 2) {
          toast.error("CSVファイルが空か、ヘッダーしかありません。");
          return;
        }

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        if (
          !headers.includes("商品管理番号") ||
          !headers.includes("テンプレート")
        ) {
          toast.error(
            "CSVヘッダーに必要な列（商品管理番号, テンプレート）が含まれていません。"
          );
          return;
        }

        const headerMapping: { [key: string]: keyof ProductRow | string } = {
          商品管理番号: "productCode",
          テンプレート: "template",
          開始日時: "startDate",
          終了日時: "endDate",
          二重価格: "priceType",
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

        lines.slice(1).forEach((line, lineIndex) => {
          if (!line.trim()) return;
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const rowData = createNewProductRow(`${baseId}-csv-${lineIndex}`);

          headers.forEach((header, index) => {
            const key = headerMapping[header];
            const value = values[index];
            if (!key || value === undefined) return;

            if (key === "priceType") {
              if (standardPriceTypes.includes(value)) {
                rowData.priceType = value;
                rowData.customPriceType = "";
              } else {
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
              (rowData as any)[key] = parseJapaneseDate(value);
            } else if (key === "discountType") {
              rowData.discountType = value === "円" ? "yen" : "percent";
            } else {
              (rowData as any)[key] = value;
            }
          });

          rowData.discount = calculateDiscountDisplay(
            rowData.regularPrice,
            rowData.salePrice,
            rowData.discountType
          );

          if (rowData.productCode) {
            newRows.push(rowData);
          }
        });

        if (newRows.length > 0) {
          const isTableCurrentlyEmpty =
            rows.length === 1 &&
            !rows[0].productCode &&
            !rows[0].startDate &&
            !rows[0].regularPrice;

          if (isTableCurrentlyEmpty) {
            setRows(newRows);
            toast.success(`CSVから ${newRows.length} 件の商品を追加しました。`);
          } else {
            setRows((prevRows) => [...prevRows, ...newRows]);
            toast.success(
              `CSVから ${newRows.length} 件の商品を既存のリストに追加しました。`
            );
          }
        } else {
          toast.warning(
            "CSVファイルの読み込みに失敗したか、有効な商品データが含まれていません。"
          );
        }
      } catch (error) {
        console.error("CSV解析エラー:", error);
        toast.error(
          `CSVファイルの解析中にエラーが発生しました: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      toast.error("ファイルの読み込み中にエラーが発生しました。");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file, "Shift_JIS");
  };

  if (rows.length === 0 && !disabled) return null;

  const inputCellStyle = "text-sm text-center truncate";
  const selectCellStyle =
    "text-sm text-left truncate !border-0 !shadow-none !ring-0 focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredContainerStyle = "flex flex-col h-full";
  const tieredInputStyle =
    "flex-1 w-full h-auto min-h-[32px] px-2 py-1 text-sm border-0 rounded-none focus:ring-1 focus:ring-inset focus:ring-primary";

  return (
    // --- LAZY LOAD (START) ---
    <div className="relative">
      {disabled && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
          <IconLoader2 size={32} className="animate-spin text-primary mb-2" />
          <p className="text-sm font-semibold text-gray-700">
            画像生成中...
          </p>
          <p className="text-xs text-gray-500">
            (プレビューウィンドウを閉じるまで編集できません)
          </p>
        </div>
      )}
      {/* --- LAZY LOAD (END) --- */}

      <Card>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: "none" }}
        />
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
          <Table.Root className="w-full table-fixed">
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-[3%]" center>
                  ID
                </Table.Th>
                <Table.Th width="w-[9%]">
                  商品管理番号<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[13%]">
                  テンプレート<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[13%]">
                  開始 / 終了日時<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[11%]">
                  二重価格<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[7%]">
                  価格<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[7%]">
                  セール価格<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[9%]">
                  割引表示<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[14%]">
                  セール文言<span className="text-red-500">*</span>
                </Table.Th>
                <Table.Th width="w-[13%]">
                  楽天モバイル
                  <br /> 開始 / 終了日時
                </Table.Th>
                <Table.Th width="w-[3%]" center>
                  削除
                </Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((row, index) => {
                const rowErrors = errors[row.id] || {};
                const hasError = (fieldName: keyof RowErrors): boolean =>
                  showErrors && !!rowErrors[fieldName];
                const getErrorMsg = (
                  fieldName: keyof RowErrors
                ): string | undefined =>
                  showErrors ? rowErrors[fieldName] : undefined;

                return (
                  <Table.Row key={row.id}>
                    <Table.Td center className="p-2 align-middle">
                      {index + 1}
                    </Table.Td>

                    <Table.InputCell
                      id={`productCode-${row.id}`}
                      name={`productCode-${row.id}`}
                      placeholder="番号を入力"
                      className={inputCellStyle}
                      value={row.productCode}
                      onChange={(e) =>
                        handleInputChange(row.id, "productCode", e.target.value)
                      }
                      errorMsg={getErrorMsg("productCode")}
                    />

                    <Table.SelectBox
                      id={`template-${row.id}`}
                      value={row.template}
                      onChange={(e) =>
                        handleInputChange(row.id, "template", e.target.value)
                      }
                      className={selectCellStyle}
                    >
                      {templates.map((t) => (
                        <Table.Option key={t.id} value={t.name}>
                          {t.name}
                        </Table.Option>
                      ))}
                    </Table.SelectBox>

                    <Table.Td className="p-0 align-top">
                      <div className={tieredContainerStyle}>
                        <div className="relative border-b border-gray-300">
                          <TextBox
                            type="datetime-local"
                            label=""
                            showLabel={false}
                            id={`startDate-${row.id}`}
                            name={`startDate-${row.id}`}
                            className={cn(
                              tieredInputStyle,
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
                              tieredInputStyle,
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

                    <Table.SelectBox
                      id={`priceType-${row.id}`}
                      value={row.priceType}
                      onChange={(e) =>
                        handleInputChange(row.id, "priceType", e.target.value)
                      }
                      className={selectCellStyle}
                    >
                      <Table.Option value="当店通常価格">
                        当店通常価格
                      </Table.Option>
                      <Table.Option value="メーカー希望小売価格">
                        メーカー希望小売価格
                      </Table.Option>
                      <Table.Option value="クーポン利用で">
                        クーポン利用で
                      </Table.Option>
                    </Table.SelectBox>

                    <Table.InputCell
                      type="text"
                      inputMode="numeric"
                      id={`regularPrice-${row.id}`}
                      name={`regularPrice-${row.id}`}
                      className={inputCellStyle}
                      value={row.regularPrice}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "regularPrice",
                          e.target.value
                        )
                      }
                      errorMsg={getErrorMsg("regularPrice")}
                    />

                    <Table.InputCell
                      type="text"
                      inputMode="numeric"
                      id={`salePrice-${row.id}`}
                      name={`salePrice-${row.id}`}
                      className={inputCellStyle}
                      value={row.salePrice}
                      onChange={(e) =>
                        handleInputChange(row.id, "salePrice", e.target.value)
                      }
                      errorMsg={getErrorMsg("salePrice")}
                    />

                    <Table.Td className="p-0 align-top">
                      <div className={tieredContainerStyle}>
                        <div className="border-b border-gray-300">
                          <SelectBox
                            id={`discountType-${row.id}`}
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
                            classNameParent="!mb-0 h-auto"
                          />
                        </div>
                        <TextBox
                          label=""
                          showLabel={false}
                          id={`discount-${row.id}`}
                          name={`discount-${row.id}`}
                          className={cn(
                            tieredInputStyle,
                            "text-center bg-gray-100"
                          )}
                          value={row.discount}
                          readOnly
                        />
                      </div>
                    </Table.Td>

                    <Table.InputCell
                      id={`saleText-${row.id}`}
                      name={`saleText-${row.id}`}
                      placeholder="文言を入力"
                      className={inputCellStyle}
                      value={row.saleText}
                      onChange={(e) =>
                        handleInputChange(row.id, "saleText", e.target.value)
                      }
                      errorMsg={getErrorMsg("saleText")}
                    />

                    <Table.Td className="p-0 align-top">
                      <div className={tieredContainerStyle}>
                        <div className="relative border-b border-gray-300">
                          <TextBox
                            type="datetime-local"
                            label=""
                            showLabel={false}
                            id={`mobileStartDate-${row.id}`}
                            name={`mobileStartDate-${row.id}`}
                            className={cn(tieredInputStyle)}
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
                            className={cn(tieredInputStyle)}
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
  </div> // --- LAZY LOAD (END)
  );
}

