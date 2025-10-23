"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../../../component/common/Card";
import { Button } from "../../../component/common/Button";
import { Table } from "../../../component/common/Table";
import { TextBox } from "../../../component/common/TextBox";
import { NumberBox } from "../../../component/common/NumberBox";
import SelectBox from "../../../component/common/SelectBox";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { cn } from "../../../lib/utils";

// --- Dữ liệu cho template ---
const templates = [
  {
    id: 1,
    name: "テンプレートA",
    imgs: ["/img/tool3/sample001-A_2nd.jpg", "/img/tool3/sample002-A_2nd.jpg"],
  },
  {
    id: 2,
    name: "テンプレートB",
    imgs: ["/img/tool3/sample003-B_2nd.jpg", "/img/tool3/sample004-B_2nd.jpg"],
  },
  {
    id: 3,
    name: "テンプレートC",
    imgs: ["/img/tool3/sample005-C_2nd.jpg", "/img/tool3/sample006-C_2nd.jpg"],
  },
  {
    id: 4,
    name: "テンプレートD",
    imgs: ["/img/tool3/sample007-D_2nd.jpg", "/img/tool3/sample008-D_2nd.jpg"],
  },
  {
    id: 5,
    name: "テンプレートE",
    imgs: ["/img/tool3/sample009-E_2nd.jpg", "/img/tool3/sample010-E_2nd.jpg"],
  },
  {
    id: 6,
    name: "テンプレートF",
    imgs: ["/img/tool3/sample011-F_2nd.jpg", "/img/tool3/sample012-F_2nd.jpg"],
  },
];

// --- Định nghĩa kiểu dữ liệu cho một dòng sản phẩm ---
type ProductRow = {
  id: string;
  productCode: string;
  template: string;
  startDate: string;
  endDate: string;
  priceType: string;
  customPriceType: string;
  regularPrice: string;
  salePrice: string;
  saleText: string;
  discount: string;
  discountType: "percent" | "yen" | "";
  mobileStartDate: string;
  mobileEndDate: string;
};

// --- Định nghĩa kiểu cho lỗi ---
type RowErrors = {
  productCode?: string;
  startDate?: string;
  endDate?: string;
  regularPrice?: string;
  salePrice?: string;
  saleText?: string;
};
type AllErrors = { [key: string]: RowErrors };

// --- Hàm tạo một dòng sản phẩm mới ---
const createNewProductRow = (id: string): ProductRow => ({
  id: `${id}-${Date.now()}`,
  productCode: "",
  template: templates[0].name,
  startDate: "",
  endDate: "",
  priceType: "当店通常価格",
  customPriceType: "",
  regularPrice: "",
  salePrice: "",
  saleText: "",
  discount: "",
  discountType: "percent",
  mobileStartDate: "",
  mobileEndDate: "",
});

// --- Component hiển thị lỗi ---
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

// --- Component Bảng Nhập Liệu ---
interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
}

