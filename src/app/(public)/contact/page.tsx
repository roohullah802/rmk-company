import ContactForm from '@/components/public/ContactForm';
import { Phone, Mail, MapPin, HardHat, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Operations',
  description: 'Reach out to RMK for machinery quotes, operations scheduling, or fleet logistics.',
};

export default function ContactPage() {
  const contactDetails = [
    { title: 'Operations Phone', value: '+92 300 0000000', icon: Phone, desc: 'Mon-Sat 9am - 6pm' },
    { title: 'Email Address', value: 'info@rmk.com', icon: Mail, desc: 'Operations inquiry reply within 24h' },
    { title: 'Headquarters Office', value: '12-B Industrial Area, Gulberg III, Lahore, Pakistan', icon: MapPin, desc: 'Visitors by scheduled appointment' },
    { title: 'Operations Schedule', value: 'Active site support: 24/7/365', icon: Clock, desc: 'Emergency site assistance always open' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative py-16 bg-zinc-900/60 border-b border-zinc-900 grid-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-tag justify-center">Connect with RMK</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Request Quotes & Logistics</h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Reach out to our operations team to get a detailed proposal including operator deployment and mobilization costs.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 bg-zinc-950 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-amber to-brand-orange" />
              <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-extrabold text-white">Send a Message</h2>
                <p className="text-xs text-zinc-400">
                  Please specify your excavation requirements, site location, and expected mobilization date.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-white">Operations Directory</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  For emergency mechanical assistance on active contracts, please contact your assigned site supervisor or dial our operations hotline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactDetails.map((detail, idx) => {
                  const Icon = detail.icon;
                  return (
                    <div key={idx} className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-5 flex gap-4 items-start">
                      <div className="p-3 bg-brand-amber/10 rounded-xl text-brand-amber flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{detail.title}</h4>
                        <p className="text-sm font-bold text-white leading-tight break-all">{detail.value}</p>
                        <p className="text-[11px] text-zinc-400">{detail.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
