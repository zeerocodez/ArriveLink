import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald text-forest hover:bg-pine hover:text-white shadow-cta',
      secondary: 'border-2 border-pine text-pine bg-transparent hover:bg-mist',
      ghost: 'text-forest hover:bg-mist',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-[16px] px-8 py-4 h-[48px] text-[15px] font-bold uppercase tracking-wider transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-lime/50',
          variants[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
