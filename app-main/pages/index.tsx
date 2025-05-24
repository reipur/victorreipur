// pages/index.tsx
'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const CV_URL =
  'https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/Victor_Reipur_CV.pdf';

const imageFilenames = [
  'DJI_27_optimized.webp',
  'DJI_31_optimized.webp',
  'DJI_39_optimized.webp',
  'DJI_43_optimized.webp',
  'DJI_47_optimized.webp',
  'DJI_51_optimized.webp',
  'DJI_59_optimized.webp',
];

export default function Home() {
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    let idx = Number(sessionStorage.getItem('bgImageIndex'));
    if (isNaN(idx) || idx < 0 || idx >= imageFilenames.length) idx = 0;
    else idx = (idx + 1) % imageFilenames.length;
    sessionStorage.setItem('bgImageIndex', idx.toString());
    setBgUrl(
      `https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/images/havearbejde/${imageFilenames[idx]}`
    );
  }, []);

  return (
    <>
      <Head>
        <title>victorreipur.dk</title>
      </Head>

      <main
        className="flex flex-col items-center justify-center min-h-screen w-screen bg-cover bg-center p-4 text-white text-center gap-8"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      >
        {/* Embedded CV */}
        <div className="w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
          <iframe
            src={CV_URL}
            className="w-full h-full"
            title="Victor Reipur CV"
          />
        </div>

        {/* Iframe Windows—all 400px tall */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          <iframe
            src="https://mixedenergy.dk"
            className="w-full h-[400px] rounded-lg shadow-md border"
            title="Mixed Energy"
          />

          <iframe
            src="https://judydu.dk"
            className="w-full h-[400px] rounded-lg shadow-md border"
            title="Judy Du"
          />

          <iframe
            src={`/api/proxy?url=${encodeURIComponent(
              'https://arctic.sustain.dtu.dk/find/publications/frontpage/'
            )}`}
            className="w-full h-[400px] rounded-lg shadow-md border"
            title="DTU Arctic Publications"
          />
        </div>
      </main>
    </>
  );
}
