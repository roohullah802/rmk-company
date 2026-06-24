import Link from 'next/link';
import Image from 'next/image';
import { getProjects } from '@/actions/projects';
import { MapPin, Calendar, HardHat, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Projects',
  description: 'Browse completed and ongoing heavy excavation and site works projects by RMK.',
};

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status || '';
  const searchFilter = resolvedSearchParams.search || '';

  let projects = [];
  try {
    projects = await getProjects({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      location: searchFilter || undefined,
    });
  } catch {
    projects = [];
  }

  // Fallbacks if empty
  if (projects.length === 0) {
    const mockProjects = [
      {
        _id: 'mock1',
        title: 'Karakoram Highway Phase II Excavation',
        location: 'KPK, Pakistan',
        timeline: '2023 - 2025',
        status: 'ongoing',
        description: 'Blasting, cutting, and clearing rocky terrain for highway layout.',
        images: ['https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=80'],
      },
      {
        _id: 'mock2',
        title: 'DHA Phase 9 Foundation Civil Work',
        location: 'Lahore, Pakistan',
        timeline: '2022 - 2023',
        status: 'completed',
        description: 'Bulk soil excavation and compaction for commercial blocks.',
        images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80'],
      },
      {
        _id: 'mock3',
        title: 'Bahria Town Heights Site Grading',
        location: 'Karachi, Pakistan',
        timeline: '2024',
        status: 'ongoing',
        description: 'Leveling hard terrain and grading for multi-story towers.',
        images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'],
      }
    ];

    projects = mockProjects.filter((p) => {
      const matchStatus = !statusFilter || statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = !searchFilter || p.location.toLowerCase().includes(searchFilter.toLowerCase()) || p.title.toLowerCase().includes(searchFilter.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  const statuses = [
    { label: 'All Projects', value: 'all' },
    { label: 'Planning', value: 'planning' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <section className="relative py-16 bg-zinc-900/60 border-b border-zinc-900 grid-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-tag justify-center">RMK Portfolios</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Our Landscaping & Civil Works</h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Review the scale, locations, and infrastructure partners we have collaborated with on site works.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-zinc-950 border-b border-zinc-900 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form method="GET" className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {statuses.map((s) => {
                const isActive = statusFilter === s.value || (s.value === 'all' && !statusFilter);
                return (
                  <Link
                    key={s.value}
                    href={`/projects?status=${s.value}&search=${searchFilter}`}
                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                      isActive
                        ? 'bg-brand-amber text-zinc-950'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                name="search"
                defaultValue={searchFilter}
                placeholder="Search by location or title..."
                className="input text-xs"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-zinc-950 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-4">
              <div className="p-4 bg-zinc-900 rounded-full w-fit mx-auto text-brand-amber border border-zinc-800">
                <HardHat className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No Projects Found</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                No active projects match your filters. Try modifying your search term or select another status filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <div key={project._id} className="card flex flex-col h-full group">
                  {/* Image Container */}
                  <div className="h-56 relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
                    <Image
                      src={project.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`badge ${
                        project.status === 'completed' ? 'badge-green' : 'badge-amber'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-amber transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                      <div className="flex flex-col gap-2 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-amber" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-brand-amber" />
                          <span>{project.timeline}</span>
                        </div>
                      </div>

                      <Link
                        href={`/projects/${project._id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded-lg transition-colors group-hover:bg-brand-amber group-hover:text-zinc-950 group-hover:border-brand-amber"
                      >
                        <FileText className="h-4 w-4" />
                        View Project Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
