import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useSearch } from '@/components/search/SearchProvider';
import { useAtlas } from '@/store/AtlasProvider';
import { LayerMark } from '@/components/ui/LayerMark';

const links = [
  { label: 'Discover', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Journal', href: '/journal' },
  { label: 'Culture', href: '/culture' },
  { label: 'Events', href: '/events', live: true },
  { label: 'Plan', href: '/plan' },
];

export const Nav = () => {
  const { pathname } = useLocation();
  const { open } = useSearch();
  const atlas = useAtlas();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkSurface, setDarkSurface] = useState(false);

  const hasImageHero =
    pathname === '/' || /^\/destinations\/[^/]+$/.test(pathname) || /^\/journal\/[^/]+$/.test(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const read = () => setDarkSurface(document.documentElement.dataset.surface === 'dark');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-surface'],
    });
    return () => observer.disconnect();
  }, []);

  const overlay = hasImageHero && !scrolled;
  const light = overlay || darkSurface;
  const savedCount =
    atlas.savedDestinations.length + atlas.savedStories.length + (atlas.savedEvents?.length ?? 0);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,color,border-color,backdrop-filter] duration-300 print-hide',
          overlay
            ? 'border-transparent bg-[linear-gradient(180deg,rgba(8,10,8,0.62)_0%,rgba(8,10,8,0.3)_65%,rgba(8,10,8,0.08)_100%)] text-ivory'
            : darkSurface
              ? 'border-ivory/10 bg-night/90 text-ivory backdrop-blur-md'
              : 'border-ink/10 bg-ivory/94 text-ink backdrop-blur-md',
        )}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-5">
          <Link
            to="/"
            aria-label="KASANE — home"
            className="flex shrink-0 items-center gap-2.5 transition-opacity duration-200 hover:opacity-70"
          >
            <LayerMark className={light ? 'text-ivory/80' : 'text-olive'} />
            <span className="font-display text-[1.3rem] leading-none tracking-[0.14em]">KASANE</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex">
            {links.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-1.5 py-1 text-[0.8125rem] tracking-[-0.005em] transition-opacity duration-200',
                    active
                      ? 'opacity-100'
                      : light
                        ? 'opacity-[0.82] hover:opacity-100'
                        : 'opacity-[0.68] hover:opacity-100',
                  )}
                >
                  {item.live ? (
                    <span
                      className={cn(
                        'h-1 w-1 rounded-full',
                        light ? 'bg-ivory' : 'bg-seal',
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-[3px] h-px origin-left bg-current transition-transform duration-300',
                      active ? 'scale-x-100 opacity-50' : 'scale-x-0 opacity-0',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={open}
              className="flex h-9 w-9 items-center justify-center rounded-full opacity-75 transition-[opacity,background-color] hover:bg-current/[0.07] hover:opacity-100"
              aria-label="Search the atlas"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>

            <Link
              to="/my-world"
              aria-current={pathname === '/my-world' ? 'page' : undefined}
              className={cn(
                'hidden h-9 items-center gap-2 rounded-full border px-3.5 text-[0.75rem] transition-colors sm:inline-flex',
                light
                  ? 'border-ivory/25 hover:bg-white/10'
                  : 'border-ink/15 hover:border-ink/35 hover:bg-ink/[0.03]',
              )}
            >
              My World
              {savedCount ? (
                <span
                  className={cn(
                    'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.5625rem] font-semibold tabular-nums',
                    light ? 'bg-ivory text-ink' : 'bg-ink text-ivory',
                  )}
                  aria-label={`${savedCount} saved items`}
                >
                  {savedCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border transition-colors xl:hidden',
                light ? 'border-ivory/30 hover:bg-white/10' : 'border-ink/20 hover:bg-ink/5',
              )}
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
};
