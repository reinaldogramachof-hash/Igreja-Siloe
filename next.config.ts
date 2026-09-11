import type { NextConfig } from "next";

// Export estatico para hospedagem sem processo Node (HostGator Plano M - OPS-01).
// trailingSlash gera /rota/index.html, que o Apache serve como diretorio sem
// precisar de rewrite no .htaccess para cada rota.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
