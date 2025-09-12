/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.mattloam.ru",
                port: "",
                pathname: "/media/**",
            },
            {
                protocol: "https",
                hostname: "avatars.mds.yandex.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/media/**",
            }
        ]
    }
};

export default nextConfig;
