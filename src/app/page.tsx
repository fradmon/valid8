"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  Instagram,
  Globe,
  ArrowRight,
  X,
  Zap,
  Shuffle,
  Mail,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const randomIdeas = [
  "An app that tracks coffee consumption and suggests optimal caffeine timing",
  "Marketplace for local artisan sourdough bread delivery",
  "AI-powered fitness coach that adapts to your daily mood",
  "Subscription box for curated vintage vinyl records",
  "Smart grocery list that predicts what you'll need next week",
  "Neighborhood tool-sharing platform with instant pickup",
  "On-demand personal chef matching for home dinners",
  "Gamified habit tracker that pays you real rewards",
  "AI that turns voice notes into structured documents",
  "Sustainable fashion rental for special occasions",
  "Pet wellness tracker with 24/7 vet telemedicine",
  "Micro-learning language app with AI conversation partner",
  "Remote team bonding games for distributed companies",
  "Carbon footprint tracker linked to your bank account",
  "Personalized meditation app that reads your biometrics",
  "Virtual interior designer using your phone camera",
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Helper to detect device type from user agent
  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  };

  // Helper to detect browser
  const getBrowser = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Other';
  };

  // Track events to Supabase
  const trackEvent = async (eventType: string) => {
    try {
      await supabase.from('analytics').insert([{
        event_type: eventType,
        device_type: getDeviceType(),
        browser: getBrowser(),
        screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
        screen_height: typeof window !== 'undefined' ? window.innerHeight : null,
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      }]);
    } catch {
      // Silently fail - don't interrupt user experience for analytics
    }
  };

  const handleGenerate = () => {
    if (!idea) return;
    setShowModal(true);
  };

  const handleRandomIdea = () => {
    setIsShuffling(true);
    trackEvent('random_idea_click'); // Track the click!
    
    // Shuffle through a few ideas for visual effect
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * randomIdeas.length);
      setIdea(randomIdeas[randomIndex]);
      count++;
      if (count >= 6) {
        clearInterval(interval);
        setIsShuffling(false);
        // Show modal after shuffle completes
        setTimeout(() => setShowModal(true), 300);
      }
    }, 80);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, idea }]);

      if (error) {
        if (error.code === '23505') {
          setSubmitError("You're already on the waitlist!");
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
        return;
      }

      trackEvent('waitlist_signup'); // Track successful signup!
      setIsSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#050505] text-white selection:bg-white/20 px-4 py-6 md:p-12 font-sans flex flex-col overflow-hidden relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">V</span>
          </div>
          <span className="font-bold text-xl tracking-tight">valid8</span>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScTFSPF5aTDuokgFeSQMsI4CKHvvb-X-EKO0DT31UviEYSDtg/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
        >
          Join Waitlist →
        </a>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full text-center relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6 md:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs md:text-sm text-zinc-400">Now in private beta</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6 leading-[1.1]">
            <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
              Validate your idea
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              in seconds.
            </span>
          </h1>
          <p className="text-base md:text-xl text-zinc-500 max-w-xl mx-auto px-2">
            Describe your concept. We generate the entire validation kit — ads, branding, landing pages, and copy.
          </p>
        </motion.div>

        {/* Input Field - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl px-2"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
            <div className="relative bg-zinc-900/80 backdrop-blur border border-white/10 rounded-xl md:rounded-2xl p-2 shadow-2xl">
              {/* Mobile: Stacked layout, Desktop: Inline */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="Describe your idea..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 md:py-4 text-base md:text-lg placeholder:text-zinc-600 w-full"
                  autoFocus
                />
                <button
                  onClick={handleGenerate}
                  disabled={!idea}
                  className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>Generate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Try a Random Idea Button */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <button
              id="random-idea-btn"
              onClick={handleRandomIdea}
              disabled={isShuffling}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden
                bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500
                hover:from-purple-500 hover:via-pink-400 hover:to-orange-400
                text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-xl
                hover:scale-[1.03] active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {/* Glossy shine effect */}
              <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent opacity-100" />
              {/* Animated shimmer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              {/* Top highlight */}
              <span className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              <Sparkles className={`w-4 h-4 relative z-10 transition-all duration-300 ${isShuffling ? 'animate-pulse' : 'group-hover:rotate-12 group-hover:scale-110'}`} />
              <span className="relative z-10">{isShuffling ? 'Finding your idea...' : 'Try a Random Idea'}</span>
              <ArrowRight className={`w-4 h-4 relative z-10 transition-all duration-300 ${isShuffling ? 'opacity-0' : 'group-hover:translate-x-1'}`} />
            </button>
          </motion.div>

          {/* Feature pills */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm text-zinc-600">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" /> AI-Powered
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <Play className="w-3 h-3" /> Sora Video
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <Instagram className="w-3 h-3" /> Social Ready
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <Globe className="w-3 h-3" /> Landing Page
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-600 mt-auto relative z-10">
        <p>© 2024 Valid8. All rights reserved. <span className="text-zinc-700">v3</span></p>
      </footer>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 flex items-center justify-center"
            >
              <div className="w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                    {isSubmitted ? (
                      <Check className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                    ) : (
                      <Zap className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                    )}
                  </div>

                  {isSubmitted ? (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                        You're on the list!
                      </h2>
                      <p className="text-zinc-400 text-sm md:text-base mb-6 max-w-sm mx-auto">
                        Thanks for joining. We'll reach out soon with your exclusive early access.
                      </p>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-zinc-500 mb-1">Your idea</p>
                        <p className="text-sm text-zinc-300">{idea}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                        We're in Private Beta
                      </h2>
                      <p className="text-zinc-400 text-sm md:text-base mb-2 max-w-sm mx-auto">
                        Valid8 is currently available to a limited number of early adopters.
                      </p>

                      {/* Show the idea */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
                        <p className="text-xs text-zinc-500 mb-1">Your idea</p>
                        <p className="text-sm text-zinc-300">{idea}</p>
                      </div>

                      {/* Email Input Form */}
                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 outline-none transition-colors"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        {submitError && (
                          <p className="text-red-400 text-sm">{submitError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Joining...</span>
                            </>
                          ) : (
                            <>
                              <span>Join the Waitlist</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      <p className="text-xs text-zinc-600 mt-4">
                        We'll notify you when your spot is ready.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
