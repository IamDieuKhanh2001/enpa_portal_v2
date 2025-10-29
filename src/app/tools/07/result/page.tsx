"use client"

import React, { useState, useRef } from 'react';

const fallbackCopyTextToClipboard = (text, ref) => {
    try {
        ref.current.select();
        ref.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
        return true;
    } catch (err) {
        console.error("Fallback: コピーに失敗しました", err);
        return false;
    }
};

const ReviewImageNotification = () => {
    // 状態管理 (変更なし)
    const totalProducts = 50;
    const productsWithImage = 35;
    const percentage = Math.round((productsWithImage / totalProducts) * 100);
    const imageUrl = "https://www.rakuten.ne.jp/";

    // コピーボタンの表示テキストと状態
    const [copyButtonText, setCopyButtonText] = useState("コピー");

    // URL Input要素への参照 (Ref)
    const urlInputRef = useRef(null);

    // コピーボタンのクリックハンドラ (変更なし)
    const handleCopyClick = async () => {
        const textToCopy = urlInputRef.current.value;
        let copySuccess = false;

        // Clipboard API またはフォールバックを使用してコピーを試行
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                copySuccess = true;
            } catch (err) {
                copySuccess = fallbackCopyTextToClipboard(textToCopy, urlInputRef);
            }
        } else {
            copySuccess = fallbackCopyTextToClipboard(textToCopy, urlInputRef);
        }

        // UIの更新
        if (copySuccess) {
            setCopyButtonText("コピーしました！");
            setTimeout(() => {
                setCopyButtonText("コピー");
            }, 2000);
        }
    };

    return (
        // bodyのスタイルをメインのコンポーネントに反映
        <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-11/12 text-center">

                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    レビュー画像の掲載状況を更新しました！
                </h1>

                <p className="text-base text-gray-600 mb-2">
                    現在販売中の
                    <strong className="text-red-600 font-bold">
                        {totalProducts}商品中、{productsWithImage}商品（{percentage}%）
                    </strong>
                    にレビュー画像掲載中です！
                </p>

                {/* プログレスバー */}
                <div className="w-full bg-gray-200 rounded-md my-6 h-2 overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-md transition-all duration-500 ease-in-out"
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                <hr className="border-t border-gray-200 my-6" />

                <p className="text-base text-gray-600">以下のフォルダに画像を格納しました。</p>

                {/* URLセクション */}
                <div className="my-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            id="url-input"
                            value={imageUrl}
                            readOnly
                            ref={urlInputRef}
                            className="flex-grow p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-red-500"
                        />
                    </div>
                </div>

                {/* ボタン行 */}
                <div className="flex justify-between space-x-4 mt-6">
                    {/* 二次ボタン */}
                    <button className="py-2.5 px-5 bg-gray-100 text-gray-700 rounded-lg text-base cursor-pointer transition-colors duration-300 hover:bg-gray-200 flex-grow">
                        ホームに戻る
                    </button>

                    {/* 主ボタン (コピー) */}
                    <button
                        id="copy-button"
                        className="py-2.5 px-5 bg-red-600 text-white rounded-lg text-base cursor-pointer transition-colors duration-300 hover:bg-red-700 flex-grow"
                        onClick={handleCopyClick}
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewImageNotification;