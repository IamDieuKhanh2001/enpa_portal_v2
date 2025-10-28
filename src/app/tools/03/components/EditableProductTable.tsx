// src/app/tools/03/components/EditableProductTable.tsx
"use client";

import React, { useId, useRef } from "react";
import { Table } from "@/component/common/Table";
import { TextBox } from "@/component/common/TextBox";
import { NumberBox } from "@/component/common/NumberBox";
import SelectBox from "@/component/common/SelectBox";
import { Button } from "@/component/common/Button";
import { Card, CardHeader, CardContent } from "@/component/common/Card";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { ProductRow, AllErrors, RowErrors } from "../types"; // Import types từ file riêng
import { templates } from "../constants"; // Import constants từ file riêng
import {
  createNewProductRow,
  calculateDiscountDisplay,
  parseJapaneseDate,
} from "../lib/utils"; // Import utils từ file riêng
import { toast } from "react-toastify";

// Component hiển thị lỗi (giữ lại ở đây vì nó nhỏ và chỉ dùng trong bảng này)
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

// Props interface cho component
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

  // Xử lý thay đổi input trong bảng
  const handleInputChange = (
    id: string,
    field: keyof ProductRow,
    value: string
  ) => {
    let processedValue: string | number = value;
    if (field === "regularPrice" || field === "salePrice") {
      processedValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
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
        return updatedRow;
      })
    );
    setModifiedRowIds((prev) => new Set(prev).add(id));
  };

  // Thêm một dòng mới
  const addRow = () => {
    const newRow = createNewProductRow(baseId);
    setRows((prev) => [...prev, newRow]);
    setModifiedRowIds((prev) => new Set(prev).add(newRow.id));
  };

  // Thêm nhiều dòng mới
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

  // Xóa một dòng
  const deleteRow = (id: string) => {
    setRows((prev) => {
      if (prev.length > 1) {
        return prev.filter((row) => row.id !== id);
      }
      if (prev.length === 1 && prev[0].id === id) {
        console.log(
          ">>> [DEBUG][Table] Last row deleted, resetting table and jobId"
        );
        setJobId(null);
        const initialRow = createNewProductRow("initial-reset");
        // Quan trọng: Phải cập nhật modifiedRowIds TRƯỚC khi setRows để đảm bảo state đồng bộ
        // Tuy nhiên, việc này nên được xử lý ở component cha sau khi setRows hoàn tất
        // Tạm thời chỉ return dòng mới, component cha sẽ xử lý setModifiedRowIds dựa trên rows mới
        // setModifiedRowIds(new Set([initialRow.id])); // Bỏ dòng này
        return [initialRow];
      }
      return prev;
    });
    // Xóa ID khỏi set modified (việc này nên thực hiện ở component cha sau khi setRows)
    // Tạm thời comment out và để component cha xử lý
    // setModifiedRowIds((prev) => {
    //   const newSet = new Set(prev);
    //   newSet.delete(id);
    //   // Nếu sau khi xóa, set rỗng và jobId tồn tại -> có thể cần reset jobId? (logic phức tạp, để cha xử lý)
    //   return newSet;
    // });
  };

  // Mở dialog chọn file CSV
  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  // Xử lý file CSV được chọn
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
          throw new Error("CSV file is empty or has only headers.");

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        if (
          !headers.includes("商品管理番号") ||
          !headers.includes("テンプレート")
        ) {
          throw new Error(
            "CSV header is missing required columns (商品管理番号, テンプレート)."
          );
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
              if (standardPriceTypes.includes(value)) rowData.priceType = value;
              else if (value) {
                rowData.priceType = "custom";
                rowData.customPriceType = value;
              } else rowData.priceType = "当店通常価格";
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
            importedModifiedIds.add(rowData.id);
          }
        });

        if (newRows.length > 0) {
          setRows(newRows); // Cập nhật state ở component cha
          // Việc cập nhật modifiedRowIds và jobId nên do component cha thực hiện
          // setModifiedRowIds(importedModifiedIds); // Bỏ dòng này
          // setJobId(null); // Bỏ dòng này
          toast.success(
            `CSVファイルを読み込み、${newRows.length}件の商品を追加しました。`
          );
        } else {
          toast.warn(
            "CSVファイルの読み込みに失敗したか、有効な商品データが含まれていません。"
          );
        }
      } catch (error) {
        console.error("CSV Parsing Error:", error);
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

  if (rows.length === 0) return null;

  const singleInputStyle =
    "w-full h-full !p-2 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredInputStyle =
    "w-full h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";

  return (
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
              {" "}
              行を追加{" "}
            </Button>
            <Button color="secondary" onClick={() => addMultipleRows(5)}>
              {" "}
              5行を追加{" "}
            </Button>
            <Button color="grey" onClick={handleImportCSV}>
              {" "}
              CSVで一括取り込む{" "}
            </Button>
          </>
        }
      />
      <CardContent className="pb-8">
        <Table.Root className="w-full table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Th width="w-[3%]" center>
                {" "}
                #{" "}
              </Table.Th>
              <Table.Th width="w-[9%]">
                {" "}
                商品管理番号<span className="text-red-500">*</span>{" "}
              </Table.Th>
              <Table.Th width="w-[12%]">
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
              <Table.Th width="w-[15%]">
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
          <Table.Body>
            {rows.map((row, index) => {
              const rowErrors = errors[row.id] || {};
              const hasError = (fieldName: keyof RowErrors) =>
                showErrors && rowErrors[fieldName];
              return (
                <Table.Row key={row.id}>
                  <Table.Td center className="p-2 align-middle">
                    {" "}
                    {index + 1}{" "}
                  </Table.Td>
                  {/* Các ô input khác tương tự như code gốc, sử dụng handleInputChange và ErrorDisplay */}
                  {/* Product Code */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("productCode") && "border border-red-500"
                      )}
                    >
                      <TextBox
                        label=""
                        id={`productCode-${row.id}`}
                        name={`productCode-${row.id}`}
                        placeholder="番号を入力"
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.productCode}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "productCode",
                            e.target.value
                          )
                        }
                      />
                      {hasError("productCode") && (
                        <ErrorDisplay message={rowErrors.productCode} />
                      )}
                    </div>
                  </Table.Td>
                  {/* Template */}
                  <Table.Td className="p-0 align-middle">
                    <SelectBox
                      label=""
                      id={`template-${row.id}`}
                      className={cn(singleInputStyle, "truncate")}
                      options={templates.map((t) => ({
                        value: t.name,
                        label: t.name,
                      }))}
                      value={row.template}
                      onChange={(e) =>
                        handleInputChange(row.id, "template", e.target.value)
                      }
                    />
                  </Table.Td>
                  {/* Start/End Date */}
                  <Table.Td className="p-0 align-top">
                    <div className="w-full border-b border-gray-300 relative">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`startDate-${row.id}`}
                        name={`startDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
                          hasError("startDate") &&
                            "!ring-1 !ring-red-500 !ring-inset"
                        )}
                        value={row.startDate}
                        onChange={(e) =>
                          handleInputChange(row.id, "startDate", e.target.value)
                        }
                      />
                      {hasError("startDate") && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <ErrorDisplay message={rowErrors.startDate} />
                        </div>
                      )}
                    </div>
                    <div className="w-full relative">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`endDate-${row.id}`}
                        name={`endDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
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
                  </Table.Td>
                  {/* Price Type */}
                  <Table.Td className="p-0 align-center">
                    <SelectBox
                      label=""
                      id={`priceType-${row.id}`}
                      className={cn(
                        "w-full h-full !p-2 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary truncate",
                        row.priceType === "custom" &&
                          "!h-8 !py-1 border-b border-gray-300"
                      )}
                      options={[
                        { value: "当店通常価格", label: "当店通常価格" },
                        {
                          value: "メーカー希望小売価格",
                          label: "メーカー希望小売価格",
                        },
                        { value: "クーポン利用で", label: "クーポン利用で" },
                      ]}
                      value={row.priceType}
                      onChange={(e) =>
                        handleInputChange(row.id, "priceType", e.target.value)
                      }
                    />
                    {/* Input cho custom price type (nếu cần) */}
                  </Table.Td>
                  {/* Regular Price */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("regularPrice") && "border border-red-500"
                      )}
                    >
                      <NumberBox
                        label=""
                        id={`regularPrice-${row.id}`}
                        name={`regularPrice-${row.id}`}
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.regularPrice}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "regularPrice",
                            e.target.value
                          )
                        }
                      />
                      {hasError("regularPrice") && (
                        <ErrorDisplay message={rowErrors.regularPrice} />
                      )}
                    </div>
                  </Table.Td>
                  {/* Sale Price */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("salePrice") && "border border-red-500"
                      )}
                    >
                      <NumberBox
                        label=""
                        id={`salePrice-${row.id}`}
                        name={`salePrice-${row.id}`}
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.salePrice}
                        onChange={(e) =>
                          handleInputChange(row.id, "salePrice", e.target.value)
                        }
                      />
                      {hasError("salePrice") && (
                        <ErrorDisplay message={rowErrors.salePrice} />
                      )}
                    </div>
                  </Table.Td>
                  {/* Discount */}
                  <Table.Td className="p-0 align-top">
                    <SelectBox
                      label=""
                      id={`discountType-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        "text-center truncate border-b border-gray-300"
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
                    />
                    <TextBox
                      label=""
                      id={`discount-${row.id}`}
                      name={`discount-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        "text-center bg-gray-100 truncate"
                      )}
                      value={row.discount}
                      readOnly
                    />
                  </Table.Td>
                  {/* Sale Text */}
                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("saleText") && "border border-red-500"
                      )}
                    >
                      <TextBox
                        label=""
                        id={`saleText-${row.id}`}
                        name={`saleText-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.saleText}
                        onChange={(e) =>
                          handleInputChange(row.id, "saleText", e.target.value)
                        }
                      />
                      {hasError("saleText") && (
                        <ErrorDisplay message={rowErrors.saleText} />
                      )}
                    </div>
                  </Table.Td>
                  {/* Mobile Dates */}
                  <Table.Td className="p-0 align-top">
                    <TextBox
                      type="datetime-local"
                      label=""
                      id={`mobileStartDate-${row.id}`}
                      name={`mobileStartDate-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        "border-b border-gray-300 truncate"
                      )}
                      value={row.mobileStartDate}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "mobileStartDate",
                          e.target.value
                        )
                      }
                    />
                    <TextBox
                      type="datetime-local"
                      label=""
                      id={`mobileEndDate-${row.id}`}
                      name={`mobileEndDate-${row.id}`}
                      className={cn(tieredInputStyle, "truncate")}
                      value={row.mobileEndDate}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "mobileEndDate",
                          e.target.value
                        )
                      }
                    />
                  </Table.Td>
                  {/* Delete Button */}
                  <Table.Td center className="p-1 align-middle">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="p-1 text-gray-400 hover:text-red-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                      disabled={rows.length <= 1 && !!jobId}
                    >
                      {" "}
                      <IconTrash size={20} />{" "}
                    </button>
                  </Table.Td>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}
