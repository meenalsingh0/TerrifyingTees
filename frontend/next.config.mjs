



/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;




// docker-------------------
///** @type {import('next').NextConfig} */
//const nextConfig = {
//  reactStrictMode: true,

  // ─── Proxy API requests to NestJS backend ───
  // This avoids CORS issues during development.
  // All frontend requests to /api/v1/* get forwarded to the backend.
  //async rewrites() {
    //return [
      //{
        //source: "/api/v1/:path*",
//        //destination: "http://backend:3001/api/v1/:path*",
//    },
//];
//  },
//};

//export default nextConfig;

