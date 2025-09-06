"use client";

import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { useI18n } from '@/lib/i18n';

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

export default function Home() {
  const { t } = useI18n();
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState<number | ''>('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async (opts?: { destination?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (opts?.destination) {
        params.set('areas', opts.destination);
      }
      const url = `http://localhost:5000/api/guides${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: Guide[] = await res.json();
      setGuides(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchGuides({ destination });
  };
  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-warm-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-sage-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-charcoal-900 hidden sm:block">AI Tour Guide Matcher</span>
            <span className="text-xl font-bold text-charcoal-900 sm:hidden">ATGM</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#destinations" className="text-charcoal-700 hover:text-terracotta-600 font-medium transition-colors">Destinations</a>
            <a href="#guides" className="text-charcoal-700 hover:text-terracotta-600 font-medium transition-colors">Local Guides</a>
            <a href="#how-it-works" className="text-charcoal-700 hover:text-terracotta-600 font-medium transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="bg-terracotta-500 text-cream-50 px-6 py-2.5 rounded-full font-semibold hover:bg-terracotta-600 transition-all duration-200 shadow-md hover:shadow-lg">
              {t('navigation.sign_in')}
            </Link>
            <button className="md:hidden p-2 text-charcoal-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-br from-warm-100 via-cream-100 to-sage-100">

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 mb-6 leading-tight">
              Discover the World Through 
              <span className="text-terracotta-600 block">Local Eyes</span>
            </h1>
            <p className="text-xl sm:text-2xl text-charcoal-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect with passionate local guides who'll transform your travels into unforgettable, authentic experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-warm-200/50">
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('homepage.destination_placeholder')}</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={t('homepage.destination_placeholder')}
                      className="w-full pl-10 pr-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-colors"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('homepage.dates_placeholder')}</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={t('homepage.dates_placeholder')}
                      className="w-full pl-10 pr-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-colors"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('homepage.travelers_placeholder')}</label>
                  <input
                    type="number"
                    min={1}
                    placeholder={t('homepage.travelers_placeholder')}
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-colors"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal-600">Tip: Try cities like Tokyo, Barcelona, or Marrakech</p>
                <button
                  type="submit"
                  className="bg-terracotta-500 text-cream-50 px-6 py-3 rounded-xl font-semibold hover:bg-terracotta-600 transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      {t('homepage.search_button')}
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button className="flex-1 bg-sage-600 text-cream-50 px-8 py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Browse Destinations
            </button>
            <button className="flex-1 bg-transparent border-2 border-terracotta-500 text-terracotta-600 px-8 py-4 rounded-xl font-semibold hover:bg-terracotta-500 hover:text-cream-50 transition-all duration-200">
              Become a Guide
            </button>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="px-4 sm:px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900">{t('homepage.featured_guides_title')}</h2>
            {guides?.length > 0 && (
              <span className="text-charcoal-600 text-sm">{guides.length} guides found</span>
            )}
          </div>
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-warm-300 bg-warm-50 text-charcoal-800">
              Failed to load guides: {error}
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-6 w-6 text-terracotta-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span className="ml-3 text-charcoal-700">Loading guides...</span>
            </div>
          )}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((g) => (
                <div key={g.id} className="bg-white rounded-2xl shadow-soft border border-warm-200/60 overflow-hidden">
                  <div className="h-28 bg-gradient-to-r from-terracotta-500/20 to-sage-500/20" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-charcoal-900">{g.name_romanized || 'Guide'}</h3>
                      <div className="flex items-center text-warm-600 font-semibold">
                        <svg className="w-4 h-4 mr-1 text-warm-500" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {g.rating?.toFixed(1) ?? '—'}
                      </div>
                    </div>
                    <p className="text-sm text-charcoal-600 mb-3 max-h-16 overflow-hidden">{g.bio || 'No bio provided.'}</p>
                    <div className="text-sm text-charcoal-700 mb-4">
                      <span className="font-semibold">Areas:</span> {g.areas || '—'}
                    </div>
                    <Link href={`/guides/${g.id}`} className="text-terracotta-600 font-semibold hover:text-terracotta-700">View Profile →</Link>
                  </div>
                </div>
              ))}
              {guides.length === 0 && !loading && !error && (
                <div className="col-span-full text-center text-charcoal-600">No guides found. Try a different destination.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-6">
              Why Travelers Love Our Platform
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of cutting-edge AI technology and authentic human connection
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Smart Matching */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-100 to-terracotta-200 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-md">
                <svg className="w-10 h-10 text-terracotta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Smart Matching</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Our AI algorithm perfectly matches you with local guides based on your interests, travel style, and preferences
              </p>
            </div>

            {/* Verified Guides */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-md">
                <svg className="w-10 h-10 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Verified Guides</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Every guide goes through comprehensive verification including background checks and local expertise validation
              </p>
            </div>

            {/* Authentic Experiences */}
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-br from-warm-200 to-warm-300 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-200 shadow-md">
                <svg className="w-10 h-10 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Authentic Experiences</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Skip the tourist traps and discover hidden gems, local traditions, and authentic cultural experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Destinations */}
      <section id="destinations" className="px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-br from-cream-50 to-warm-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-6">
              Spotlight Destinations
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Explore these incredible destinations with passionate local guides who know every hidden corner
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tokyo */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-terracotta-400 to-terracotta-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium opacity-90">Japan</div>
                  <div className="text-2xl font-bold">Tokyo</div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-charcoal-800">
                  42 Guides
                </div>
              </div>
              <div className="p-6">
                <p className="text-charcoal-600 mb-4">Ancient temples meet neon streets in this vibrant metropolis where tradition and innovation dance together.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-terracotta-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-sage-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-warm-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-charcoal-500">4.9 rating</span>
                  </div>
                  <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">Explore →</button>
                </div>
              </div>
            </div>

            {/* Barcelona */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-sage-400 to-sage-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium opacity-90">Spain</div>
                  <div className="text-2xl font-bold">Barcelona</div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-charcoal-800">
                  28 Guides
                </div>
              </div>
              <div className="p-6">
                <p className="text-charcoal-600 mb-4">Gaudi's architectural wonders, vibrant markets, and Mediterranean charm create an unforgettable cultural tapestry.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-sage-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-terracotta-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-warm-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-charcoal-500">4.8 rating</span>
                  </div>
                  <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">Explore →</button>
                </div>
              </div>
            </div>

            {/* Marrakech */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
              <div className="h-64 bg-gradient-to-br from-warm-500 to-warm-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium opacity-90">Morocco</div>
                  <div className="text-2xl font-bold">Marrakech</div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-charcoal-800">
                  35 Guides
                </div>
              </div>
              <div className="p-6">
                <p className="text-charcoal-600 mb-4">Lose yourself in bustling souks, stunning palaces, and the magic of the medina in this imperial city.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-warm-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-terracotta-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-sage-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-charcoal-500">4.9 rating</span>
                  </div>
                  <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">Explore →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-terracotta-500 text-cream-50 px-8 py-4 rounded-xl font-semibold hover:bg-terracotta-600 transition-all duration-200 shadow-md hover:shadow-lg">
              View All Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Meet Your Local Guides */}
      <section id="guides" className="px-4 sm:px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-6">
              Meet Your Local Guides
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Passionate locals who are eager to share their city's secrets and create unforgettable memories with you
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Guide 1 */}
            <div className="bg-cream-50 rounded-3xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-cream-50">M</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">Maria Santos</h3>
              <p className="text-terracotta-600 font-semibold mb-3">Barcelona, Spain</p>
              <div className="flex justify-center items-center mb-3">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-warm-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-600 ml-2">(127 reviews)</span>
              </div>
              <p className="text-sm text-charcoal-600 mb-4">Certified art historian specializing in Gaudi architecture and local tapas culture</p>
              <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">View Profile →</button>
            </div>

            {/* Guide 2 */}
            <div className="bg-cream-50 rounded-3xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-cream-50">K</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">Kenji Tanaka</h3>
              <p className="text-terracotta-600 font-semibold mb-3">Tokyo, Japan</p>
              <div className="flex justify-center items-center mb-3">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-warm-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-600 ml-2">(98 reviews)</span>
              </div>
              <p className="text-sm text-charcoal-600 mb-4">Former chef who knows the best hidden ramen spots and traditional temples</p>
              <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">View Profile →</button>
            </div>

            {/* Guide 3 */}
            <div className="bg-cream-50 rounded-3xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-warm-400 to-warm-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-cream-50">Y</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">Youssef El-Fassi</h3>
              <p className="text-terracotta-600 font-semibold mb-3">Marrakech, Morocco</p>
              <div className="flex justify-center items-center mb-3">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-warm-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-600 ml-2">(156 reviews)</span>
              </div>
              <p className="text-sm text-charcoal-600 mb-4">Third-generation souk merchant with deep knowledge of Berber culture</p>
              <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">View Profile →</button>
            </div>

            {/* Guide 4 */}
            <div className="bg-cream-50 rounded-3xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-500 to-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-cream-50">L</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-2">Lucia Rossi</h3>
              <p className="text-terracotta-600 font-semibold mb-3">Florence, Italy</p>
              <div className="flex justify-center items-center mb-3">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-warm-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-600 ml-2">(203 reviews)</span>
              </div>
              <p className="text-sm text-charcoal-600 mb-4">Renaissance art expert and wine enthusiast with family vineyard connections</p>
              <button className="text-terracotta-600 font-semibold hover:text-terracotta-700">View Profile →</button>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-sage-600 text-cream-50 px-8 py-4 rounded-xl font-semibold hover:bg-sage-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Browse All Guides
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-sage-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">AI Tour Guide Matcher</span>
              </div>
              <p className="text-cream-300 leading-relaxed mb-6">
                Connecting travelers with passionate local guides for authentic, unforgettable experiences around the world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Travelers</h4>
              <ul className="space-y-3 text-cream-300">
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Find Guides</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Guides</h4>
              <ul className="space-y-3 text-cream-300">
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Become a Guide</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Guide Resources</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Earnings</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-cream-300">
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-terracotta-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-charcoal-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-cream-400 text-sm">
              © 2024 AI Tour Guide Matcher. Crafted for authentic travel experiences.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-cream-400 hover:text-terracotta-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-cream-400 hover:text-terracotta-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-cream-400 hover:text-terracotta-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
