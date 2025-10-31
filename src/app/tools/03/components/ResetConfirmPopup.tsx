// src/app/tools/03/components/ResetConfirmPopup.tsx
import React from "react";
import { Button } from "@/component/common/Button";

interface ResetConfirmPopupProps {
  onResponse: (confirm: boolean) => void;
}

/**
 * テーブルリセット確認用のポップアップコンポーネント
 */
function ResetConfirmPopup({ onResponse }: ResetConfirmPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-3">リセット確認</h3>
        <p className="text-sm text-gray-600 mb-5">
          すべての入力内容がクリアされます。
          <br />
          よろしいですか？
        </p>
        <div className="flex justify-center space-x-4">
          <Button color="secondary" onClick={() => onResponse(false)}>
            キャンセル
          </Button>
          <Button color="primary" onClick={() => onResponse(true)}>
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetConfirmPopup;
