import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false, // Desactiva el indicador flotante de desarrollo para una vista limpia
};

export default nextConfig;
