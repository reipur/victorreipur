// pages/index.tsx
'use client';

import { useEffect, useState, useRef, FC } from 'react';
import Head from 'next/head';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';

// ---- Static data ----------------------------------------------------------
const CV_URL = 'https://victorreipur.dk/cv';
const imageFilenames = ['DJI_47_optimized.webp'];

// Website configuration; mark the main site and fall-backs for everything else
const sites: Array<{
  src: string;
  link?: string;
  title: string;
  description: string;
  main?: boolean;
}> = [
  {
    src: 'https://mixedenergy.dk',
    title: 'Mixed Energy',
    description: 'E-Handelsbutik',
    main: true, // <— only iframe we want to show
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
    description: 'Mit design og prototype-værktøj',
  },
];

// ---- Visual helpers -------------------------------------------------------

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

// Single responsive iframe that keeps 16:9 and scales with viewport
const ScaledIframe: FC<{ src: string; link?: string }> = ({ src, link }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);

  // calc scale on resize -----------------------------------------------------
  useEffect(() => {
    const calcScale = () => {
      const w = wrapperRef.current?.offsetWidth ?? 1920;
      setScale(w / 1920);
    };
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ paddingTop: '56.25%' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="loader" />
        </div>
      )}
      {/* transparent click-through overlay so users can open site */}
      <a
        href={link ?? src}
        target="_blank"
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
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

// ---- Page component -------------------------------------------------------
export default function Home() {
  const [bgUrl, setBgUrl] = useState('');
  const [isNarrow, setIsNarrow] = useState(false);

  // rotate background and watch width ---------------------------------------
  useEffect(() => {
    let idx = Number(sessionStorage.getItem('bgImageIndex'));
    if (isNaN(idx) || idx < 0 || idx >= imageFilenames.length) idx = 0;
    sessionStorage.setItem('bgImageIndex', ((idx + 1) % imageFilenames.length).toString());
    setBgUrl(
      `https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/images/havearbejde/${imageFilenames[idx]}`
    );

    const checkWidth = () => setIsNarrow(window.innerWidth < 800);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const mainSite = sites.find((s) => s.main)!; // Mixed Energy
  const otherSites = sites.filter((s) => !s.main);

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
        <div className="w-full max-w-6xl p-8 bg-black bg-opacity-50 rounded-lg space-y-12">

                    {/* CV ------------------------------------------------------------ */}
          <a
            href={CV_URL}
            target={isNarrow ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 px-6 py-3 bg-gray-800 rounded-full text-white font-bold hover:bg-gray-700 transition-transform"
          >
            <DocumentChartBarIcon className="h-6 w-6 mr-2" />
            Mit CV
          </a>
          {/* Mixed Energy --------------------------------------------------- */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{mainSite.title}</h2>
            <p className="text-gray-300 mb-6">{mainSite.description}</p>
            <ScaledIframe src={mainSite.src} link={mainSite.link} />
          </div>

          {/* Other projects list ------------------------------------------- */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Andre projekter</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {otherSites.map((site) => (
                <a
                  key={site.title}
                  href={site.link ?? site.src}
                  target={isNarrow ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gray-800 font-semibold transition-transform hover:bg-gray-700"
                >
                  {site.title}
                </a>
              ))}
            </div>
          </div>


        </div>
      </main>
    </>
  );
}
