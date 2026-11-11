'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  BarChart3,
  CalendarCheck2,
  Car,
  ChevronRight,
  ExternalLink,
  FileText,
  Gauge,
  HelpCircle,
  Image as ImageIcon,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  MessagesSquare,
  Newspaper,
  Package,
  Route,
  SearchCheck,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { media } from '@/styles/theme';
import { LOGO_SRC } from '@/lib/site';
import { initials } from '@/lib/utils';
import { GUIDE_STORAGE_KEY } from '@/lib/dashboard-guide';
import { GuidedTour } from './help';

const SIDEBAR = 268;

const Shell = styled.div`
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.ink};
`;

const Sidebar = styled.aside`
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  z-index: 60;
  width: ${SIDEBAR}px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.coal};
  border-right: 1px solid ${({ theme }) => theme.colors.line};
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform ${({ theme }) => theme.transitions.base};

  ${media.lg} {
    transform: none;
  }
`;

const Scrim = styled.button`
  position: fixed;
  inset: 0;
  z-index: 55;
  border: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.base};

  ${media.lg} {
    display: none;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  .mark {
    position: relative;
    width: 42px;
    height: 42px;
    flex: none;
  }

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 12px;
    letter-spacing: 0.2em;
    color: ${({ theme }) => theme.colors.white};
  }

  span.meta {
    display: block;
    margin-top: 4px;
    font-size: 9.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupLabel = styled.p`
  padding: 0 12px 6px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};
`;

const NavLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.smoke};
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  svg { color: ${({ theme }) => theme.colors.dim}; transition: color ${({ theme }) => theme.transitions.fast}; flex: none; }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: ${({ theme }) => theme.colors.white};
    svg { color: ${({ theme }) => theme.colors.smoke}; }
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.colors.brandWash};
    color: ${theme.colors.white};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 2px;
      border-radius: 2px;
      background: ${theme.colors.brand};
    }

    svg { color: ${theme.colors.brand}; }
  `}
`;

const SidebarFoot = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

const SiteLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 7px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};

  &:hover { color: ${({ theme }) => theme.colors.white}; border-color: ${({ theme }) => theme.colors.lineStrong}; }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;

  ${media.lg} {
    margin-inline-start: ${SIDEBAR}px;
  }
`;

const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 10px clamp(16px, 3vw, 32px);
  background: rgba(8, 8, 10, 0.82);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  color: ${({ theme }) => theme.colors.smoke};

  ${media.lg} {
    display: ${({ $mobileOnly }) => ($mobileOnly ? 'none' : 'inline-flex')};
  }
`;

const Breadcrumb = styled.div`
  display: none;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.dim};

  ${media.sm} {
    display: flex;
  }

  a:hover { color: ${({ theme }) => theme.colors.white}; }
  span.current { color: ${({ theme }) => theme.colors.white}; }
`;

const TopSpacer = styled.div`
  flex: 1;
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  border-left: 1px solid ${({ theme }) => theme.colors.line};

  small {
    display: none;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.dim};

    ${media.md} { display: block; }
  }
