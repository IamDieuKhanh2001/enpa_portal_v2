"use client"

import { useHeader } from '@/app/context/HeaderContext';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const page = () => {

    const [reviewHtml, setReviewHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [successUpload, setSuccessUpload] = useState(false);
    const [code, setCode] = useState("");

    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle("楽天GOLD ヘッダー生成");
    }, [setTitle]);

    const uploadToRakutenGold = async () => {
        try {
            setLoading(true);
            setSuccessUpload(false);
            const uploadRakutenHtml = reviewHtml.replace(/<base[^>]*>/i, "");

            const res = await fetch("/api/tools/04", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: "header_4.html", content: uploadRakutenHtml }),
            });
            const data = await res.json();
            toast.success(data.message);
            setSuccessUpload(true);
            createSourceCode();
        } catch (err) {
            setSuccessUpload(false);
            toast.error("アップロード中にエラーが発生しました。");
        }
        finally {
            setLoading(false);
        };
    }

    const createSourceCode = () => {

        const iframeCode = [
            "<iframe",
            `  src="https://www.rakuten.ne.jp/gold/auc-ronnefeldt/public_html/tools/4/header_4.html"`,
            '  frameborder="0"',
            '  style="width: 100%; height: 2000px"',
            '  sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation"',
            "></iframe>",
        ].join("\n");
        setCode(iframeCode);
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("コードをクリップボードにコピーしました！");
        } catch (err) {
            toast.error("コードのコピーに失敗しました。");
        }
    };

    const backToEdit = () => {

        if (window.opener && !window.opener.closed) {
            window.opener.focus(); // focus back to original tab
            window.close(); // close current tab
        } else {
            toast.error("元のタブが見つかりません。");
        }
    }

    useEffect(() => {
        const temp = sessionStorage.getItem("reviewHtml");
        if (temp) setReviewHtml(temp);
    }, []);

    return (
        <>
            {!successUpload ? (
                <>
                    <iframe
                        ref={iframeRef}
                        srcDoc={reviewHtml}
                        className="bg-white w-full h-[600px] border rounded-md"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation"
                    />
                    <div className="flex justify-center mt-4">
                        <Button
                            size='lg'
                            className='mr-2 bg-gray-300 text-gray-700 hover:bg-gray-400'
                            onClick={() => backToEdit()}
                        >
                            修正
                        </Button>
                        <Button
                            disabled={loading}
                            size='lg'
                            onClick={uploadToRakutenGold}>
                            {loading ?
                                <IconLoader2
                                    className="animate-spin"
                                />
                                :
                                <>
                                    Rakutenにアップロード
                                </>
                            }
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center">
                    <Card className='w-full max-w-lg p-6 flex flex-col gap-4'>
                        <CardContent>
                            {/* icon success */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-3">
                                    <IconCheck className="text-green-600 w-6 h-6" />
                                </div>
                            </div>

                            {/* title */}
                            <h2 className="text-center text-lg font-bold mb-4">
                                ヘッダーの生成が完了しました！
                            </h2>

                            {/* description */}
                            <p className="text-center text-sm text-gray-600 mb-4">
                                以下のコードをコピーし、RMSのヘッダー設定画面に貼り付けてください。
                            </p>

                            {/* code box */}
                            <textarea
                                readOnly={true}
                                value={code}
                                className="w-full h-40 p-3 text-sm font-mono whitespace-pre border border-gray-300 rounded resize-none bg-gray-50"
                            />

                            {/* buttons */}
                            <div className="flex justify-between mt-2">
                                <Button onClick={() => router.push("/")} size='lg' className='bg-gray-300 text-gray-700 hover:bg-gray-400'>
                                    ホームに戻る
                                </Button>
                                <Button onClick={() => handleCopy()} size='lg' color='primary'>
                                    コードをコピー
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
export default page
