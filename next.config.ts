import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/shop/", destination: "/shop", permanent: true },
      { source: "/cart/", destination: "/cart", permanent: true },
      { source: "/checkout/", destination: "/checkout", permanent: true },
    ];
  },
};

export default nextConfig;
