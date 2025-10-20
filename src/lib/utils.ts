import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ユーティリティ関数で、Tailwind CSSクラスを条件付きで結合します。
 * @param {...ClassValue} inputs - 結合するクラス値。
 * @returns {string} - マージされたクラス文字列。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
