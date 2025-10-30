// src/app/tools/03/components/RestoreSessionPopup.tsx
import React from "react";
import { Button } from "@/component/common/Button";

interface RestoreSessionPopupProps {
  onResponse: (restore: boolean) => void;
}

function RestoreSessionPopup({ onResponse }: RestoreSessionPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-3">
          未完了のセッションがあります
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          前回終了しなかった作業データが見つかりました。復元しますか？
        </p>
        <div className="flex justify-center space-x-4">
          <Button color="secondary" onClick={() => onResponse(false)}>
            いいえ (新規作成)
          </Button>
          <Button color="primary" onClick={() => onResponse(true)}>
            はい (復元する)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RestoreSessionPopup;
