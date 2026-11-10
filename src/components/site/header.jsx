'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X, Phone, Calendar } from 'lucide-react';
import { media } from '@/styles/theme';
import { LOGO_SRC, SITE_NAV } from '@/lib/site';
import { Button } from '@/components/ui/button';

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  transition: background 260ms ease, border-color 260ms ease, backdrop-filter 260ms ease;
  border-bottom: 1px solid ${({ $solid }) => ($solid ? 'rgba(255,255,255,0.08)' : 'transparent')};
  background: ${({ $solid }) => ($solid ? 'rgba(8, 8, 10, 0.88)' : 'linear-gradient(180deg, rgba(8,8,10,0.72) 0%, rgba(8,8,10,0) 100%)')};
  backdrop-filter: ${({ $solid }) => ($solid ? 'blur(18px) saturate(140%)' : 'none')};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.container};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
  height: ${({ theme }) => theme.layout.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex: none;
`;

const LogoFrame = styled.span`
  position: relative;
  width: 48px;
  height: 48px;
  display: block;
`;

const Wordmark = styled.span`
  display: none;
  flex-direction: column;
  line-height: 1;

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    margin-top: 5px;
    font-size: 8px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  ${media.sm} {
    display: flex;
  }
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: clamp(14px, 2vw, 30px);
  height: 100%;

  ${media.lg} {
    display: flex;
  }
`;

const NavItem = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.muted)};
  transition: color 160ms ease;
  padding-block: 10px;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  span.soon {
    font-size: 8px;
    color: ${({ theme }) => theme.colors.brand};
    letter-spacing: 0.08em;
    border: 1px solid rgba(242, 106, 13, 0.3);
    padding: 1px 4px;
    border-radius: 3px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% - 6px);
  ${({ $align }) => ($align === 'right' ? 'right: -24px;' : 'left: -24px;')}
  min-width: 300px;
  padding: 18px;
  background: rgba(14, 14, 17, 0.98);
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.lift};
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;

  ${NavItem}:hover &,
  ${NavItem}:focus-within & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  a {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 9px 10px;
    border-radius: 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.smoke};
    transition: background 140ms ease, color 140ms ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: ${({ theme }) => theme.colors.white};
    }

    span {
      color: ${({ theme }) => theme.colors.dim};
      font-size: 11px;
    }
  }

  .all {
    margin-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    padding-top: 12px;
    color: ${({ theme }) => theme.colors.brand};
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: none;
`;

const PhoneLink = styled.a`
  display: none;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.smoke};

  ${media.xl} {
    display: inline-flex;
  }

  &:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const BookDesktop = styled.div`
  display: none;

  ${media.md} {
    display: block;
  }
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};

  ${media.lg} {
    display: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 120;
  background: #08080a;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 22px var(--mobile-gutter, 22px) 40px;
`;

const OverlayTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const OverlayNav = styled.nav`
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 24px;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const OverlayFoot = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export function Header({ settings, navModules = [], services = [] }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const phone = settings?.business?.phone;
  const nav = SITE_NAV;

  return (
    <>
      <Bar $solid={solid}>
        <Inner>
          <Brand href="/" aria-label="Street Wrenchers home">
            <LogoFrame>
              <Image src={LOGO_SRC} alt="Street Wrenchers" fill sizes="48px" priority style={{ objectFit: 'contain' }} />
            </LogoFrame>
            <Wordmark>
              <strong>STREET WRENCHERS</strong>
              <span>Dubai · Auto Care</span>
            </Wordmark>
          </Brand>

          <Nav aria-label="Main navigation">
            {nav.slice(0, 3).map((item) =>
              item.href === '/services' ? (
                <NavItem key={item.href}>
                  <NavLink href="/services" $active={isActive('/services')}>
                    Services <ChevronDown size={13} aria-hidden="true" />
                  </NavLink>
                  <Dropdown>
                    {services.slice(0, 8).map((service) => (
                      <Link key={service.id} href={`/services/${service.slug}`}>
                        {service.name}
                        <span>{service.category?.name}</span>
                      </Link>
                    ))}
                    <Link href="/services" className="all">View all services →</Link>
                  </Dropdown>
                </NavItem>
              ) : (
                <NavItem key={item.href}>
                  <NavLink href={item.href} $active={isActive(item.href)}>{item.label}</NavLink>
                </NavItem>
              ),
            )}
            {nav.slice(3).map((item) => (
              <NavItem key={item.href}>
                <NavLink href={item.href} $active={isActive(item.href)}>{item.label}</NavLink>
              </NavItem>
            ))}
            {navModules.length ? (
              <NavItem>
                <NavLink as="span" style={{ cursor: 'default' }}>
                  More <ChevronDown size={13} aria-hidden="true" />
                </NavLink>
                <Dropdown $align="right">
                  {navModules.map((module) => (
                    <Link key={module.href} href={module.href} style={{ alignItems: 'center' }}>
                      {module.label}
                      {module.status === 'COMING_SOON' ? <span className="soon">Soon</span> : null}
                    </Link>
                  ))}
                </Dropdown>
              </NavItem>
            ) : null}
          </Nav>

          <Actions>
            {phone ? (
              <PhoneLink href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                <Phone size={14} aria-hidden="true" />
                {phone}
              </PhoneLink>
            ) : null}
            <BookDesktop>
              <Button href="/book" size="sm" icon={false}>
                <Calendar size={14} style={{ marginRight: 2 }} aria-hidden="true" />
                Book a service
              </Button>
            </BookDesktop>
            <MenuButton type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
              <Menu size={20} />
            </MenuButton>
          </Actions>
        </Inner>
      </Bar>

      <AnimatePresence>
        {open ? (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <OverlayTop>
              <Brand href="/" onClick={() => setOpen(false)}>
                <LogoFrame>
                  <Image src={LOGO_SRC} alt="Street Wrenchers" fill sizes="48px" style={{ objectFit: 'contain' }} />
                </LogoFrame>
              </Brand>
              <MenuButton type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </MenuButton>
            </OverlayTop>

            <OverlayNav>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              {navModules.map((module) => (
                <Link key={module.href} href={module.href} onClick={() => setOpen(false)}>
                  {module.label}
                  {module.status === 'COMING_SOON' ? <span style={{ fontSize: 11, color: '#f26a0d', letterSpacing: '0.1em' }}>SOON</span> : null}
                </Link>
              ))}
            </OverlayNav>

            <OverlayFoot>
              <Button href="/book" onClick={() => setOpen(false)}>Book a service</Button>
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={15} /> {phone}
                </a>
              ) : null}
              <span>{settings?.business?.addressLine}</span>
            </OverlayFoot>
          </Overlay>
        ) : null}
      </AnimatePresence>
    </>
  );
}
