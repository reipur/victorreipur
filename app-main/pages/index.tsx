// pages/index.tsx
'use client';
import { useState } from 'react';
import Head from 'next/head';
import { DocumentChartBarIcon } from '@heroicons/react/24/solid';

const CV_URL =
  'https://supabase.victorreipur.dk/storage/v1/object/public/public-bucket/Victor_Reipur_CV.pdf';

const messages = [
  {
    title: 'Siden Er Under Opbygning',
    text: 'Velkommen til victorreipur.dk. Kontakt mig på victor@reipur.dk.',
    button: 'Show in English',
    cvLabel: 'Mit CV (PDF)',
  },
  {
    title: 'Site Under Construction',
    text: 'Welcome to victorreipur.dk. For inquiries, email me at victor@reipur.dk.',
    button: 'Vis på dansk',
    cvLabel: 'My CV (PDF)',
  },
];

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleSwitch = () => {
    setAnimating(true);
    setTimeout(() => {
      setIdx((i) => (i + 1) % messages.length);
      setAnimating(false);
    }, 300);
  };

  const { title, text, button, cvLabel } = messages[idx];

  return (
    <>
      <Head>
        <title>victorreipur.dk | Under Construction</title>
      </Head>

      <main className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
        {/* CV BUTTON */}
        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-8 flex flex-col items-center text-primary hover:text-secondary transition"
        >
          <DocumentChartBarIcon className="h-24 w-24" aria-hidden="true" />
          <span className="mt-2 font-medium">{cvLabel}</span>
        </a>

        {/* UNDER CONSTRUCTION BOX */}
        <div
          className={`
            max-w-xl space-y-6 rounded-xl bg-white p-8 shadow-lg
            transition-all duration-300
            ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          `}
        >
          <h1 className="text-xl font-medium uppercase text-gray-500 tracking-widest">
            {title}
          </h1>
          <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
            {text}
          </p>
          <button
            onClick={handleSwitch}
            className="mt-4 inline-block rounded-full border border-primary px-5 py-2 text-primary font-medium hover:bg-primary hover:text-white transition"
          >
            {button}
          </button>
        </div>
      </main>
    </>
  );
}