function EditableProductTable({
  rows,
  setRows,
  errors,
  showErrors,
}: EditableProductTableProps) {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateDiscountDisplay = (
    regularPriceStr: string,
    salePriceStr: string,
    type: "percent" | "yen" | ""
  ): string => {
    const regularPrice = parseFloat(regularPriceStr);
    const salePrice = parseFloat(salePriceStr);
    if (
      type &&
      !isNaN(regularPrice) &&
      !isNaN(salePrice) &&
      regularPrice > salePrice
    ) {
      if (type === "percent") {
        const percentage = Math.round(
          ((regularPrice - salePrice) / regularPrice) * 100
        );
        return `${percentage}%OFF`;
      } else {
        const difference = regularPrice - salePrice;
        return `${difference.toLocaleString()}円OFF`;
      }
    }
    return "";
  };

  const handleInputChange = (
    id: string,
    field: keyof ProductRow,
    value: string
  ) => {
    let processedValue: string | number = value;
    if (field === "regularPrice" || field === "salePrice") {
      // Allow only numbers and a single dot
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
  };

  const addRow = () => {
    setRows((prev) => [...prev, createNewProductRow(baseId)]);
  };
  const addMultipleRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) =>
      createNewProductRow(`${baseId}-${i}`)
    );
    setRows((prev) => [...prev, ...newRows]);
  };

  const deleteRow = (id: string) => {
    setRows((prev) => {
      if (prev.length > 1) {
        return prev.filter((row) => row.id !== id);
      }
      return prev;
    });
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const parseJapaneseDate = (dateStr: string): string => {
    if (!dateStr || !dateStr.includes("月")) return "";
    const match = dateStr.match(/(\d{1,2})月(\d{1,2})日(\d{1,2}):(\d{1,2})/);
    if (!match) return "";
    const [, month, day, hour, minute] = match.map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const year = month < currentMonth ? currentYear + 1 : currentYear;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.trim().split(/\r\n|\n/);
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
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
      const newRows: ProductRow[] = lines
        .slice(1)
        .map((line, lineIndex) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const rowData = createNewProductRow(`${baseId}-csv-${lineIndex}`);
          headers.forEach((header, index) => {
            const key = headerMapping[header];
            const value = values[index];
            if (!key || value === undefined) return;
            if (key === "priceType") {
              if (standardPriceTypes.includes(value)) rowData.priceType = value;
              else {
                rowData.priceType = "custom";
                rowData.customPriceType = value;
              }
            } else if (
              [
                "startDate",
                "endDate",
                "mobileStartDate",
                "mobileEndDate",
              ].includes(key as string)
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
          return rowData;
        })
        .filter((row) => row.productCode);
      if (newRows.length > 0) setRows(newRows);
      else alert("CSVファイルの読み込みに失敗したか、内容が空です。");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      alert("ファイルの読み込み中にエラーが発生しました。");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file, "Shift_JIS");
  };

  if (rows.length === 0) return null;

  const singleInputStyle =
    "w-full h-full !p-2 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredInputStyle =
    "w-full h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredInputFlexStyle =
    "flex-grow h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";

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
        buttonGroup={
          <>
            <Button color="secondary" onClick={() => addRow()}>
              行を追加
            </Button>
            <Button color="secondary" onClick={() => addMultipleRows(5)}>
              5行を追加
            </Button>
            <Button color="grey" onClick={() => handleImportCSV()}>
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
                #
              </Table.Th>
              <Table.Th width="w-[12%]">
                商品管理番号<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[12%]">テンプレート</Table.Th>
              <Table.Th width="w-[13%]">
                開始 / 終了日時<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[11%]">二重価格</Table.Th>
              <Table.Th width="w-[7%]">
                価格<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[7%]">
                セール価格<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[12%]">セール文言</Table.Th>
              <Table.Th width="w-[9%]">
                割引表示<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[13%]">
                楽天モバイル
                <br />
                開始 / 終了日時
              </Table.Th>
              <Table.Th width="w-[3%]" center>
                削除
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
                    {index + 1}
                  </Table.Td>

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

                  <Table.Td className="p-0 align-top">
                    {/* 開始日時 */}
                    <div className="w-full border-b border-gray-300">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`startDate-${row.id}`}
                        name={`startDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
                          hasError("startDate") && "border border-red-500"
                        )}
                        value={row.startDate}
                        onChange={(e) =>
                          handleInputChange(row.id, "startDate", e.target.value)
                        }
                      />
                      {hasError("startDate") && (
                        <ErrorDisplay message={rowErrors.startDate} />
                      )}
                    </div>

                    {/* 終了日時 */}
                    <div className="w-full">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`endDate-${row.id}`}
                        name={`endDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
                          hasError("endDate") && "border border-red-500"
                        )}
                        value={row.endDate}
                        onChange={(e) =>
                          handleInputChange(row.id, "endDate", e.target.value)
                        }
                      />
                      {hasError("endDate") && (
                        <ErrorDisplay message={rowErrors.endDate} />
                      )}
                    </div>
                  </Table.Td>

                  <Table.Td className="p-0 align-top">
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
                        { value: "custom", label: "店舗自由記入" },
                      ]}
                      value={row.priceType}
                      onChange={(e) =>
                        handleInputChange(row.id, "priceType", e.target.value)
                      }
                    />
                    {row.priceType === "custom" && (
                      <TextBox
                        label=""
                        id={`customPrice-${row.id}`}
                        name={`customPrice-${row.id}`}
                        placeholder="自由記入"
                        className={cn(tieredInputStyle, "truncate")}
                        value={row.customPriceType}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "customPriceType",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </Table.Td>

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

                  <Table.Td center className="p-1 align-middle">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className={`p-1 ${
                        rows.length > 1
                          ? "text-gray-400 hover:text-red-600"
                          : "text-gray-200 cursor-not-allowed"
                      }`}
                      disabled={rows.length <= 1}
                    >
                      <IconTrash size={20} />
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

// --- Component Trang chính ---
export default function TwoPriceImagePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<AllErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);

  useEffect(() => {
    setIsClient(true);
    setProductRows([createNewProductRow("initial-page-load")]);
  }, []);

  const validateRows = (rows: ProductRow[]) => {
    const newErrors: AllErrors = {};
    const productCodes = new Map<string, string[]>();

    rows.forEach((row) => {
      if (row.productCode) {
        if (!productCodes.has(row.productCode)) {
          productCodes.set(row.productCode, []);
        }
        productCodes.get(row.productCode)!.push(row.id);
      }
    });

    rows.forEach((row) => {
      const rowErrors: RowErrors = {};
      if (!row.productCode) rowErrors.productCode = "必須項目です。";
      if (!row.startDate) rowErrors.startDate = "必須項目です。";
      if (!row.endDate) rowErrors.endDate = "必須項目です。";

      if (!row.regularPrice) {
        rowErrors.regularPrice = "必須項目です。";
      } else if (isNaN(parseFloat(row.regularPrice))) {
        rowErrors.regularPrice = "数値を入力してください。";
      }

      if (!row.salePrice) {
        rowErrors.salePrice = "必須項目です。";
      } else if (isNaN(parseFloat(row.salePrice))) {
        rowErrors.salePrice = "数値を入力してください。";
      }

      if (row.productCode && productCodes.get(row.productCode)!.length > 1) {
        rowErrors.productCode = "番号が重複しています。";
      }

      const regularPrice = parseFloat(row.regularPrice);
      const salePrice = parseFloat(row.salePrice);
      if (
        !isNaN(regularPrice) &&
        !isNaN(salePrice) &&
        regularPrice <= salePrice
      ) {
        rowErrors.salePrice = "通常価格より低く設定してください。";
      }

      if (row.saleText && row.saleText.length > 12) {
        rowErrors.saleText = "12文字以内で入力してください。";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.id] = rowErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreviewClick = () => {
    const isValid = validateRows(productRows);
    setShowErrors(true); // Always show errors after the button is clicked
    if (!isValid) {
      alert("入力内容にエラーがあります。確認してください。");
      return;
    }
    // Proceed with preview logic
    setShowErrors(false); // Hide errors if validation is successful
    alert("プレビュー機能は開発中です。");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">二重価格画像作成</h1>
      <Card>
        <CardHeader title="1. テンプレート" />
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

      {isClient && (
        <EditableProductTable
          rows={productRows}
          setRows={setProductRows}
          errors={errors}
          showErrors={showErrors}
        />
      )}

      <div className="flex justify-center pt-4">
        <Button color="primary" onClick={handlePreviewClick}>
          プレビュー
        </Button>
      </div>

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
    </div>
  );
}
