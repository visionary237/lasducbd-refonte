/** @type {import('next').NextConfig} */
const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true },
  async headers() {
    return [
      { source: "/:path*", headers: [...security, { key: "X-Frame-Options", value: "SAMEORIGIN" }] },
    ];
  },
};
export default nextConfig;
