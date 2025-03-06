/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'www.nytimes.com',
      'static01.nyt.com',
      'media.guim.co.uk',
      'i.guim.co.uk',
    ],
  },
};

export default nextConfig;
