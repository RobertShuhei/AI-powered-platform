'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        const accessToken = data.access_token;
        console.log('JWT Access Token:', accessToken);
        alert('Login successful!');
        // Clear form on success
        setFormData({ email: '', password: '' });
      } else if (response.status === 401) {
        alert('Invalid email or password');
      } else {
        // Handle other HTTP error statuses
        alert('Invalid email or password');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Login error:', error);
      alert('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Travel Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-sage-600">
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full text-cream-50 p-12 xl:p-16">
          <div className="max-w-lg text-center">
            <div className="w-28 h-28 bg-cream-50/10 rounded-3xl flex items-center justify-center mb-10 mx-auto backdrop-blur-sm border border-cream-50/20 shadow-xl">
              <svg className="w-14 h-14 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">Your Adventure Awaits</h2>
            <p className="text-xl xl:text-2xl opacity-90 leading-relaxed mb-12">
              Join thousands of travelers discovering authentic experiences through passionate local guides
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold mb-2">850+</div>
                <div className="text-sm xl:text-base opacity-80 font-medium">Expert Guides</div>
              </div>
              <div className="text-center border-l border-r border-cream-50/25">
                <div className="text-3xl xl:text-4xl font-bold mb-2">25K+</div>
                <div className="text-sm xl:text-base opacity-80 font-medium">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold mb-2">4.9</div>
                <div className="text-sm xl:text-base opacity-80 font-medium">Avg Rating</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-cream-50/10 rounded-2xl backdrop-blur-sm border border-cream-50/20">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-5 h-5 text-warm-200 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-base italic opacity-90 mb-4">"Maria showed us Barcelona like no guidebook ever could. Hidden tapas bars, local artists, and stories that made the city come alive!"</p>
              <p className="text-sm font-semibold opacity-75">- Sarah & Tom, Toronto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16 bg-cream-50">
        <div className="mx-auto w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center space-x-3 mb-10 group">
              <div className="w-14 h-14 bg-gradient-to-br from-terracotta-500 to-sage-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <svg className="w-8 h-8 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">AI Tour Guide</span>
            </Link>
            
            <h1 className="text-3xl xl:text-4xl font-bold text-charcoal-900 mb-4">Welcome Back, Explorer</h1>
            <p className="text-charcoal-600 text-lg xl:text-xl">Sign in to continue your journey and discover amazing experiences.</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 xl:p-10 border border-warm-200/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-charcoal-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-warm-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 bg-cream-50 focus:bg-white text-charcoal-900 placeholder-charcoal-400 font-medium"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-warm-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 bg-cream-50 focus:bg-white text-charcoal-900 placeholder-charcoal-400 font-medium"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-warm-300 text-terracotta-600 focus:ring-terracotta-500 focus:ring-offset-0"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-charcoal-700 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-cream-50 font-semibold py-4 px-6 rounded-xl hover:from-terracotta-600 hover:to-terracotta-700 focus:ring-4 focus:ring-terracotta-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-cream-50"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warm-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-charcoal-500 font-medium">New to our community?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link href="/register" className="inline-flex items-center justify-center w-full py-3 px-6 border-2 border-sage-500 text-sage-600 font-semibold rounded-xl hover:bg-sage-50 hover:border-sage-600 transition-all duration-200 group">
                  {t('navigation.create_account')}
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>
              </div>
            </form>
          </div>

          {/* Mobile Back Link */}
          <div className="lg:hidden mt-8 text-center">
            <Link href="/" className="text-terracotta-600 hover:text-terracotta-700 font-semibold text-sm inline-flex items-center group">
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
