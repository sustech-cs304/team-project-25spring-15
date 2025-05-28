'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// 页面过渡动画变体
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// 卡片动画变体
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// 列表项动画变体
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

// 容器动画变体（用于交错动画）
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// 按钮动画变体
export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// 淡入动画变体
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// 滑入动画变体
export const slideInVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// 页面包装器组件
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className={className}
  >
    {children}
  </motion.div>
);

// 动画卡片组件
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export const AnimatedCard = ({ children, className = '', onClick, delay = 0 }: AnimatedCardProps) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    whileTap="tap"
    transition={{
      delay,
      duration: 0.3,
      ease: 'easeOut',
    }}
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </motion.div>
);

// 动画容器组件（用于交错动画）
interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedContainer = ({ children, className = '' }: AnimatedContainerProps) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

// 动画列表项组件
interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedListItem = ({ children, className = '', delay = 0 }: AnimatedListItemProps) => (
  <motion.div
    variants={listItemVariants}
    initial="hidden"
    animate="visible"
    transition={{
      delay,
      duration: 0.4,
      ease: 'easeOut',
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// 动画按钮组件
interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const AnimatedButton = ({ children, className = '', onClick, disabled = false }: AnimatedButtonProps) => (
  <motion.button
    variants={buttonVariants}
    whileHover={disabled ? {} : "hover"}
    whileTap={disabled ? {} : "tap"}
    className={className}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

// 淡入组件
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn = ({ children, className = '', delay = 0 }: FadeInProps) => (
  <motion.div
    variants={fadeInVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// 滑入组件
interface SlideInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const SlideIn = ({ children, className = '', delay = 0, direction = 'left' }: SlideInProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'up':
        return { x: 0, y: -100 };
      case 'down':
        return { x: 0, y: 100 };
      default:
        return { x: -100, y: 0 };
    }
  };

  const slideVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay,
      },
    },
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 路由过渡包装器
interface RouteTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export const RouteTransition = ({ children, routeKey }: RouteTransitionProps) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={routeKey}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// 加载动画组件
export const LoadingSpinner = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={`inline-block ${className}`}
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
  </motion.div>
);

// 脉冲动画组件
export const PulseAnimation = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// 弹跳动画组件
export const BounceAnimation = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
); 