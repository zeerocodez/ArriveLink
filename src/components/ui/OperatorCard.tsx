import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Star, Heart, Snowflake, Shield, Diamond, Clock, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OperatorCardProps {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  route: string;
  departure: string;
  fleet: string;
  price: number;
  verifiedDays: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onBook?: () => void;
  className?: string;
  badge?: string;
  variant?: 'vertical' | 'horizontal';
  key?: React.Key;
}

export function OperatorCard({
  id,
  name,
  rating,
  reviews,
  route,
  departure,
  fleet,
  price,
  verifiedDays,
  isFavorited,
  onFavoriteToggle,
  onBook,
  className,
  badge,
  variant = 'vertical',
}: OperatorCardProps) {
  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const prevPrice = useRef(price);

  useEffect(() => {
    if (prevPrice.current !== price) {
      setIsPriceUpdated(true);
      const timer = setTimeout(() => setIsPriceUpdated(false), 3000);
      prevPrice.current = price;
      return () => clearTimeout(timer);
    }
  }, [price]);

  const FleetIcon = () => {
    if (fleet.includes('Air-Conditioned')) return <Snowflake size={14} className="text-emerald" />;
    if (fleet.includes('Executive')) return <Diamond size={14} className="text-emerald" />;
    return <Shield size={14} className="text-emerald" />;
  };

  if (variant === 'horizontal') {
    return (
      <div className={cn(
        "bg-white rounded-[2rem] p-8 border border-mist shadow-sm group hover:border-emerald/30 transition-all relative flex flex-col md:flex-row items-center gap-8",
        badge && "border-emerald/40 ring-1 ring-emerald/10 shadow-lg shadow-emerald/5",
        className
      )}>
        {badge && (
          <div className="absolute -top-3 left-8 bg-emerald text-white text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-10">
            <Star size={12} fill="currentColor" /> {badge}
          </div>
        )}

        <div className="flex-grow space-y-3 w-full">
          <div className="flex items-center justify-between md:justify-start gap-4">
            <h3 className="text-xl font-bold text-forest group-hover:text-emerald transition-colors">{name}</h3>
            {onFavoriteToggle && (
              <button 
                onClick={() => onFavoriteToggle(id)}
                className={cn(
                  "p-1.5 rounded-full transition-all md:hidden",
                  isFavorited ? "text-red-500 bg-red-50" : "text-forest/20"
                )}
              >
                <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-forest/60 text-sm font-medium">
              <Clock size={16} className="text-forest/30" />
              {departure}
            </div>
            <div className="flex items-center gap-2 text-forest/60 text-sm font-medium">
              <FleetIcon />
              {fleet}
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-emerald" fill="currentColor" />
              <span className="text-sm font-bold text-emerald">{rating}</span>
              <span className="text-sm text-forest/30 font-medium">({reviews})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-forest/40 font-medium">
            <Check size={14} className="text-forest/20" />
            Price verified {verifiedDays} days ago
          </div>
        </div>

        {/* Decorative Divider/Arrow from screenshot */}
        {badge && (
          <div className="hidden md:flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-mist/50 border border-mist flex items-center justify-center text-forest/20 group-hover:text-emerald group-hover:border-emerald/20 transition-all">
              <ChevronDown size={20} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-mist">
          <div className="text-right relative min-w-[120px]">
            <AnimatePresence>
              {isPriceUpdated && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-6 right-0 flex items-center gap-1 text-[10px] font-bold text-emerald uppercase tracking-tighter"
                >
                  <RefreshCw size={10} className="animate-spin-slow" />
                  Price Updated
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div 
              animate={isPriceUpdated ? { 
                scale: [1, 1.1, 1],
                color: ["#16423C", "#10b981", "#16423C"] 
              } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-forest flex items-center justify-end"
            >
              <span className="text-2xl mr-0.5">₦</span>
              {price.toLocaleString()}
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4">
            {onFavoriteToggle && (
              <button 
                onClick={() => onFavoriteToggle(id)}
                className={cn(
                  "hidden md:flex p-2.5 rounded-xl transition-all",
                  isFavorited ? "text-red-500 bg-red-50" : "text-forest/20 hover:text-red-400 hover:bg-red-50/50"
                )}
              >
                <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            )}
            <button 
              onClick={onBook}
              className="px-8 py-3.5 rounded-full border-2 border-emerald/20 text-emerald font-bold text-sm hover:bg-emerald hover:text-white transition-all shadow-sm min-w-[160px] flex items-center justify-center gap-2 bg-white"
            >
              Unlock — ₦200
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-[12px] p-6 border border-mist shadow-card group hover:border-emerald/30 transition-all relative",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-forest group-hover:text-emerald transition-colors">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5 text-emerald">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold">{rating}</span>
            </div>
            <span className="text-[11px] text-forest/40 font-medium">({reviews} reviews)</span>
          </div>
        </div>
        <div className="text-right relative">
          <AnimatePresence>
            {isPriceUpdated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-0 flex items-center gap-1 text-[8px] font-bold text-emerald uppercase tracking-tighter"
              >
                <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                Live
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div 
            animate={isPriceUpdated ? { 
              scale: [1, 1.05, 1],
              color: ["#16423C", "#10b981", "#16423C"] 
            } : {}}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-pine"
          >
            ₦{price.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-forest/40 font-bold uppercase tracking-widest mt-1">Verified {verifiedDays}d ago</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Route</div>
          <div className="text-xs font-bold text-forest truncate">{route}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Departure</div>
          <div className="text-xs font-bold text-forest">{departure}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Fleet</div>
          <div className="text-xs font-bold text-forest">{fleet}</div>
        </div>
        <div className="flex items-end justify-end">
          {onFavoriteToggle && (
            <button 
              onClick={() => onFavoriteToggle(id)}
              className={cn(
                "p-2 rounded-lg transition-all",
                isFavorited ? "text-red-500 bg-red-50" : "text-forest/20 hover:text-red-400 hover:bg-red-50/50"
              )}
            >
              <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      <Button onClick={onBook} fullWidth size="sm">
        Unlock Access
      </Button>
    </div>
  );
}
