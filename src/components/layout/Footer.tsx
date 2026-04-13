import { Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-forest py-20 px-6 overflow-hidden relative">
      <div className="glow-orb bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-emerald/10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
                <span className="text-forest font-heading font-bold text-2xl">A</span>
              </div>
              <span className="text-2xl font-heading font-bold text-white tracking-tight">ArriveLink</span>
            </div>
            <p className="text-mist/60 max-w-sm leading-relaxed mb-8">
              Nigeria's first verified transport platform. We're on a mission to bring transparency and trust to every Nigerian journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-mist/60 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-mist/60 hover:text-white transition-all">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-mist/60 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#how-it-works" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">How it works</a></li>
              <li><a href="#mockup" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">Search Routes</a></li>
              <li><a href="#why-arrivelink" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">Why ArriveLink</a></li>
              <li><a href="#faq" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">Terms of Service</a></li>
              <li><a href="#" className="text-mist/60 hover:text-emerald transition-colors text-sm font-medium">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-mist/40 text-[12px] font-medium">
            © 2026 ArriveLink. All rights reserved. Built with ❤️ for Nigeria.
          </p>
          <div className="flex items-center gap-2 text-mist/40 text-[12px] font-medium">
            <span>Status:</span>
            <span className="flex items-center gap-1.5 text-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
