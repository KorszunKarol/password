/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb'
    }
  },
  async rewrites() {
    const dest = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/:path*' : 'http://backend:8000/api/:path*'
    return [
      {
        source: '/api/:path*',
        destination: dest
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM *"
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *"
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;