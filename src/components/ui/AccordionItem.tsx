import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  key?: React.Key;
}

export function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="glass rounded-2xl mb-4 border border-white/5 overflow-hidden transition-all duration-300 hover:border-accent-blue/30">
      <button
        className={cn(
          "w-full flex justify-between items-center px-8 py-6 cursor-pointer hover:bg-white/5 transition-colors text-left outline-none",
          isOpen && "bg-white/5"
        )}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-bold text-[17px] text-white tracking-tight">{question}</span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-accent-blue transition-transform duration-300",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-8 pb-6 text-[16px] text-slate leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
