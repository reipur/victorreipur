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
      {
        // proxy any /dtu/* → arctic.sustain.dtu.dk/*
        source: '/dtu/:path*',
        destination: 'https://arctic.sustain.dtu.dk/:path*',
      },
    ];
  },
};

export default nextConfig;
