// src/app/tools/03/lib/validation.ts
import type { ProductRow, AllErrors, RowErrors } from "../types";

/**
 * Kiểm tra tính hợp lệ của tất cả các dòng sản phẩm.
 * @param rows - Mảng các đối tượng ProductRow cần kiểm tra.
 * @returns Một đối tượng chứa lỗi (AllErrors) và boolean cho biết có lỗi hay không.
 */
export const validateRows = (
  rows: ProductRow[]
): { errors: AllErrors; isValid: boolean } => {
  const newErrors: AllErrors = {};
  const productCodes = new Map<string, string[]>(); // Dùng để kiểm tra trùng productCode

  // Bước 1: Tìm các productCode bị trùng lặp
  rows.forEach((row) => {
    if (row.productCode) {
      if (!productCodes.has(row.productCode)) {
        productCodes.set(row.productCode, []);
      }
      productCodes.get(row.productCode)!.push(row.id); // Lưu lại các ID dùng chung code
    }
  });

  // Bước 2: Kiểm tra từng dòng
  rows.forEach((row) => {
    const rowErrors: RowErrors = {};

    // Kiểm tra Product Code
    if (!row.productCode) {
      rowErrors.productCode = "必須項目です。";
    } else if (productCodes.get(row.productCode)!.length > 1) {
      // Kiểm tra nếu code này được dùng ở > 1 dòng
      rowErrors.productCode = "番号が重複しています。";
    }

    // Kiểm tra Ngày tháng
    if (!row.startDate) rowErrors.startDate = "必須項目です。";
    if (!row.endDate) rowErrors.endDate = "必須項目です。";
    // (Có thể thêm kiểm tra endDate > startDate nếu cần)

    // Kiểm tra Giá gốc
    if (!row.regularPrice) {
      rowErrors.regularPrice = "必須項目です。";
    } else if (
      isNaN(parseFloat(row.regularPrice)) ||
      parseFloat(row.regularPrice) < 0
    ) {
      rowErrors.regularPrice = "有効な数値を入力してください。";
    }

    // Kiểm tra Giá Sale
    if (!row.salePrice) {
      rowErrors.salePrice = "必須項目です。";
    } else if (
      isNaN(parseFloat(row.salePrice)) ||
      parseFloat(row.salePrice) < 0
    ) {
      rowErrors.salePrice = "有効な数値を入力してください。";
    }

    // Kiểm tra Giá Sale < Giá gốc (chỉ khi cả 2 là số hợp lệ)
    const regularPriceNum = parseFloat(row.regularPrice);
    const salePriceNum = parseFloat(row.salePrice);
    if (
      !isNaN(regularPriceNum) &&
      !isNaN(salePriceNum) &&
      regularPriceNum <= salePriceNum
    ) {
      rowErrors.salePrice = "通常価格より低く設定してください。";
    }

    // Kiểm tra độ dài Sale Text (nếu có nhập)
    if (row.saleText && row.saleText.length > 12) {
      rowErrors.saleText = "12文字以内で入力してください。";
    }

    // Gán lỗi vào đối tượng newErrors nếu có lỗi cho dòng này
    if (Object.keys(rowErrors).length > 0) {
      newErrors[row.id] = rowErrors;
    }
  });

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};
