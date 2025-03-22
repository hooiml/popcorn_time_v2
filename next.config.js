/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.themoviedb.org',
          port: '',
          pathname: '/t/p/w220_and_h330_face/**',
        },
      ],
  },
}

module.exports = nextConfig
