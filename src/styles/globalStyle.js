'use client';

import { createGlobalStyle } from 'styled-components';
import { media } from './theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    ${media.reduce} { scroll-behavior: auto; }
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 600;
    line-height: 1.06;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  p { margin: 0; }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  button { cursor: pointer; }

  img, svg, video { display: block; max-width: 100%; }

  ul, ol { margin: 0; padding: 0; list-style: none; }

  ::selection {
    background: ${({ theme }) => theme.colors.brand};
    color: #fff;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 3px;
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.ink}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceRaised};
    border-radius: 999px;
    border: 2px solid ${({ theme }) => theme.colors.ink};
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sw-skip-link {
    position: absolute;
    left: -9999px;
    top: 12px;
    z-index: 999;
    background: ${({ theme }) => theme.colors.brand};
    color: #fff;
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 600;
  }
  .sw-skip-link:focus { left: 12px; }

  input[type='date'], input[type='time'] { color-scheme: dark; }
`;
