import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, Share2, MessageSquare, Twitter } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { WaitlistSchema, type WaitlistFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(WaitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    const path = 'waitlist';
    try {
      await addDoc(collection(db, path), {
        ...data,
        submittedAt: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist-form" className="py-32 px-6 bg-mist-gradient relative overflow-hidden">
      <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald/10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-emerald text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-emerald/10 shadow-sm">
            Early Access
          </span>
          <h2 className="text-[32px] md:text-[48px] font-heading font-bold text-forest mb-6 tracking-tight">Be First. Travel Better.</h2>
          <p className="text-[18px] text-forest/70 max-w-2xl mx-auto">
            Join thousands of Nigerians who are done with price surprises.
            Waitlist members get first access and one free unlock at launch.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-mist shadow-mockup"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-forest/60">Full Name</label>
                    <input
                      {...register('fullName')}
                      placeholder="Ada Okonkwo"
                      className={cn(
                        "w-full px-5 py-4 rounded-xl bg-mist/30 border border-mist focus:border-emerald/50 focus:ring-2 focus:ring-emerald/10 text-forest placeholder:text-forest/30 transition-all outline-none",
                        errors.fullName && "border-red-500 focus:ring-red-500/10"
                      )}
                    />
                    {errors.fullName && <p className="text-[13px] text-red-500 mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-forest/60">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="ada@email.com"
                      className={cn(
                        "w-full px-5 py-4 rounded-xl bg-mist/30 border border-mist focus:border-emerald/50 focus:ring-2 focus:ring-emerald/10 text-forest placeholder:text-forest/30 transition-all outline-none",
                        errors.email && "border-red-500 focus:ring-red-500/10"
                      )}
                    />
                    {errors.email && <p className="text-[13px] text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-forest/60">Most Traveled Route</label>
                    <input
                      {...register('route')}
                      placeholder="e.g. Lagos to Abuja"
                      className={cn(
                        "w-full px-5 py-4 rounded-xl bg-mist/30 border border-mist focus:border-emerald/50 focus:ring-2 focus:ring-emerald/10 text-forest placeholder:text-forest/30 transition-all outline-none",
                        errors.route && "border-red-500 focus:ring-red-500/10"
                      )}
                    />
                    {errors.route && <p className="text-[13px] text-red-500 mt-1">{errors.route.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-forest/60">How often do you travel?</label>
                    <select
                      {...register('travelFrequency')}
                      className={cn(
                        "w-full px-5 py-4 rounded-xl bg-mist/30 border border-mist focus:border-emerald/50 focus:ring-2 focus:ring-emerald/10 text-forest transition-all outline-none appearance-none",
                        errors.travelFrequency && "border-red-500 focus:ring-red-500/10"
                      )}
                    >
                      <option value="" disabled>Select frequency...</option>
                      <option value="every-week">Every week</option>
                      <option value="few-times-month">A few times a month</option>
                      <option value="monthly">Monthly</option>
                      <option value="few-times-year">A few times a year</option>
                    </select>
                    {errors.travelFrequency && <p className="text-[13px] text-red-500 mt-1">{errors.travelFrequency.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-forest/60">WhatsApp Number (Optional)</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="08012345678"
                      className="w-full px-5 py-4 rounded-xl bg-mist/30 border border-mist focus:border-emerald/50 focus:ring-2 focus:ring-emerald/10 text-forest placeholder:text-forest/30 transition-all outline-none"
                    />
                  </div>

                  {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}

                  <Button type="submit" fullWidth disabled={isSubmitting} className="py-5 text-lg">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Secure My Spot →
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-12 text-center border border-mist shadow-mockup"
              >
                <div className="w-24 h-24 bg-emerald/10 rounded-full flex items-center justify-center text-emerald mx-auto mb-8 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-heading font-bold text-forest mb-4 tracking-tight">You're on the list! 🎉</h3>
                <p className="text-forest/60 mb-10 text-lg leading-relaxed">
                  Check your inbox for a confirmation from ArriveLink.
                  You'll be first to know when we launch.
                </p>
                
                {onSuccess && (
                  <Button onClick={onSuccess} fullWidth className="py-5 text-lg mb-10">
                    Start Using App Now →
                  </Button>
                )}

                <div className="pt-10 border-t border-mist">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-forest/40 mb-6">Share with a fellow traveler</p>
                  <div className="flex justify-center gap-6">
                    <button className="p-3 bg-mist/50 rounded-full text-forest/40 hover:text-emerald transition-colors">
                      <Twitter size={20} />
                    </button>
                    <button className="p-3 bg-mist/50 rounded-full text-forest/40 hover:text-emerald transition-colors">
                      <MessageSquare size={20} />
                    </button>
                    <button className="p-3 bg-mist/50 rounded-full text-forest/40 hover:text-emerald transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
