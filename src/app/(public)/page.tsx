import Link from 'next/link';
import Image from 'next/image';
import { getCmsSettings } from '@/actions/cms';
import { getFeaturedProjects } from '@/actions/projects';
import { Truck, ShieldCheck, Award, MessageSquare, Star, ArrowRight, Activity, Calendar, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PublicHomePage() {
  let settings;
  let featuredProjects = [];

  try {
    settings = await getCmsSettings();
  } catch {
    settings = {
      heroTagline: "Powering Pakistan's Largest Construction Projects",
      aboutContent: "RMK is a leading heavy machinery company specializing in excavation and large-scale construction projects.",
      homeStats: { excavators: '30+', projects: '20+', companies: '3+', experience: '10+' },
      testimonials: [
        { name: 'Ahmad Khan', role: 'Project Director', company: 'DHA Lahore', content: 'RMK delivered exceptional excavation work on our residential project. Their machinery fleet and team professionalism is unmatched in Pakistan.', rating: 5 },
        { name: 'Sara Ahmed', role: 'Site Engineer', company: 'Bahria Town', content: 'We have been working with RMK for 3 years. Their excavators are always in perfect condition and their operators are highly skilled.', rating: 5 },
        { name: 'Usman Ali', role: 'Construction Manager', company: 'NHA Pakistan', content: 'RMK handled our highway foundation work flawlessly. Delivered on time, on budget. Highly recommended for large-scale projects.', rating: 5 },
      ]
    };
  }

  try {
    featuredProjects = await getFeaturedProjects();
  } catch {
    featuredProjects = [];
  }

  // Mocks if DB returns empty featured projects list
  if (featuredProjects.length === 0) {
    featuredProjects = [
      {
        _id: 'mock1',
        title: 'Karakoram Highway Phase II Excavation',
        location: 'KPK, Pakistan',
        timeline: '2023 - 2025',
        status: 'ongoing',
        images: ['https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=80'],
      },
      {
        _id: 'mock2',
        title: 'DHA Phase 9 Foundation Civil Work',
        location: 'Lahore, Pakistan',
        timeline: '2022 - 2023',
        status: 'completed',
        images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80'],
      },
      {
        _id: 'mock3',
        title: 'Bahria Town Heights Site Grading',
        location: 'Karachi, Pakistan',
        timeline: '2024',
        status: 'ongoing',
        images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'],
      }
    ];
  }

  const statItems = [
    { value: settings.homeStats?.excavators || '30+', label: 'Excavator Fleet', icon: Truck },
    { value: settings.homeStats?.projects || '20+', label: 'Completed Projects', icon: ShieldCheck },
    { value: settings.homeStats?.companies || '3+', label: 'Partner Companies', icon: Award },
    { value: settings.homeStats?.experience || '10+', label: 'Years Experience', icon: Activity },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero grid-overlay py-20">
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-amber/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-8 animate-fade-in-up">
            <span className="badge badge-amber text-xs py-1.5 px-4 font-bold tracking-widest">
              ⚡ Infrastructure Partners
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white">
              {settings.heroTagline || "Powering Pakistan's Largest Construction Projects"}
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed">
              We provide heavy-duty crawler excavators, experienced operators, and comprehensive site operations for large excavation and foundation works.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/projects" className="btn-primary group">
                Explore Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Request Machinery Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          {statItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-2 flex flex-col items-center">
                <div className="p-3 bg-brand-amber/10 rounded-xl text-brand-amber mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-zinc-500 uppercase font-semibold tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="section-tag">Portfolio Highlights</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Our Landmark Excavation Operations
              </h2>
            </div>
            <Link href="/projects" className="text-brand-amber hover:text-brand-amber-light font-bold text-sm tracking-wide flex items-center gap-1 group">
              View All Construction Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project: any) => (
              <div key={project._id} className="card flex flex-col h-full">
                <div className="h-60 relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
                  <Image
                    src={project.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority={false}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`badge ${
                      project.status === 'completed' ? 'badge-green' : 'badge-amber'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-brand-amber transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-amber" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-amber" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-24 bg-zinc-900/40 border-y border-zinc-900 grid-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="section-tag">About RMK</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Specializing in Site Mobilization & Hard Earth Excavation
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {settings.aboutContent || "RMK has been providing reliable excavation services and machinery rentals for large infrastructure developments. We own and operate a premium fleet of 30+ crawler excavators, bulldozers, and wheel loaders."}
              </p>
              <div className="pt-4">
                <Link href="/about" className="btn-secondary">
                  Learn About Our Fleet
                </Link>
              </div>
            </div>
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl glow-amber-sm space-y-8 relative">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Why General Contractors Choose RMK</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-amber/10 flex items-center justify-center text-brand-amber text-xs font-bold mt-1">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">24/7 Mechanical Support</h4>
                    <p className="text-xs text-zinc-400">On-site mechanics minimize downtime during critical operations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-amber/10 flex items-center justify-center text-brand-amber text-xs font-bold mt-1">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Certified Operators Only</h4>
                    <p className="text-xs text-zinc-400">Operators carry all necessary licenses and undergo safety training.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-amber/10 flex items-center justify-center text-brand-amber text-xs font-bold mt-1">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Modern Excavator Fleet</h4>
                    <p className="text-xs text-zinc-400">Komatsu and Caterpillar machines fitted with modern bucket profiles.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="section-tag justify-center">Client Reviews</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Trusted by Top Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.testimonials?.map((t: any, idx: number) => (
              <div key={idx} className="glass p-8 rounded-xl space-y-6 relative flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-amber text-brand-amber" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm italic leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-brand-amber/10 flex items-center justify-center text-brand-amber font-black text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-zinc-500">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-amber to-brand-orange p-12 sm:p-16 text-zinc-950 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
              Need Heavy Machinery for Your Next Project?
            </h2>
            <p className="text-zinc-900/80 text-base sm:text-lg font-medium">
              Get in touch with our operations team today. We provide full mobilization proposals including operator costs and logistics.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact" className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white font-bold rounded-lg text-sm transition-transform hover:-translate-y-0.5 shadow-lg">
                Contact Operations
              </Link>
              <Link href="/about" className="px-6 py-3.5 border border-zinc-950/40 hover:bg-zinc-950/5 text-zinc-950 font-bold rounded-lg text-sm transition-colors">
                View Fleet Inventory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
