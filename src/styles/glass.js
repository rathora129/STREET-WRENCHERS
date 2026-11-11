import { css } from 'styled-components';
import { media } from '@/styles/theme';

const noBlur = `@supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px)))`;

/**
 * Shared glass surfaces. Blur is reserved for floating layers and dialogs;
 * cards use translucent gradients with inset highlights so large grids stay
 * inexpensive to scroll, especially on mobile.
 */
export const glassDock = css`
  background:
    radial-gradient(120% 140% at 82% -30%, rgba(242, 106, 13, 0.1), transparent 58%),
    linear-gradient(155deg, rgba(24, 24, 29, 0.86), rgba(11, 11, 14, 0.8));
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 18px 46px rgba(0, 0, 0, 0.45),
    0 8px 40px rgba(242, 106, 13, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);

  ${noBlur} {
    background:
      radial-gradient(120% 140% at 82% -30%, rgba(242, 106, 13, 0.08), transparent 58%),
      linear-gradient(155deg, rgba(20, 20, 24, 0.97), rgba(9, 9, 12, 0.97));
  }
`;

export const glassMenu = css`
  background:
    radial-gradient(120% 140% at 82% -30%, rgba(242, 106, 13, 0.09), transparent 58%),
    linear-gradient(155deg, rgba(18, 18, 23, 0.97), rgba(9, 9, 12, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);

  ${noBlur} {
    background:
      radial-gradient(120% 140% at 82% -30%, rgba(242, 106, 13, 0.07), transparent 58%),
      linear-gradient(155deg, #131318, #09090c);
  }
`;

export const glassPanel = css`
  background:
    radial-gradient(130% 110% at 88% -20%, rgba(242, 106, 13, 0.07), transparent 56%),
    linear-gradient(155deg, rgba(26, 26, 32, 0.68), rgba(13, 13, 17, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
  backdrop-filter: blur(14px) saturate(135%);

  ${noBlur} {
    background:
      radial-gradient(130% 110% at 88% -20%, rgba(242, 106, 13, 0.06), transparent 56%),
      linear-gradient(155deg, rgba(22, 22, 27, 0.96), rgba(12, 12, 15, 0.96));
  }
`;

export const glassCard = css`
  background:
    radial-gradient(130% 120% at 88% -25%, rgba(242, 106, 13, 0.075), transparent 58%),
    linear-gradient(155deg, rgba(25, 25, 31, 0.66), rgba(12, 12, 16, 0.56));
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.045);

  ${noBlur} {
    background:
      radial-gradient(130% 120% at 88% -25%, rgba(242, 106, 13, 0.05), transparent 58%),
      linear-gradient(155deg, #17171c, #0d0d11);
  }
`;

export const glassFeature = css`
  background:
    radial-gradient(130% 120% at 90% -20%, rgba(242, 106, 13, 0.16), transparent 60%),
    linear-gradient(160deg, rgba(38, 26, 20, 0.72), rgba(14, 13, 16, 0.62));
  border: 1px solid rgba(242, 106, 13, 0.4);
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.34),
    0 0 42px rgba(242, 106, 13, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);

  ${noBlur} {
    background:
      radial-gradient(130% 120% at 90% -20%, rgba(242, 106, 13, 0.12), transparent 60%),
      linear-gradient(160deg, #241a14, #0e0d10);
  }
`;

export const glassField = css`
  background: rgba(10, 10, 13, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  ${noBlur} { background: #0c0c0f; }
`;

export const glassOverlay = css`
  background: rgba(5, 5, 8, 0.82);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  backdrop-filter: blur(16px) saturate(120%);

  ${noBlur} { background: rgba(5, 5, 8, 0.97); }
`;

export const glassHover = css`
  ${media.hover} {
    &:hover {
      border-color: rgba(242, 106, 13, 0.42);
      box-shadow:
        0 24px 56px rgba(0, 0, 0, 0.4),
        0 0 42px rgba(242, 106, 13, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }
  }
`;
