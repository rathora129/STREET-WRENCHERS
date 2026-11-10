'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { media } from '@/styles/theme';
import { LOGO_SRC, BUSINESS } from '@/lib/site';
import { LoginForm } from './login-form';

const Shell = styled.div`
  min-height: 100svh;
  display: grid;
  background: ${({ theme }) => theme.colors.ink};

  ${media.lg} {
    grid-template-columns: 1.05fr 1fr;
  }
`;

const BrandPanel = styled.div`
  position: relative;
  display: none;
  overflow: hidden;
  padding: clamp(32px, 5vw, 64px);
  align-items: flex-end;
  isolation: isolate;

  ${media.lg} {
    display: flex;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba(8,8,10,0.35) 0%, rgba(8,8,10,0.8) 70%, #08080a 100%),
      linear-gradient(90deg, rgba(8,8,10,0.2), rgba(8,8,10,0.7));
  }

  img.bg { object-fit: cover; z-index: -2; }
`;

const BrandContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 520px;

  h1 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 14px;
    line-height: 1.7;
    max-width: 46ch;
  }

  a {
    color: ${({ theme }) => theme.colors.brand};
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
`;

const FormPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(28px, 5vw, 64px) clamp(22px, 5vw, 72px);
  background: ${({ theme }) => theme.colors.ink};
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const LogoRow = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;

  span.logo {
    position: relative;
    width: 56px;
    height: 56px;
    display: block;
  }

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 14px;
    letter-spacing: 0.22em;
    color: ${({ theme }) => theme.colors.white};
  }

  small {
    display: block;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-top: 4px;
  }
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(1.7rem, 3vw, 2.2rem);
    letter-spacing: -0.03em;
  }

  p {
    font-size: 13.5px;
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.65;
  }
`;

const Note = styled.p`
  font-size: 11.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.dim};
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  padding-top: 18px;
`;

export function LoginView() {
  return (
    <Shell>
      <BrandPanel>
        <Image
          src="/assets/images/hero/workshop.jpg"
          alt=""
          fill
          className="bg"
          sizes="55vw"
          priority
        />
        <BrandContent>
          <h1>Workshop operations, in one place.</h1>
          <p>
            Bookings, customers, services and website content for {BUSINESS.name} — managed from a single secure
            dashboard.
          </p>
          <Link href="/">← Back to the website</Link>
        </BrandContent>
      </BrandPanel>

      <FormPanel>
        <FormInner>
          <LogoRow href="/">
            <span className="logo">
              <Image src={LOGO_SRC} alt="Street Wrenchers" fill sizes="56px" style={{ objectFit: 'contain' }} />
            </span>
            <span>
              <strong>STREET WRENCHERS</strong>
              <small>Owner dashboard</small>
            </span>
          </LogoRow>

          <Head>
            <h2>Sign in.</h2>
            <p>Single owner access. There is no public registration or customer login.</p>
          </Head>

          <LoginForm />

          <Note>
            Access is limited to the workshop owner account. Sessions are database-backed and expire automatically.
          </Note>
        </FormInner>
      </FormPanel>
    </Shell>
  );
}
