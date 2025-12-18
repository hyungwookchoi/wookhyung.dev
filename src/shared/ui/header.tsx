'use client';

import { ChevronDown, Globe } from 'lucide-react';
import type { Variants } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
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

function getNavigation(dict: Dictionary, lang: Locale): NavigationItem[] {
  return [
    { name: dict.navigation.home, href: `/${lang}` },
    {
      name: dict.navigation.dev,
      subItems: [
        { name: dict.navigation.tech, href: `/${lang}/tech` },
        { name: dict.navigation.feed, href: `/${lang}/feed` },
      ],
    },
    { name: dict.navigation.notes, href: `/${lang}/notes` },
    { name: dict.navigation.about, href: `/${lang}/about` },
  ];
}

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

const MenuToggle = ({
  toggle,
  ariaLabel,
}: {
  toggle: () => void;
  ariaLabel: string;
}) => (
  <button
    type="button"
    onClick={toggle}
    className="md:hidden p-2 text-gray-800 hover:text-gray-900 focus:outline-none relative z-50"
    aria-label={ariaLabel}
  >
    <svg width="20" height="20" viewBox="0 0 20 20">
      <title>Menu</title>
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

const DropdownMenu = ({
  item,
  pathname,
  lang,
}: {
  item: NavigationItem;
  pathname: string;
  lang: Locale;
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

  const isAnySubItemActive = item.subItems?.some((subItem) => {
    const hrefWithoutLang = subItem.href.replace(`/${lang}`, '');
    const pathnameWithoutLang = pathname.replace(`/${lang}`, '');
    return (
      pathnameWithoutLang === hrefWithoutLang ||
      pathnameWithoutLang.startsWith(`${hrefWithoutLang}/`)
    );
  });

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
            const hrefWithoutLang = subItem.href.replace(`/${lang}`, '');
            const pathnameWithoutLang = pathname.replace(`/${lang}`, '');
            const isSubItemActive =
              pathnameWithoutLang === hrefWithoutLang ||
              pathnameWithoutLang.startsWith(`${hrefWithoutLang}/`);
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

const LanguageSwitcher = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname();
  const router = useRouter();
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

  const switchLanguage = (newLang: Locale) => {
    const newPathname = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-900 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{lang}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 py-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[80px] z-50">
          <button
            onClick={() => switchLanguage('ko')}
            className={cn(
              'block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors',
              lang === 'ko' && 'bg-gray-100 text-gray-900 font-medium',
            )}
          >
            한국어
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={cn(
              'block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors',
              lang === 'en' && 'bg-gray-100 text-gray-900 font-medium',
            )}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export const Header = ({ lang, dict }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );

  const navigation = getNavigation(dict, lang);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (itemName: string) => {
    setOpenMobileDropdown(openMobileDropdown === itemName ? null : itemName);
  };

  const switchLanguage = (newLang: Locale) => {
    const newPathname = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPathname);
    setIsMobileMenuOpen(false);
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

  const isActiveLink = (href: string) => {
    const hrefWithoutLang = href.replace(`/${lang}`, '') || '/';
    const pathnameWithoutLang = pathname.replace(`/${lang}`, '') || '/';
    return (
      pathnameWithoutLang === hrefWithoutLang ||
      (hrefWithoutLang !== '/' &&
        pathnameWithoutLang.startsWith(`${hrefWithoutLang}/`))
    );
  };

  return (
    <>
      <header className="z-50 sticky top-0 bg-gray-100/50 px-4 py-3 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <Link
            href={`/${lang}`}
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
                    lang={lang}
                  />
                );
              }

              const isActive = isActiveLink(item.href!);

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
            <LanguageSwitcher lang={lang} />
          </div>

          <motion.nav
            initial={false}
            animate={isMobileMenuOpen ? 'open' : 'closed'}
            className="md:hidden"
          >
            <MenuToggle
              toggle={toggleMobileMenu}
              ariaLabel={dict.common.menuToggle}
            />
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
          aria-label={dict.common.closeMenu}
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
                  const isAnySubItemActive = item.subItems.some((subItem) =>
                    isActiveLink(subItem.href),
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
                            const isSubItemActive = isActiveLink(subItem.href);
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

                const isActive = isActiveLink(item.href!);

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

              {/* Mobile Language Switcher */}
              <motion.div variants={itemVariants}>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-500 mb-2">Language</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => switchLanguage('ko')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        lang === 'ko'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                      )}
                    >
                      한국어
                    </button>
                    <button
                      onClick={() => switchLanguage('en')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        lang === 'en'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                      )}
                    >
                      English
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
