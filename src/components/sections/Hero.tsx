import { motion } from 'motion/react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Glow Orbs from PRD */}
      <div className="glow-orb top-[-100px] left-[-100px] w-[600px] h-[600px] bg-forest/10" />
      <div className="glow-orb bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-emerald/10" />
      
      {/* Subtle Pattern Placeholder */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0A3D1F 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-mist text-pine text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-pine/10">
              Nigeria's First Verified Transport Platform
            </span>
            <h1 className="text-[48px] md:text-[72px] font-heading font-bold text-forest leading-[1.1] mb-8 tracking-tight">
              Stop Hopping Terminals. <br />
              <span className="text-emerald">Find Your Bus in Minutes.</span>
            </h1>
            <p className="text-[18px] md:text-[20px] text-forest/70 font-sans leading-relaxed mb-10 max-w-2xl">
              ArriveLink gives you verified prices, departure times, and instant booking access for every major Nigerian route — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={scrollToWaitlist}
                className="px-10"
              >
                Join the Waitlist <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-mist flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-emerald mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-forest/60 font-medium">Trusted by 2,000+ early travelers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
