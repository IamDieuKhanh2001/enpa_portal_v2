import { NextResponse } from "next/server";
import FTPClient from "basic-ftp";
import { Readable } from "stream";

export async function POST(req: Request) {
    try {
        const client = new FTPClient.Client();
        const body = await req.json();
        const { fileName, content } = body;

        client.ftp.verbose = true; // hiện log FTP

        await client.access({
            host: "ftp.rakuten.ne.jp",      // host FTP Rakuten GOLD
            port: 16910,                    // cổng Rakuten GOLD
            user: "auc-ronnefeldt",         // ID cửa hàng
            password: "Ronne@04",           // mật khẩu RMS FTP
            secure: false,                  // không dùng FTPS
        });

        // chuyển đến folder upload
        await client.ensureDir("/public_html/4");

        const buffer = Buffer.from(content, "utf-8");
        const stream = Readable.from(buffer);

        await client.uploadFrom(stream, "header.html");

        // Kiểm tra lại bằng cách liệt kê file
        const list = await client.list("/public_html/4");
        const uploadedFile = list.find((f) => f.name === "header.html");

        client.close();

        if (uploadedFile) {
            return NextResponse.json({ success: true, message: "Upload success" });
        } else {
            return NextResponse.json({ success: false, message: "Upload fail" });
        }

    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message });
    }
}