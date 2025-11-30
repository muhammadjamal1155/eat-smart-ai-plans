import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10, // Subtle slide up
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -10, // Subtle slide out
    }
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut', // Smoother easing
    duration: 0.3 // Slightly faster
} as const;

const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
