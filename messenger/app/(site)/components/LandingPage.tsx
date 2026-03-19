"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Real-time Messaging",
    description: "Send and receive messages instantly with live typing indicators and read receipts."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Group Chats",
    description: "Create groups with friends, family, or colleagues. Stay connected with everyone that matters."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Private",
    description: "Your conversations are protected with industry-standard encryption and secure authentication."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Share Images",
    description: "Share photos and images seamlessly. View shared media in beautiful full-screen galleries."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
    title: "Online Presence",
    description: "See who's online in real-time. Know when your friends are available to chat."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Works Everywhere",
    description: "Access Varta from any device. Responsive design that works perfectly on desktop and mobile."
  }
];

const stats = [
  { value: 100, suffix: "%", label: "Free Forever" },
  { value: 24, suffix: "/7", label: "Available" },
  { value: 99, suffix: "%", label: "Uptime" },
  { value: 256, suffix: "-bit", label: "Encryption" }
];

// Custom hook for intersection observer
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Animated counter component
function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// Floating chat bubble component
function FloatingChatBubble({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <div
      className={`absolute opacity-20 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl rounded-tl-none animate-chat-bubble" />
    </div>
  );
}

// Particle component
function Particle({ className, size = 8 }: { className: string; size?: number }) {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 animate-particle ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 50;
    const y = (e.clientY - rect.top - rect.height / 2) / 50;
    setMousePosition({ x, y });
  }, []);

  // Intersection observers for sections
  const heroInView = useInView();
  const statsInView = useInView();
  const featuresInView = useInView();
  const howItWorksInView = useInView();
  const ctaInView = useInView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        {/* Floating chat bubbles */}
        <FloatingChatBubble className="top-1/4 left-[10%]" delay={0} />
        <FloatingChatBubble className="top-1/3 right-[15%]" delay={1.5} />
        <FloatingChatBubble className="bottom-1/4 left-[20%]" delay={3} />

        {/* Floating particles */}
        <Particle className="top-[20%] left-[30%]" size={12} />
        <Particle className="top-[60%] right-[25%]" size={8} />
        <Particle className="top-[40%] left-[60%]" size={10} />
        <Particle className="bottom-[30%] right-[40%]" size={6} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg shadow-indigo-500/5" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <Image
                src="/images/Logoo.png"
                alt="Varta Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Varta
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/auth"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/auth?variant=REGISTER"
                className="text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 btn-hover-lift"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div
            ref={heroInView.ref}
            className="text-center max-w-4xl mx-auto"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6 sm:mb-8 transition-all duration-700 ${heroInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-indigo-700">Live & Free to Use</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight transition-all duration-700 delay-100 ${heroInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                transform: heroInView.isInView
                  ? `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                  : undefined
              }}
            >
              Connect Instantly with{" "}
              <span className="gradient-text-animated">
                Varta
              </span>
            </h1>

            <p
              className={`mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${heroInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Experience seamless real-time messaging. Share moments, create groups, and stay connected with the people who matter most.
            </p>

            <div
              className={`mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${heroInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Link
                href="/auth?variant=REGISTER"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10">Start Chatting Free</span>
                <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="#features"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/80 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                Learn More
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Chat Preview Mockup with parallax */}
          <div
            className={`mt-16 sm:mt-20 relative max-w-4xl mx-auto transition-all duration-1000 delay-500 ${heroInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            style={{
              transform: heroInView.isInView
                ? `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
                : undefined
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-20 transform scale-105 animate-pulse-glow" />
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transition-shadow duration-300 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.3)]">
              {/* Mock Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <span className="text-white font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">John Doe</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              {/* Mock Chat Messages with staggered animation */}
              <div className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white min-h-[280px] sm:min-h-[320px]">
                <div className={`flex justify-start transition-all duration-500 ${heroInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '600ms' }}>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%] border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <p className="text-gray-800">Hey! Have you tried Varta yet? It&apos;s amazing!</p>
                    <span className="text-xs text-gray-400 mt-1 block">10:30 AM</span>
                  </div>
                </div>
                <div className={`flex justify-end transition-all duration-500 ${heroInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '800ms' }}>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%] hover:shadow-lg transition-shadow duration-300">
                    <p className="text-white">Yes! The real-time messaging is so smooth</p>
                    <span className="text-xs text-white/70 mt-1 block">10:31 AM</span>
                  </div>
                </div>
                <div className={`flex justify-start transition-all duration-500 ${heroInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '1000ms' }}>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%] border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <p className="text-gray-800">I love the group chat feature too!</p>
                    <span className="text-xs text-gray-400 mt-1 block">10:32 AM</span>
                  </div>
                </div>
                <div className={`flex justify-end transition-all duration-500 ${heroInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '1200ms' }}>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%] hover:shadow-lg transition-shadow duration-300">
                    <p className="text-white">Let&apos;s create one for our team!</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-white/70">10:33 AM</span>
                      <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className={`flex justify-start transition-all duration-500 ${heroInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '1400ms' }}>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Input */}
              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-white flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-gray-400 text-sm">
                  Type a message...
                </div>
                <button className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with animated counters */}
      <section
        ref={statsInView.ref}
        className="py-12 sm:py-16 border-y border-gray-100 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${statsInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm sm:text-base text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            ref={featuresInView.ref}
            className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${featuresInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Everything You Need to{" "}
              <span className="gradient-text-animated">
                Stay Connected
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 text-lg text-gray-600">
              Varta comes packed with features designed to make your conversations seamless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 card-hover transition-all duration-700 ${featuresInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl animate-float-delayed" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div
            ref={howItWorksInView.ref}
            className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${howItWorksInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Get Started in{" "}
              <span className="gradient-text-animated">
                3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up with your email or use Google/GitHub for instant access.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Find Friends",
                description: "Search and connect with people you know or invite new friends.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Start Chatting",
                description: "Send messages, share images, and create groups instantly.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`relative text-center group transition-all duration-700 ${howItWorksInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse opacity-50 blur-md" />
                  <span className="relative">{item.step}</span>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%]">
                    <div className="border-t-2 border-dashed border-indigo-200 relative">
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full transition-all duration-500 ${howItWorksInView.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} style={{ transitionDelay: `${(index + 1) * 300}ms` }} />
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div
          ref={ctaInView.ref}
          className={`max-w-4xl mx-auto transition-all duration-1000 ${ctaInView.isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
        >
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            {/* Animated shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-12 animate-float-slow" />
            <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-float" />
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-float-delayed" />

            <div className="relative px-6 sm:px-12 py-12 sm:py-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Ready to Start Chatting?
              </h2>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                Join thousands of users who are already enjoying seamless communication with Varta.
              </p>
              <Link
                href="/auth?variant=REGISTER"
                className="group mt-8 inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Create Free Account
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 group">
              <Image
                src="/images/Logoo.png"
                alt="Varta Logo"
                width={32}
                height={32}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              <span className="text-xl font-bold text-gray-900">Varta</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">
                Terms of Service
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Varta. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
