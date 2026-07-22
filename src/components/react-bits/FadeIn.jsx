import { motion } from 'motion/react';

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  y = 24,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
