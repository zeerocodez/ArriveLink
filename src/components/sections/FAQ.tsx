import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Is ArriveLink a transport company?',
    answer: 'No. We are an information and booking platform. we partner with verified transport companies to give you their real-time data in one place.',
  },
  {
    question: 'How do I book a seat?',
    answer: 'Once you find a route you like, pay the ₦200 unlock fee. This connects you directly to a booking representative from that company who will finalize your seat reservation.',
  },
  {
    question: 'What is the ₦200 fee for?',
    answer: 'This fee covers the cost of verifying the data and providing you with direct, instant access to a booking representative, saving you hours of terminal hopping.',
  },
  {
    question: 'Are the prices guaranteed?',
    answer: 'We verify prices weekly. However, transport companies may change fares without notice. Your booking rep will confirm the final price before you pay for your seat.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[48px] font-heading font-bold text-forest mb-6 tracking-tight">Got Questions?</h2>
          <p className="text-[18px] text-forest/70">Everything you need to know about the new way to travel in Nigeria.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-mist rounded-2xl overflow-hidden bg-mist/10 hover:bg-mist/20 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group"
              >
                <span className="text-lg font-bold text-forest group-hover:text-emerald transition-colors">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-forest/40 transition-transform duration-300",
                    openIndex === i && "rotate-180 text-emerald"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-forest/60 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
