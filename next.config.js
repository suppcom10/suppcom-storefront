
const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      // Cloudflare R2 - SUPPCOM
      {
        protocol: "https",
        hostname: "pub-45eb196cef9a4189a8dc90cabf732c2d.r2.dev",
      },

      // Desarrollo local
      {
        protocol: "http",
        hostname: "localhost",
      },

      // Amazon S3 - Medusa
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },

      // Deltron Peru - Imagenes de productos
      {
        protocol: "https",
        hostname: "imagenes.deltron.com.pe",
        pathname: "/images/**",
      },

      // Medusa Cloud
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
