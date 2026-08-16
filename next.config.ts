/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "192.168.1.73",
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
  ],
};
module.exports = nextConfig;