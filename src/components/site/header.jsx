'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styled, { css } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X, Phone, Calendar } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassDock, glassMenu } from '@/styles/glass';
import { LOGO_SRC, SITE_NAV } from '@/lib/site';
import { Button } from '@/components/ui/button';

const Shell = styled.div`
  position: relative;
  z-index: 90;
  height: ${({ theme }) => theme.layout.header};
`;

const StaticBar = styled.header`
  position: absolute;
  inset: 0 0 auto;
  height: 100%;
  z-index: 1;
  background: linear-gradient(180deg, rgba(10, 10, 13, 0.72) 0%, rgba(8, 8, 10, 0.32) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const FloatingBar = styled.header`
  position: fixed;
  top: 10px;
  left: 12px;
  right: 12px;
  z-index: 95;
  border-radius: 18px;
  ${glassDock}
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-130%);
  transition:
    opacity 220ms ease,
    transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 360ms;

  ${media.reduce} {
    transition: none;
  }

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
      transition:
        opacity 220ms ease,
        transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
        visibility 0s;
    `}
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.container};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
  height: ${({ $floating, theme }) => ($floating ? '68px' : theme.layout.header)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: height 320ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 559px) {
    height: ${({ $floating, theme }) => ($floating ? '62px' : theme.layout.header)};
  }

  ${media.reduce} {
    transition: none;
  }
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

  ${media.xl} {
    white-space: nowrap;
  }

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
  top: calc(100% - 2px);
  ${({ $align }) => ($align === 'right' ? 'right: -24px;' : 'left: -24px;')}
  min-width: 300px;
  padding: 18px;
  ${glassMenu}
  border-radius: 14px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;

  ${media.reduce} {
    transition: none;
  }

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
    border-radius: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.smoke};
    transition: background 140ms ease, color 140ms ease;

    &:hover {
      background: rgba(255, 255, 255, 0.07);
      color: ${({ theme }) => theme.colors.white};
    }

    span {
      color: ${({ theme }) => theme.colors.dim};
      font-size: 11px;
    }
  }

  .all {
    margin-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.white};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: border-color 160ms ease, background 160ms ease;

  &:hover {
    border-color: rgba(242, 106, 13, 0.5);
    background: rgba(242, 106, 13, 0.1);
  }

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: rgba(18, 18, 22, 0.9);
  }

  ${media.lg} {
    display: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 22px var(--mobile-gutter, 22px) 40px;
  background:
    radial-gradient(120% 80% at 90% 0%, rgba(242, 106, 13, 0.12), transparent 55%),
    linear-gradient(180deg, rgba(8, 8, 10, 0.9), rgba(8, 8, 10, 0.82));
  -webkit-backdrop-filter: blur(20px) saturate(130%);
  backdrop-filter: blur(20px) saturate(130%);

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: #08080a;
  }
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
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      // Hysteresis keeps the dock from flickering around the threshold.
      setFloating((current) => (current ? y > 24 : y > 80));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
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

  const content = (variant) => (
    <Inner $floating={variant === 'floating'}>
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
          <Button
            href="/book"
            size="sm"
            icon={false}
            leftIcon={<Calendar size={15} strokeWidth={1.9} aria-hidden="true" />}
          >
            Book a service
          </Button>
        </BookDesktop>
        <MenuButton type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu size={20} />
        </MenuButton>
      </Actions>
    </Inner>
  );

  return (
    <>
      <Shell>
        <StaticBar aria-hidden={floating} inert={floating}>
          {content('static')}
        </StaticBar>
      </Shell>

      <FloatingBar
        $visible={floating}
        aria-hidden={floating ? undefined : 'true'}
        inert={floating ? undefined : true}
      >
        {content('floating')}
      </FloatingBar>

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
              <Button
                href="/book"
                onClick={() => setOpen(false)}
                leftIcon={<Calendar size={16} strokeWidth={1.9} aria-hidden="true" />}
              >
                Book a service
              </Button>
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
