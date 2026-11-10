'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const List = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

const Item = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;

const Trigger = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  background: transparent;
  border: 0;
  text-align: left;
  color: ${({ theme, $open }) => ($open ? theme.colors.white : theme.colors.smoke)};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 500;
  line-height: 1.4;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  span.icon {
    flex: none;
    width: 32px;
    height: 32px;
    border: 1px solid ${({ theme, $open }) => ($open ? theme.colors.brand : theme.colors.lineStrong)};
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: ${({ theme, $open }) => ($open ? theme.colors.brand : theme.colors.muted)};
    transition: transform ${({ theme }) => theme.transitions.base}, border-color ${({ theme }) => theme.transitions.base};
    transform: rotate(${({ $open }) => ($open ? '45deg' : '0deg')});
  }
`;

const Answer = styled(motion.div)`
  overflow: hidden;
`;

const AnswerInner = styled.div`
  padding: 0 56px 26px 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-line;
`;

export function Accordion({ items = [], defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <List>
      {items.map((item, index) => {
        const isOpen = open === index;
        const question = item.question || item.title;
        const answer = item.answer || item.content;

        return (
          <Item key={item.id || question}>
            <Trigger
              type="button"
              $open={isOpen}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              {question}
              <span className="icon">
                <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </Trigger>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <Answer
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
                >
                  <AnswerInner>{answer}</AnswerInner>
                </Answer>
              ) : null}
            </AnimatePresence>
          </Item>
        );
      })}
    </List>
  );
}
