import { Search, MapPin, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    title: 'Search your route',
    description: 'Enter your departure city, destination, and travel date to see all available options.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare operators',
    description: 'See real-time prices, departure times, and fleet classes from verified transport companies.',
    icon: MapPin,
  },
  {
    number: '03',
    title: 'Unlock access',
    description: 'Pay a flat ₦200 fee to get direct access to a booking representative and secure your seat.',
    icon: Unlock,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-mist-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[48px] font-heading font-bold text-forest mb-6 tracking-tight">Three Steps to Your Seat</h2>
          <p className="text-[18px] text-forest/70 max-w-2xl mx-auto">We've simplified the Nigerian travel experience. No more terminal hopping, just verified data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-10 rounded-[2rem] border border-mist shadow-card relative overflow-hidden group hover:border-emerald/30 transition-all"
            >
              <div className="text-[64px] font-heading font-bold text-lime/30 absolute top-[-10px] right-6 select-none group-hover:text-lime/50 transition-colors">
                {step.number}
              </div>
              <div className="w-16 h-16 bg-mist rounded-2xl flex items-center justify-center text-emerald mb-8 group-hover:scale-110 transition-transform">
                <step.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-4">{step.title}</h3>
              <p className="text-forest/60 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
