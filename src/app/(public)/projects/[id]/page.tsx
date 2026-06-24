import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getProjects } from '@/actions/projects';
import { ArrowLeft, MapPin, Calendar, Building, HardHat, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  return {
    title: `Project: ${id} | RMK`,
    description: 'View detailed information about this RMK excavation project.',
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let project;
  let relatedProjects = [];

  try {
    project = await getProjectById(id);
    const allProjects = await getProjects();
    relatedProjects = allProjects.filter((p: any) => p._id !== id).slice(0, 3);
  } catch {
    project = null;
    relatedProjects = [];
  }

  // Fallbacks for demo/local if project doesn't exist in DB
  if (!project && id.startsWith('mock')) {
    const mockDb: Record<string, any> = {
      mock1: {
        _id: 'mock1',
        title: 'Karakoram Highway Phase II Excavation',
        location: 'KPK, Pakistan',
        timeline: '2023 - 2025',
        status: 'ongoing',
        description: 'Large-scale rock cutting, foundation digging, and terrain preparation for the Karakoram Highway extension. RMK mobilized 8 Komatsu PC400 excavators and 3 D7 bulldozers for this highway contract. The site operations involved drilling support, safety inspections, and tight scheduling under extreme mountainous conditions.',
        images: [
          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80',
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
        ],
        companyId: { name: 'NHA Pakistan', email: 'info@nha.gov.pk', logo: '' }
      },
      mock2: {
        _id: 'mock2',
        title: 'DHA Phase 9 Foundation Civil Work',
        location: 'Lahore, Pakistan',
        timeline: '2022 - 2023',
        status: 'completed',
        description: 'Bulk soil excavation, grading, compacting, and foundational piling preparation for a commercial high-rise block in DHA Phase 9. RMK coordinated with DHA engineers to move 120,000 cubic meters of earth in 8 months, using 12 crawler excavators operating in double shifts.',
        images: [
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        ],
        companyId: { name: 'DHA Lahore', email: 'contracting@dhalahore.org', logo: '' }
      },
      mock3: {
        _id: 'mock3',
        title: 'Bahria Town Heights Site Grading',
        location: 'Karachi, Pakistan',
        timeline: '2024',
        status: 'ongoing',
        description: 'Extensive site grading, deep basement excavation, and debris transport for the Bahria Heights multi-tower apartment complex. Commenced with site surveying and hard earth drilling, utilizing PC500 mining-scale excavators for quick soil clearing.',
        images: [
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=80',
        ],
        companyId: { name: 'Bahria Town', email: 'info@bahriatown.com', logo: '' }
      }
    };
    project = mockDb[id];
    relatedProjects = Object.values(mockDb).filter((p: any) => p._id !== id).slice(0, 3);
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <HardHat className="h-12 w-12 text-brand-amber animate-bounce" />
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <p className="text-zinc-500 text-sm">The project you are looking for does not exist or has been deleted.</p>
        <Link href="/projects" className="btn-primary text-xs font-bold mt-2">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* Back Button */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        {/* Title Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`badge ${
              project.status === 'completed' ? 'badge-green' : 'badge-amber'
            }`}>
              {project.status}
            </span>
            <span className="badge badge-gray text-[10px]">Excavation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          {/* Content / Images */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative h-[300px] sm:h-[450px] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
              <Image
                src={project.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'}
                alt={project.title}
                fill
                sizes="(max-width: 1200px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {project.images && project.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Project Details Description */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <h3 className="text-xl font-bold text-white">Project Scope & Operations</h3>
              <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                {project.description}
              </p>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/5 rounded-full blur-2xl" />
              <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Project Profile</h3>

              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="p-2.5 bg-zinc-800 rounded-lg text-brand-amber">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Location</h4>
                    <p className="text-sm font-bold text-white mt-0.5">{project.location}</p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="p-2.5 bg-zinc-800 rounded-lg text-brand-amber">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Timeline</h4>
                    <p className="text-sm font-bold text-white mt-0.5">{project.timeline}</p>
                  </div>
                </li>

                {project.companyId && (
                  <li className="flex gap-4 items-start">
                    <div className="p-2.5 bg-zinc-800 rounded-lg text-brand-amber">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Client Company</h4>
                      <p className="text-sm font-bold text-white mt-0.5">{project.companyId.name}</p>
                    </div>
                  </li>
                )}

                <li className="flex gap-4 items-start">
                  <div className="p-2.5 bg-zinc-800 rounded-lg text-brand-amber">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">RMK Compliance</h4>
                    <p className="text-sm font-bold text-white mt-0.5">Safety audited & verified</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-16 border-t border-zinc-900 space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tight">Other Landscaping Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rp: any) => (
                <Link href={`/projects/${rp._id}`} key={rp._id} className="card block group">
                  <div className="h-44 relative overflow-hidden bg-zinc-900 border-b border-zinc-800">
                    <Image
                      src={rp.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'}
                      alt={rp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-white group-hover:text-brand-amber transition-colors text-sm line-clamp-1">
                      {rp.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>{rp.location}</span>
                      <span className="text-brand-amber">{rp.timeline}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
