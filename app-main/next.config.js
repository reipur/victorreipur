// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['supabase.victorreipur.dk'],
  },
  async rewrites() {
    return [
      {
        source: '/cv',
        destination:
          'https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/Victor_Reipur_CV.pdf',
      },
    ];
  },
};

export default nextConfig;
