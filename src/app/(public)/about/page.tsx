import Link from 'next/link';
import { Truck, ShieldCheck, Zap, Award, Target, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'About Fleet',
  description: 'Learn about RMK\'s excavator machinery fleet and operations experience.',
};

export default function AboutPage() {
  const machineryFleet = [
    { name: 'Komatsu PC300-8 Crawler Excavator', power: '260 HP', capacity: '1.4 - 1.9 m³', weight: '31,100 kg', count: 12 },
    { name: 'Komatsu PC400-8 Heavy Excavator', power: '345 HP', capacity: '1.9 - 2.8 m³', weight: '41,400 kg', count: 8 },
    { name: 'Komatsu PC500LC-10 Mining Excavator', power: '360 HP', capacity: '2.5 - 3.2 m³', weight: '49,000 kg', count: 4 },
    { name: 'Caterpillar 320D Series 2 Excavator', power: '140 HP', capacity: '0.9 - 1.2 m³', weight: '21,200 kg', count: 6 },
    { name: 'Caterpillar D7R Track Dozer', power: '240 HP', capacity: 'Semi-U Blade 5.8 m³', weight: '24,900 kg', count: 3 },
  ];

  const values = [
    { title: 'Zero-Harm Safety', desc: 'Safety overrides production demands. Daily toolboxes, operator licenses, and mechanical inspections are mandatory.', icon: ShieldCheck },
    { title: 'Fleet Reliability', desc: 'We operate only late-model excavators with meticulous maintenance logging, ensuring maximum site uptime.', icon: Truck },
    { title: 'Execution Excellence', desc: 'From hard rock cutting to sand leveling, our experienced operators ensure clean cut profiles per site blueprints.', icon: Zap },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sub-Hero Header */}
      <section className="relative py-20 bg-zinc-900/60 border-b border-zinc-900 grid-overlay overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-amber/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="section-tag justify-center">RMK Machinery & Team</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Our Fleet & Operational Standards
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
            Empowering primary contractors with reliable excavation machinery and professional manpower.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Our Story</h2>
            <p className="text-zinc-400 leading-relaxed">
              Founded in 2014, RMK started with just two crawler excavators working on local highway projects in Lahore. By delivering reliable cut profiles and honoring mobilization timelines, we built trust with major infrastructure companies.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Today, RMK stands as a trusted sub-contractor for earthworks, offering a consolidated fleet of over 30 heavy-duty excavators and supporting equipment. We maintain high safety standards, offering certified operators and site supervisors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-zinc-900 p-8 border border-zinc-800 rounded-xl">
            <div className="space-y-1">
              <span className="text-brand-amber text-4xl font-extrabold">30+</span>
              <h4 className="text-white text-sm font-semibold">Active Excavators</h4>
              <p className="text-xs text-zinc-500">Meticulously maintained and deployed.</p>
            </div>
            <div className="space-y-1">
              <span className="text-brand-amber text-4xl font-extrabold">20+</span>
              <h4 className="text-white text-sm font-semibold">Completed Projects</h4>
              <p className="text-xs text-zinc-500">From commercial base foundations to highway links.</p>
            </div>
            <div className="space-y-1">
              <span className="text-brand-amber text-4xl font-extrabold">100%</span>
              <h4 className="text-white text-sm font-semibold">Licensed Workforce</h4>
              <p className="text-xs text-zinc-500">Operators hold heavy vehicle licenses.</p>
            </div>
            <div className="space-y-1">
              <span className="text-brand-amber text-4xl font-extrabold">24/7</span>
              <h4 className="text-white text-sm font-semibold">Field Support</h4>
              <p className="text-xs text-zinc-500">Mobilized technical teams at site.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Inventory Table */}
      <section className="py-20 bg-zinc-900/30 border-y border-zinc-900 grid-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="section-tag justify-center">Machinery Fleet</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Our Heavy Excavation Assets</h2>
            <p className="text-sm text-zinc-400">
              All machines undergo routine mechanical auditing. Available for short-term rental and full project sub-contracting.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Machine Name</th>
                  <th>Engine Power</th>
                  <th>Bucket Capacity</th>
                  <th>Operating Weight</th>
                  <th>Fleet Count</th>
                </tr>
              </thead>
              <tbody>
                {machineryFleet.map((machine, index) => (
                  <tr key={index}>
                    <td className="font-bold text-white flex items-center gap-3">
                      <Truck className="h-4 w-4 text-brand-amber" />
                      {machine.name}
                    </td>
                    <td>{machine.power}</td>
                    <td>{machine.capacity}</td>
                    <td>{machine.weight}</td>
                    <td className="text-brand-amber font-extrabold">{machine.count} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="section-tag justify-center">Operating Values</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Safety & Operations Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <div key={index} className="card p-8 space-y-4">
                  <div className="p-3 bg-brand-amber/10 rounded-xl text-brand-amber w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-800 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Let's Partner on Your Foundation & Earthworks</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Need machinery mobilizations within Pakistan? Contact our operations coordinators for logistics timelines, operators, and pricing parameters.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/contact" className="btn-primary">
              Contact Operations
            </Link>
            <Link href="/projects" className="btn-secondary">
              Browse Project History
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
