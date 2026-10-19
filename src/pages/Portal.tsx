import React from 'react';
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Droplets, ShieldCheck, Users, Wallet, BellRing, Settings } from "lucide-react";

export default function Portal() {
  const features = [
    {
      title: "Water System",
      description: "Manage KSM Suka Jernih water usage, billing, and neighbor directories.",
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      link: "/water-system",
      color: "from-blue-500/20 to-blue-600/10",
      active: true,
    },
    {
      title: "Security & Patrol",
      description: "Monitor neighborhood watch schedules and security logs.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      link: "#",
      color: "from-emerald-500/20 to-emerald-600/10",
      active: false,
    },
    {
      title: "Resident Directory",
      description: "Complete database of RW residents and contact information.",
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      link: "/residents",
      color: "from-indigo-500/20 to-indigo-600/10",
      active: true,
    },
    {
      title: "Treasury & Dues",
      description: "Track monthly RW dues, expenditures, and financial reports.",
      icon: <Wallet className="w-8 h-8 text-amber-500" />,
      link: "/treasury",
      color: "from-amber-500/20 to-amber-600/10",
      active: true,
    },
    {
      title: "Announcements & News",
      description: "Broadcast important messages, news, and community schedules.",
      icon: <BellRing className="w-8 h-8 text-rose-500" />,
      link: "/announcements",
      color: "from-rose-500/20 to-rose-600/10",
      active: true,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="pt-12 pb-6 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight"
          >
            Kampung Melati Super<span className="text-indigo-600">App</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 mt-3 font-medium text-lg max-w-2xl mx-auto"
          >
            Centralized management portal for Citizens Association services.
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 relative z-10 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link 
                to={feature.link}
                className={`block h-full group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${!feature.active && "opacity-60 cursor-not-allowed hover:shadow-sm"}`}
                onClick={(e) => !feature.active && e.preventDefault()}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    {feature.active ? (
                      <span className="inline-flex items-center text-sm font-bold text-indigo-600">
                        Open Portal &rarr;
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs font-bold uppercase tracking-widest relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Settings className="w-4 h-4 animate-spin-slow" />
          <span>System Version 2.0 &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
