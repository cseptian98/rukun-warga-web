import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  BellRing, 
  Flame, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Search, 
  Tag, 
  ChevronRight, 
  Share2, 
  Bookmark, 
  AlertCircle,
  Sparkles,
  Eye,
  Megaphone,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Infrastructure' | 'Community' | 'Security' | 'Health' | 'Important';
  summary: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  views: number;
  imageUrl: string;
  isTrending?: boolean;
  priority?: 'High' | 'Normal';
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "news-1",
    title: "Major Water Pipe Overhaul & Pressure Optimization Across RW 04",
    slug: "major-water-pipe-overhaul",
    category: "Infrastructure",
    summary: "KSM Suka Jernih engineers will begin replacement of secondary water distribution lines next Tuesday to stabilize pressure for all households in blocks A through D.",
    content: `Residents of RW 04 Kampung Melati,

Starting Tuesday next week at 09:00 WIB, the KSM Suka Jernih maintenance team will initiate an essential overhaul of the main distribution valves and secondary pipeline segments. 

This project aims to address the low-pressure issues previously reported by households situated in higher elevations across Block C and Block D. 

Key Schedule & Notice:
1. Tuesday 09:00 - 15:00 WIB: Temporary supply reduction in Block A & B.
2. Wednesday 08:00 - 16:00 WIB: Full switchover to the newly pressurized booster pumps.
3. Clean backup water storage tankers will be stationed at the RW community hall for emergency consumption.

We appreciate everyone's patience and support as we invest in higher quality and reliable municipal utilities for our neighborhood.`,
    author: "Ir. Hendra Wijaya",
    authorRole: "Head of Infrastructure & KSM",
    date: "Oct 9, 2026",
    readTime: "3 min read",
    views: 1240,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80",
    isTrending: true,
    priority: "High"
  },
  {
    id: "news-2",
    title: "Quarterly Neighborhood General Assembly & Digital SuperApp Rollout",
    slug: "quarterly-neighborhood-general-assembly",
    category: "Community",
    summary: "Join the RW leadership this Saturday for the introduction of our new citizen self-service modules including treasury transparency and digital IDs.",
    content: `Dear residents,

Our regular quarterly general assembly will take place this Saturday evening at Balai Warga RW 04 starting at 19:30 WIB.

Agenda items include:
- Financial transparency report for Q3 2026.
- Demonstration of our new Citizen SuperApp portal.
- Neighborhood watch patrol rotation changes for year-end holidays.
- Q&A session with RT leaders.

Light refreshments will be served. All heads of households or representatives are strongly encouraged to attend.`,
    author: "Pak Bambang S.",
    authorRole: "RW 04 Chairman",
    date: "Oct 8, 2026",
    readTime: "2 min read",
    views: 890,
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    isTrending: true,
    priority: "Normal"
  },
  {
    id: "news-3",
    title: "New Smart Waste Sorting & Recycling Incentives Launched",
    slug: "smart-waste-sorting-incentives",
    category: "Health",
    summary: "Organic and recyclable waste collection points are now equipped with QR drop tags, earning households discounts on monthly community dues.",
    content: `In collaboration with the environmental cleanliness unit, we are introducing a waste separation program starting this month.

Bins marked Green (Organic) and Blue (Plastic & Paper) have been positioned in each sub-cluster. Families who actively sort clean recyclables will earn community points redeemable towards local utility and dues subsidies.`,
    author: "Siti Rahmawati",
    authorRole: "Environmental Officer",
    date: "Oct 7, 2026",
    readTime: "4 min read",
    views: 654,
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    isTrending: true,
    priority: "Normal"
  },
  {
    id: "news-4",
    title: "Night Patrol (Ronda) Schedule Update for Year-End Vigilance",
    slug: "night-patrol-schedule-update",
    category: "Security",
    summary: "The neighborhood security team has released the updated rotation for October and November. Please review your designated schedule.",
    content: `To ensure ongoing safety and peaceful nights across all gangways, the security division has updated the night patrol roster. Automated WhatsApp notifications and app reminders will be dispatched 24 hours prior to each duty shift.`,
    author: "Agus Pratama",
    authorRole: "Chief of Security",
    date: "Oct 6, 2026",
    readTime: "2 min read",
    views: 430,
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    isTrending: false,
    priority: "High"
  },
  {
    id: "news-5",
    title: "Free Community Health Screening & Blood Pressure Checkup",
    slug: "free-community-health-screening",
    category: "Health",
    summary: "Posyandu Lansia and youth health volunteers will host open medical checkups this Sunday morning at the central park gazebo.",
    content: `Free health screenings including blood pressure, blood glucose, and uric acid tests will be conducted by certified healthcare volunteers from 07:00 to 11:00 WIB this Sunday. Senior citizens and families are warmly invited.`,
    author: "Dr. Anita Kusuma",
    authorRole: "Posyandu Coordinator",
    date: "Oct 5, 2026",
    readTime: "1 min read",
    views: 512,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    isTrending: false,
    priority: "Normal"
  },
  {
    id: "news-6",
    title: "Children's Creative Arts & Traditional Games Festivity",
    slug: "children-creative-arts-festival",
    category: "Community",
    summary: "Karang Taruna youth committee will organize an outdoor weekend event celebrating folklore storytelling, painting, and traditional games.",
    content: `Join us this coming Sunday afternoon for a fun day filled with traditional Indonesian street games, outdoor painting, and storytelling for all children aged 5 to 14. Registration is free via your RT youth representative.`,
    author: "Karang Taruna RW 04",
    authorRole: "Youth Association",
    date: "Oct 4, 2026",
    readTime: "3 min read",
    views: 395,
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    isTrending: false,
    priority: "Normal"
  }
];

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const categories = ["All", "Infrastructure", "Community", "Security", "Health", "Important"];

  const filteredNews = NEWS_DATA.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingNews = filteredNews.filter(n => n.isTrending);
  const mainTrending = trendingNews[0] || filteredNews[0];
  const sideTrending = trendingNews.slice(1, 3);
  
  // Recent news excludes the hero story if present
  const recentNews = filteredNews.filter(n => n.id !== mainTrending?.id);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900 relative">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-rose-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-2.5 rounded-xl shadow-md shadow-rose-200">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                  Warga<span className="text-rose-600">News</span> Portal
                </h1>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-100">
                  RW 04
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Official Announcements & Community Updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-indigo-600 hover:bg-slate-100 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Search & Category Pills */}
      <div className="bg-white border-b border-slate-200/70 pt-8 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-rose-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Citizen Information Broadcast
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Neighborhood Bulletin & News
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Stay up to date with official announcements, infrastructure work, and community schedules.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search headlines or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main News Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: TRENDING NEWS (Big Content / Hero Showcase)    */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
              Trending Stories
            </h3>
            <span className="text-xs text-slate-400 font-semibold ml-auto">
              Featured Highlights
            </span>
          </div>

          {mainTrending ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Headline Hero Card (8 cols) */}
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveArticle(mainTrending)}
                className="lg:col-span-8 group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video sm:aspect-21/9 lg:aspect-16/9 overflow-hidden bg-slate-900">
                  <img
                    src={mainTrending.imageUrl}
                    alt={mainTrending.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Trending Hero
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                      {mainTrending.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {mainTrending.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mainTrending.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {mainTrending.views} reads
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight mb-3">
                      {mainTrending.title}
                    </h4>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {mainTrending.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {mainTrending.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{mainTrending.author}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{mainTrending.authorRole}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                      Read Full Story &rarr;
                    </span>
                  </div>
                </div>
              </motion.article>

              {/* Secondary Trending Cards (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {sideTrending.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * (idx + 1) }}
                    onClick={() => setActiveArticle(item)}
                    className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300 flex flex-col flex-1"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-1.5">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.author}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-sm">No trending stories matching your search filter.</p>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: RECENT NEWS (List of Updated News)             */}
        {/* ========================================================= */}
        <section className="pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                Recent Neighborhood Updates
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {recentNews.length} articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setActiveArticle(item)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    {item.priority === 'High' && (
                      <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Notice
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {item.author.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">
                        {item.author}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {recentNews.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-sm">No recent news found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      {/* Article Detail Modal / Reader */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Top Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {activeArticle.category}
                    </span>
                    {activeArticle.isTrending && (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Trending
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black leading-tight">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                      {activeArticle.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{activeArticle.author}</p>
                      <p className="text-slate-400 text-[11px]">{activeArticle.authorRole}</p>
                    </div>
                  </div>

                  <div className="text-right text-slate-400 text-[11px]">
                    <p>{activeArticle.date}</p>
                    <p>{activeArticle.readTime}</p>
                  </div>
                </div>

                <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100 text-rose-900 text-sm font-semibold leading-relaxed">
                  {activeArticle.summary}
                </div>

                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal space-y-4">
                  {activeArticle.content}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Published for all RW 04 Residents
                </span>
                <Button 
                  onClick={() => setActiveArticle(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs px-5"
                >
                  Close Bulletin
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 p-6 text-center text-xs font-semibold uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>RW 04 Kampung Melati SuperApp &bull; Information Broadcast System</p>
          <p className="text-slate-500">Live Community Updates &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
