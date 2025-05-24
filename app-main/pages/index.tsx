// pages/index.tsx
'use client';
import { useEffect, useState, useRef, FC } from 'react';
import Head from 'next/head';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

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

// loader CSS injected globally
const LoaderStyles = () => (
  <style jsx global>{`
    .loader {
      height: 40px;
      aspect-ratio: 1.5;
      --c: no-repeat linear-gradient(#fff 0 0);
      background: var(--c), var(--c), var(--c), var(--c);
      background-size: 33.4% 50%;
      animation: l3 2s infinite linear;
    }
    @keyframes l3 {
      0%    {background-position:0 0,50% 0,0 100%,50% 100%}
      12.5% {background-position:0 0,100% 0,0 100%,50% 100%}
      25%   {background-position:50% 0,100% 0,0 100%,50% 100%}
      37.5% {background-position:50% 0,100% 0,0 100%,100% 100%}
      50%   {background-position:50% 0,100% 0,50% 100%,100% 100%}
      62.5% {background-position:0 0,100% 0,50% 100%,100% 100%}
      75%   {background-position:0 0,50% 0,50% 100%,100% 100%}
      87.5% {background-position:0 0,50% 0,0 100%,100% 100%}
      100%  {background-position:0 0,50% 0,0 100%,50% 100%}
    }
  `}</style>
);

const ScaledIframe: FC<{ src: string; title: string }> = ({ src, title }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);
  const [loading, setLoading] = useState(true);

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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="loader" />
        </div>
      )}
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
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [bgUrl, setBgUrl] = useState('');
  const [isNarrow, setIsNarrow] = useState(false);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    let idx = Number(sessionStorage.getItem('bgImageIndex'));
    if (isNaN(idx) || idx < 0 || idx >= imageFilenames.length) idx = 0;
    else idx = (idx + 1) % imageFilenames.length;
    sessionStorage.setItem('bgImageIndex', idx.toString());
    setBgUrl(
      `https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/images/havearbejde/${imageFilenames[idx]}`
    );

    const checkWidth = () => setIsNarrow(window.innerWidth < 800);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <>
      <LoaderStyles />
      <Head>
        <title>victorreipur.dk</title>
      </Head>
      <main
        className="flex flex-col items-center justify-center min-h-screen w-screen bg-cover bg-center p-4 text-white text-center gap-8"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      >
        {/* CV section */}
        <div className="w-full max-w-4xl text-left relative">
          <a
            href="/cv"
            target={isNarrow ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="inline-flex items-center mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-medium transition z-10"
          >
            View full CV
            <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
          </a>
          {cvLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <div className="loader" />
            </div>
          )}
          <div className="w-full h-[80vh] bg-white rounded-xl shadow-lg overflow-auto">
            <iframe
              src={CV_URL}
              className="w-full h-full"
              title="Victor Reipur CV"
              onLoad={() => setCvLoading(false)}
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
