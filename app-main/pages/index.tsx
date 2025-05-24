// pages/index.tsx
'use client';
import { useEffect, useState, useRef, FC } from 'react';
import Head from 'next/head';

const CV_URL = 'https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/Victor_Reipur_CV.pdf';
const imageFilenames = [
  'DJI_27_optimized.webp',
  'DJI_31_optimized.webp',
  'DJI_39_optimized.webp',
  'DJI_43_optimized.webp',
  'DJI_47_optimized.webp',
  'DJI_51_optimized.webp',
  'DJI_59_optimized.webp',
];

const ScaledIframe: FC<{ src: string; title: string }> = ({ src, title }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const calcScale = () => {
      const w = wrapperRef.current?.offsetWidth || 1920;
      setScale(w / 1920);
    };
    const checkWidth = () => setIsNarrow(window.innerWidth < 800);

    calcScale();
    checkWidth();
    window.addEventListener('resize', calcScale);
    window.addEventListener('resize', checkWidth);
    return () => {
      window.removeEventListener('resize', calcScale);
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ paddingTop: '56.25%' }}
    >
      <a
        href={src}
        target={isNarrow ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
      />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg border transition-transform duration-200 hover:scale-105 hover:shadow-xl">
        <iframe
          src={src}
          title={title}
          className="pointer-events-none"
          style={{
            width: '1920px',
            height: '1080px',
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [bgUrl, setBgUrl] = useState('');
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    // rotate background
    let idx = Number(sessionStorage.getItem('bgImageIndex'));
    if (isNaN(idx) || idx < 0 || idx >= imageFilenames.length) idx = 0;
    else idx = (idx + 1) % imageFilenames.length;
    sessionStorage.setItem('bgImageIndex', idx.toString());
    setBgUrl(
      `https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/images/havearbejde/${imageFilenames[idx]}`
    );

    // check width for link behavior
    const checkWidth = () => setIsNarrow(window.innerWidth < 800);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
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
        {/* CV section with explicit link above */}
        <div className="w-full max-w-4xl text-left">
          <a
            href="/cv"
            target={isNarrow ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="inline-block mb-2 text-sm font-medium text-blue-200 hover:underline"
          >
            View full CV →
          </a>
          <div className="w-full h-[80vh] bg-white rounded-xl shadow-lg overflow-auto">
            <iframe
              src={CV_URL}
              className="w-full h-full"
              title="Victor Reipur CV"
            />
          </div>
        </div>

        {/* scaled iframes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          <ScaledIframe src="https://mixedenergy.dk" title="Mixed Energy" />
          <ScaledIframe src="https://judydu.dk" title="Judy Du" />
          <ScaledIframe
            src={`/api/proxy?url=${encodeURIComponent(
              'https://arctic.sustain.dtu.dk/find/publications/frontpage/'
            )}`}
            title="DTU Arctic Publications"
          />
        </div>
      </main>
    </>
  );
}
