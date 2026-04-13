import { ShieldCheck, Banknote, Zap, Flag, Users, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const trustSignals = [
  {
    title: 'Verified Prices',
    description: 'Our team calls and confirms fares weekly. No more gate surprises.',
    icon: Banknote,
  },
  {
    title: 'Real Operators',
    description: 'We only list companies we have contacted directly and verified.',
    icon: ShieldCheck,
  },
  {
    title: 'Instant Access',
    description: 'One ₦200 unlock connects you to a live rep instantly.',
    icon: Zap,
  },
  {
    title: 'Built for Nigeria',
    description: 'By Nigerians who have felt the pain of terminal hopping.',
    icon: Flag,
  },
  {
    title: 'No Hidden Fees',
    description: '₦200 is all you pay us. The rest goes to your operator.',
    icon: Users,
  },
  {
    title: 'Your Data, Protected',
    description: 'We do not sell your information. Your privacy is our priority.',
    icon: ShieldCheck,
  },
];

export function WhyArriveLink() {
  return (
    <section id="why-arrivelink" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[48px] font-heading font-bold text-forest mb-6 tracking-tight">Built on Trust. Designed for Nigeria.</h2>
          <p className="text-[18px] text-forest/70 max-w-2xl mx-auto">Why thousands will trust ArriveLink for their next journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {trustSignals.map((signal, i) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] border border-mist bg-mist/20 hover:bg-mist/40 transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <signal.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">{signal.title}</h3>
              <p className="text-forest/60 leading-relaxed text-sm">{signal.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Placeholder */}
        <div className="bg-forest rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="glow-orb top-[-100px] left-[-100px] w-[400px] h-[400px] bg-lime/20" />
          <div className="relative z-10">
            <div className="flex justify-center gap-1 text-lime mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
            </div>
            <h3 className="text-[28px] md:text-[40px] font-heading font-bold text-white mb-6 leading-tight">
              "Finally, someone is solving the terminal hopping problem. ArriveLink is a game changer for Nigerian travelers."
            </h3>
            <p className="text-lime font-bold uppercase tracking-widest text-sm">— Tunde, Frequent Lagos-Abuja Traveler</p>
          </div>
        </div>
      </div>
    </section>
  );
}
