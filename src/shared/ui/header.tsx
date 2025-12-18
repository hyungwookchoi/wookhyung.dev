'use client';

import { ChevronDown } from 'lucide-react';
import type { Variants } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/tailwind-merge';

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  subItems?: SubMenuItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Dev',
    subItems: [
      { name: 'Tech', href: '/tech' },
      { name: 'Feed', href: '/feed' },
    ],
  },
  { name: 'Notes', href: '/notes' },
  { name: 'About', href: '/about' },
] as const;

const sidebarVariants: Variants = {
  open: () => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const diagonal = Math.sqrt(vw * vw + vh * vh);
    return {
      clipPath: `circle(${diagonal}px at calc(100% - 40px) 40px)`,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 25,
        restDelta: 2,
      },
    };
  },
  closed: {
    clipPath: 'circle(24px at calc(100% - 40px) 40px)',
    transition: {
      delay: 0.1,
      type: 'spring',
      stiffness: 500,
      damping: 35,
    },
  },
};

const menuVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const backdropVariants: Variants = {
  open: {
    opacity: 1,
    visibility: 'visible',
    transition: {
      duration: 0.3,
    },
  },
  closed: {
    opacity: 0,
    visibility: 'hidden',
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
  },
};

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={toggle}
    className="md:hidden p-2 text-gray-800 hover:text-gray-900 focus:outline-none relative z-50"
    aria-label="메뉴 토글"
  >
    <svg width="20" height="20" viewBox="0 0 20 20">
      <title>메뉴</title>
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 18 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 18 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 18 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);

// 드롭다운 컴포넌트
const DropdownMenu = ({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const isAnySubItemActive = item.subItems?.some(
    (subItem) =>
      pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'text-sm font-medium transition-colors text-gray-800 hover:text-gray-900 flex items-center gap-1',
          isAnySubItemActive &&
            'underline underline-offset-4 decoration-gray-800 decoration-2',
        )}
        aria-expanded={isOpen}
      >
        {item.name}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && item.subItems && (
        <div className="absolute top-full left-0 mt-1 py-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px] z-50">
          {item.subItems.map((subItem) => {
            const isSubItemActive =
              pathname === subItem.href ||
              pathname.startsWith(`${subItem.href}/`);
            return (
              <Link
                key={subItem.name}
                href={subItem.href}
                className={cn(
                  'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors',
                  isSubItemActive && 'bg-gray-100 text-gray-900 font-medium',
                )}
              >
                {subItem.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (itemName: string) => {
    setOpenMobileDropdown(openMobileDropdown === itemName ? null : itemName);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="z-50 sticky top-0 bg-gray-100/50 px-4 py-3 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/wookhyung.png"
              alt="wookhyung"
              width={40}
              height={40}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.subItems) {
                return (
                  <DropdownMenu
                    key={item.name}
                    item={item}
                    pathname={pathname}
                  />
                );
              }

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'text-sm font-medium transition-colors text-gray-800 hover:text-gray-900',
                    isActive &&
                      'underline underline-offset-4 decoration-gray-800 decoration-2',
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation Container */}
          <motion.nav
            initial={false}
            animate={isMobileMenuOpen ? 'open' : 'closed'}
            className="md:hidden"
          >
            <MenuToggle toggle={toggleMobileMenu} />
          </motion.nav>
        </nav>
      </header>

      <motion.div
        className="md:hidden fixed inset-0 z-40"
        initial="closed"
        animate={isMobileMenuOpen ? 'open' : 'closed'}
        variants={backdropVariants}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsMobileMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="메뉴 닫기"
        />

        <div className="fixed top-0 left-0 right-0 h-screen">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-gray-100 shadow-lg h-full"
            variants={sidebarVariants}
          />

          <div className="relative h-full">
            <div className="h-14 bg-gray-100" />

            <motion.div className="px-6 py-4 space-y-1" variants={menuVariants}>
              {navigation.map((item) => {
                if (item.subItems) {
                  const isAnySubItemActive = item.subItems.some(
                    (subItem) =>
                      pathname === subItem.href ||
                      pathname.startsWith(`${subItem.href}/`),
                  );
                  const isDropdownOpen = openMobileDropdown === item.name;

                  return (
                    <motion.div key={item.name} variants={itemVariants}>
                      <button
                        onClick={() => toggleMobileDropdown(item.name)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3 text-lg font-medium text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors',
                          isAnySubItemActive && 'bg-gray-200 text-gray-900',
                        )}
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 transition-transform duration-300',
                            isDropdownOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubItemActive =
                              pathname === subItem.href ||
                              pathname.startsWith(`${subItem.href}/`);
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  'block px-4 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors',
                                  isSubItemActive &&
                                    'bg-gray-200 text-gray-900 font-medium',
                                )}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                }

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Link
                      href={item.href!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 text-lg font-medium text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors',
                        isActive && 'bg-gray-200 text-gray-900',
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
