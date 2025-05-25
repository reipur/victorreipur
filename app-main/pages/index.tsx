// pages/index.tsx
'use client';

import { useEffect, useState, useRef, FC } from 'react';
import Head from 'next/head';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';

const CV_URL = 'https://victorreipur.dk/cv';
const imageFilenames = ['DJI_47_optimized.webp'];

const iframeConfigs: Array<{
  src: string;
  link?: string;
  title: string;
  description: string;
}> = [
  {
    src: 'https://mixedenergy.dk',
    title: 'Mixed Energy',
    description: 'E-Handelsbutik',
  },
  {
    src: 'https://judydu.dk',
    title: 'Judy Du',
    description: `Judy Du's portfolio`,
  },
  {
    src: `/api/proxy?url=${encodeURIComponent(
      'https://arctic.sustain.dtu.dk/find/publications/frontpage/'
    )}`,
    title: 'Arctic Publications',
    description: `DTU's Arktiske Publikationer`,
  },
  {
    src: 'https://vault.vezit.net/#/login',
    link: 'https://vault.reipur.dk/#/login',
    title: 'Vaultwarden',
    description: 'Min password manager',
  },
  {
    src: 'https://wazuh.vezit.net',
    title: 'Wazuh',
    description: 'Mit SIEM system',
  },
  {
    src: 'https://penpot.reipur.dk',
    title: 'Penpot',
    description: 'Mit design og prototype værktøj',
  },
];

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

const ScaledIframe: FC<{
  src: string;
  link?: string;
  onLoadReady: () => void;
}> = ({ src, link, onLoadReady }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcScale = () => {
      const w = wrapperRef.current?.offsetWidth ?? 1920;
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
        href={link ?? src}
        target={isNarrow ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg border">
        <iframe
          src={src}
          title={src}
          className="pointer-events-none"
          style={{
            width: '1920px',
            height: '1080px',
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            border: 'none',
          }}
          onLoad={() => {
            setLoading(false);
            onLoadReady();
          }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [bgUrl, setBgUrl] = useState('');
  const [isNarrow, setIsNarrow] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // background & mobile check
  useEffect(() => {
    let idx = Number(sessionStorage.getItem('bgImageIndex'));
    if (isNaN(idx) || idx < 0 || idx >= imageFilenames.length) idx = 0;
    sessionStorage.setItem(
      'bgImageIndex',
      ((idx + 1) % imageFilenames.length).toString()
    );
    setBgUrl(
      `https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/images/havearbejde/${imageFilenames[idx]}`
    );

    const checkWidth = () => setIsNarrow(window.innerWidth < 800);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // after each iframe loads, wait 6s then allow next
  const handleLoadReady = () => {
    setTimeout(() => {
      setLoadedCount((c) => Math.min(c + 1, iframeConfigs.length - 1));
    }, 100);
  };

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
        <a
          href={CV_URL}
          target={isNarrow ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="inline-flex items-center mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-medium transition z-10"
        >
          <DocumentChartBarIcon className="h-6 w-6 mr-2" />
          Mit CV
        </a>

        <div className="w-full max-w-6xl p-8 bg-black bg-opacity-50 rounded-lg space-y-8">
          {/* First row */}
          <h2 className="text-3xl font-bold">Apps jeg har udviklet</h2>
          <div className="grid grid-cols-3 gap-6">
            {iframeConfigs.slice(0, 3).map((cfg, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-800 p-4 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{cfg.title}</h3>
                <p className="mb-4 text-gray-300">{cfg.description}</p>
                {i <= loadedCount ? (
                  <ScaledIframe
                    src={cfg.src}
                    link={cfg.link}
                    onLoadReady={handleLoadReady}
                  />
                ) : (
                  <div
                    className="relative w-full"
                    style={{ paddingTop: '56.25%' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                      <div className="loader" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Second row */}
          <h2 className="text-3xl font-bold">Apps jeg drifter og bruger</h2>
          <div className="grid grid-cols-3 gap-6">
            {iframeConfigs.slice(3, 6).map((cfg, i) => {
              const idx = i + 3;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-gray-800 p-4 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{cfg.title}</h3>
                  <p className="mb-4 text-gray-300">{cfg.description}</p>
                  {idx <= loadedCount ? (
                    <ScaledIframe
                      src={cfg.src}
                      link={cfg.link}
                      onLoadReady={handleLoadReady}
                    />
                  ) : (
                    <div
                      className="relative w-full"
                      style={{ paddingTop: '56.25%' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="loader" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
