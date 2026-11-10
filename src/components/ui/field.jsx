'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';

export const FormGrid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(${({ $cols }) => $cols || 2}, minmax(0, 1fr));
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.smoke};
  position: relative;
`;

export const LabelText = styled.span`
  font-weight: 500;
  letter-spacing: 0.02em;

  em {
    color: ${({ theme }) => theme.colors.brand};
    font-style: normal;
    margin-left: 4px;
  }
`;

const control = `
  width: 100%;
  min-height: 50px;
  padding: 13px 15px;
  background: #0c0c0f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: #f6f5f2;
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 160ms ease, background 160ms ease;
  appearance: none;

  &::placeholder { color: #5f5d58; }

  &:focus {
    outline: none;
    border-color: #f26a0d;
    background: #0f0f13;
  }

  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const Input = styled.input`
  ${control}
`;

export const Textarea = styled.textarea`
  ${control}
  min-height: ${({ $rows }) => ($rows ? `${$rows * 26 + 28}px` : '120px')};
  resize: vertical;
`;

export const Select = styled.select`
  ${control}
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2396938d' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 38px;
  cursor: pointer;

  option { background: #101014; color: #f6f5f2; }
`;

export const FieldError = styled.span`
  color: #ff7b7f;
  font-size: 12px;
  line-height: 1.4;
`;

export const HelpText = styled.span`
  color: ${({ theme }) => theme.colors.dim};
  font-size: 11.5px;
  line-height: 1.5;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.smoke};
  cursor: pointer;

  input {
    width: 17px;
    height: 17px;
    margin-top: 1px;
    accent-color: ${({ theme }) => theme.colors.brand};
    flex: none;
    cursor: pointer;
  }
`;

export const FormStatus = styled.div`
  padding: 13px 16px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.55;
  border: 1px solid ${({ $tone }) =>
    $tone === 'success' ? 'rgba(52,185,129,0.4)' : $tone === 'error' ? 'rgba(229,72,77,0.4)' : 'rgba(242,106,13,0.4)'};
  background: ${({ $tone }) =>
    $tone === 'success' ? 'rgba(52,185,129,0.08)' : $tone === 'error' ? 'rgba(229,72,77,0.08)' : 'rgba(242,106,13,0.08)'};
  color: ${({ $tone }) =>
    $tone === 'success' ? '#77d9b2' : $tone === 'error' ? '#ff9a9d' : '#ffb07a'};
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(20px, 3vw, 32px);
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
`;

export const FormTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;
