"use client"

import { Button } from '@/component/common/Button';
import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

const page = () => {

    const [reviewHtml, setReviewHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(false);

    const uploadToRakutenGold = async () => {
        try {
            setLoading(true);
            const uploadRakutenHtml = reviewHtml.replace(/<base[^>]*>/i, "");

            const res = await fetch("/api/tools/4", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: "header_4.html", content: uploadRakutenHtml }),
            });
            const data = await res.json();
            toast.success(data.message);
        } catch (err) {
            toast.error("アップロード中にエラーが発生しました。");
        }
        finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        const temp = sessionStorage.getItem("reviewHtml");
        if (temp) setReviewHtml(temp);
    }, []);

    return (
        <>
            <iframe
                ref={iframeRef}
                srcDoc={reviewHtml}
                className="w-full h-[600px] border rounded-md"
                sandbox="allow-scripts allow-same-origin"
            />
            <div className="text-center mt-6">
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
                            Rakuten Gold にアップロード
                        </>
                    }
                </Button>
            </div>
        </>
    )
}
export default page
