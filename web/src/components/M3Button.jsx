import React from 'react';
import { motion } from 'framer-motion';

export default function M3Button({ children, variant = 'filled', className = '', ...props }) {
  const [ripple, setRipple] = React.useState(null);

  const base = 'relative overflow-hidden rounded-m3 px-5 py-2.5 text-bodyMd font-medium transition-colors';
  const variants = {
    filled: 'bg-m3Primary text-white hover:brightness-110',
    outlined: 'border border-m3Secondary text-m3Secondary bg-transparent hover:bg-m3SurfaceTint/40',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onTapStart={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setRipple({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          key: Date.now(),
        });
      }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {ripple && (
        <motion.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
