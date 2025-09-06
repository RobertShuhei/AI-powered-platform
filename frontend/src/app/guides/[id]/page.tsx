"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Guide {
  id: string;
  email?: string;
  created_at?: string;
  name_romanized?: string;
  bio?: string;
  specialties?: string;
  rating?: number;
  languages?: string;
  areas?: string;
  price_range?: string;
}

export default function GuideDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/guides/${id}`);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const data: Guide = await res.json();
        setGuide(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load guide');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="w-full px-4 sm:px-6 py-4 bg-white border-b border-warm-200/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-terracotta-600 font-semibold hover:text-terracotta-700">← Home</Link>
          <button onClick={() => router.back()} className="text-charcoal-600 hover:text-charcoal-800 text-sm">Back</button>
        </div>
      </header>

      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-6 w-6 text-terracotta-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span className="ml-3 text-charcoal-700">Loading guide...</span>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-xl mx-auto p-4 rounded-xl border border-warm-300 bg-warm-50 text-charcoal-800">
              Failed to load guide: {error}
            </div>
          )}

          {!loading && !error && guide && (
            <div className="bg-white rounded-3xl shadow-soft border border-warm-200/60 overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-terracotta-500/20 to-sage-500/20" />
              <div className="p-6 sm:p-10">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-charcoal-900">{guide.name_romanized || 'Guide'}</h1>
                  <div className="flex items-center text-warm-700 font-semibold">
                    <svg className="w-5 h-5 mr-1 text-warm-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {guide.rating?.toFixed(1) ?? '—'}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal-700 mb-2">Bio</h2>
                    <p className="text-charcoal-700 leading-relaxed whitespace-pre-wrap">{guide.bio || '—'}</p>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal-700 mb-2">Details</h2>
                    <ul className="text-charcoal-700 space-y-2">
                      <li><span className="font-semibold">Areas:</span> {guide.areas || '—'}</li>
                      <li><span className="font-semibold">Languages:</span> {guide.languages || '—'}</li>
                      <li><span className="font-semibold">Specialties:</span> {guide.specialties || '—'}</li>
                      <li><span className="font-semibold">Price Range:</span> {guide.price_range || '—'}</li>
                      {guide.email && (
                        <li><span className="font-semibold">Email:</span> {guide.email}</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="bg-terracotta-500 text-cream-50 px-6 py-3 rounded-xl font-semibold hover:bg-terracotta-600 transition">Message Guide</button>
                  <button className="border-2 border-sage-600 text-sage-700 px-6 py-3 rounded-xl font-semibold hover:bg-sage-50 transition">Book Now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

