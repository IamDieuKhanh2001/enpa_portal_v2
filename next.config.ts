import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: "/api/:path*", // Bất kỳ đường dẫn nào bắt đầu bằng /api/
        destination: "http://127.0.0.1:8000/:path*", // Sẽ được chuyển đến backend ở port 8000
      },
      // thêm các rewrite rule khác ở đây nếu cần
    ];
  },
};

export default nextConfig;