`;

const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brandWash};
  border: 1px solid rgba(242, 106, 13, 0.35);
  color: ${({ theme }) => theme.colors.brand};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1500px;
  margin-inline: auto;
  padding: clamp(20px, 3vw, 36px);
`;

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Bookings', href: '/dashboard/bookings', icon: CalendarCheck2 },
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Leads & CRM', href: '/dashboard/leads', icon: MessagesSquare },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Service Categories', href: '/dashboard/categories', icon: Layers },
      { label: 'Services', href: '/dashboard/services', icon: Wrench },
      { label: 'Packages', href: '/dashboard/packages', icon: Package },
      { label: 'AMC Plans', href: '/dashboard/amc', icon: ShieldCheck },
      { label: 'Car Brands', href: '/dashboard/brands', icon: Car },
      { label: 'Vehicle Models', href: '/dashboard/models', icon: Tag },
    ],
  },
  {
    label: 'Website content',
    items: [
      { label: 'Pages & Sections', href: '/dashboard/pages', icon: FileText },
      { label: 'Banners', href: '/dashboard/banners', icon: Sparkles },
      { label: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
      { label: 'Blog', href: '/dashboard/blog', icon: Newspaper },
      { label: 'Testimonials', href: '/dashboard/testimonials', icon: Star },
      { label: 'FAQs', href: '/dashboard/faqs', icon: HelpCircle },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
      { label: 'SEO & Redirects', href: '/dashboard/seo', icon: SearchCheck },
      { label: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageSquare },
    ],
  },
  {
    label: 'Future modules',
    items: [
      { label: 'Car Rental', href: '/dashboard/car-rental', icon: Car },
      { label: 'Car Sales', href: '/dashboard/car-sales', icon: Gauge },
      { label: 'Module Controls', href: '/dashboard/modules', icon: SlidersHorizontal },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Business Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Security & Sessions', href: '/dashboard/security', icon: KeyRound },
      { label: 'Redirects', href: '/dashboard/redirects', icon: Route },
      { label: 'Help Centre', href: '/dashboard/help', icon: HelpCircle },
    ],
  },
];

const PAGE_LABELS = NAV_GROUPS.flatMap((group) => group.items).reduce((map, item) => {
  map[item.href] = item.label;
  return map;
}, {});

function titleFor(pathname) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  const match = Object.keys(PAGE_LABELS)
    .filter((href) => href !== '/dashboard' && pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_LABELS[match] : 'Dashboard';
}

export function DashboardShell({ owner, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(GUIDE_STORAGE_KEY)) setTourOpen(true);
    } catch {
      /* storage can be unavailable in private modes */
    }
    const startTour = () => setTourOpen(true);
    window.addEventListener('sw:start-tour', startTour);
    return () => window.removeEventListener('sw:start-tour', startTour);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  }

  const current = titleFor(pathname);

  return (
    <Shell>
      <Scrim $open={open} aria-label="Close navigation" onClick={() => setOpen(false)} />
      <Sidebar $open={open}>
        <Brand href="/dashboard">
          <span className="mark">
            <Image src={LOGO_SRC} alt="Street Wrenchers" fill sizes="42px" style={{ objectFit: 'contain' }} />
          </span>
          <span>
            <strong>STREET WRENCHERS</strong>
            <span className="meta">Owner dashboard</span>
          </span>
        </Brand>

        <Nav aria-label="Dashboard sections">
          {NAV_GROUPS.map((group) => (
            <Group key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              {group.items.map((item) => {
                const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <NavLink key={`${group.label}-${item.href}-${item.label}`} href={item.href} $active={active}>
                    <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
            </Group>
          ))}
        </Nav>

        <SidebarFoot>
          <SiteLink href="/" target="_blank" rel="noreferrer">
            View live website
            <ExternalLink size={13} aria-hidden="true" />
          </SiteLink>
        </SidebarFoot>
      </Sidebar>

      <Body>
        <Topbar>
          <IconButton $mobileOnly onClick={() => setOpen(true)} aria-label="Open navigation" type="button">
            <Menu size={18} />
          </IconButton>
          <Breadcrumb>
            <Link href="/dashboard">Dashboard</Link>
            {pathname !== '/dashboard' ? (
              <>
                <ChevronRight size={11} aria-hidden="true" />
                <span className="current">{current}</span>
              </>
            ) : null}
          </Breadcrumb>
          <TopSpacer />
          <IconButton as={Link} href="/dashboard/help" aria-label="Open help centre" title="Help centre">
            <HelpCircle size={17} />
          </IconButton>
          <Owner>
            <Avatar>{initials(owner.name || owner.email)}</Avatar>
            <small>
              {owner.name}
              <br />
              {owner.email}
            </small>
          </Owner>
          <IconButton onClick={signOut} disabled={signingOut} aria-label="Sign out" title="Sign out" type="button">
            {signingOut ? <X size={17} /> : <LogOut size={17} />}
          </IconButton>
        </Topbar>

        <Main id="dashboard-main">{children}</Main>
      </Body>

      <GuidedTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </Shell>
  );
}
