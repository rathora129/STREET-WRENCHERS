'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  CHECKLIST_STORAGE_KEY,
  GETTING_STARTED,
  HELP_FAQS,
  HELP_GROUPS,
  HELP_TOPICS,
} from '@/lib/dashboard-guide';
import {
  DashButton,
  HeadActions,
  HeadText,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
} from '@/components/dashboard/ui';

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;

  svg {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.dim};
  }

  input {
    width: 100%;
    height: 44px;
    padding: 0 14px 0 40px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.white};
    font-size: 13px;
  }

  input::placeholder { color: ${({ theme }) => theme.colors.dim}; }
  input:focus { outline: 2px solid rgba(242, 106, 13, 0.45); outline-offset: 1px; border-color: ${({ theme }) => theme.colors.brand}; }
`;

const Split = styled.div`
  display: grid;
  gap: 18px;
  align-items: start;

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 1fr) 340px;
  }
`;

const Topic = styled.article`
  scroll-margin-top: 90px;

  & + & { margin-top: 14px; }

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 17px;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.white};
  }

  .summary {
    margin: 7px 0 0;
    font-size: 12.5px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.muted};
  }

  .label {
    display: block;
    margin: 16px 0 6px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  .purpose {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.smoke};
  }

  ol {
    margin: 0;
    padding-left: 19px;
    display: grid;
    gap: 7px;
    font-size: 12.8px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.smoke};
  }

  li::marker { color: ${({ theme }) => theme.colors.brand}; font-weight: 700; }

  .effect {
    margin-top: 15px;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid rgba(242, 106, 13, 0.24);
    background: rgba(242, 106, 13, 0.06);
    font-size: 12px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.smoke};
  }

  .effect b {
    display: block;
    margin-bottom: 3px;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  .open {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.brand};
  }

  .open:hover { color: ${({ theme }) => theme.colors.brandBright}; }
`;

const GroupTitle = styled.h2`
  margin: 26px 0 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};

  &:first-child { margin-top: 0; }
`;

const Side = styled.aside`
  display: grid;
  gap: 16px;

  @media (min-width: 1100px) {
    position: sticky;
    top: 84px;
  }
`;

const Progress = styled.div`
  margin-bottom: 12px;

  .track {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .track span {
    display: block;
    height: 100%;
    background: ${({ theme }) => theme.colors.brand};
    border-radius: 999px;
    transition: width 200ms ease;
  }

  p {
    margin: 8px 0 0;
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const CheckList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 9px;
`;

const CheckItem = styled.li`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 9px;
  align-items: start;

  input {
    appearance: none;
    width: 19px;
    height: 19px;
    margin: 1px 0 0;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.lineStrong};
    background: ${({ theme }) => theme.colors.ink};
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  input:checked {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
  }

  input:checked::after {
    content: '';
    width: 5px;
    height: 9px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-1px, -1px);
  }

  input:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 2px; }

  label {
    font-size: 12.3px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.smoke};
    cursor: pointer;
  }

  label a {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.brand};
  }

  label small {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.dim};
  }

  ${({ $done, theme }) =>
    $done &&
    `
    label { color: ${theme.colors.dim}; text-decoration: line-through; }
    label small { text-decoration: none; }
  `}
`;

const Faq = styled.details`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.ink};
  overflow: hidden;

  & + & { margin-top: 8px; }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker { display: none; }
  summary:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: -2px; }

  &[open] summary svg { transform: rotate(180deg); }
  summary svg { flex: none; color: ${({ theme }) => theme.colors.dim}; transition: transform 160ms ease; }

  p {
    margin: 0;
    padding: 0 14px 14px;
    font-size: 12.2px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Empty = styled.div`
  padding: 32px 8px;
  text-align: center;

  svg { color: ${({ theme }) => theme.colors.dim}; margin-bottom: 10px; }
  h3 { margin: 0 0 6px; font-size: 15px; color: ${({ theme }) => theme.colors.white}; }
  p { margin: 0; font-size: 12.5px; color: ${({ theme }) => theme.colors.muted}; }
`;

function matches(topic, query) {
  if (!query) return true;
  const haystack = [topic.title, topic.summary, topic.purpose, topic.effect, ...topic.steps].join(' ').toLowerCase();
  return haystack.includes(query);
}

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [done, setDone] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(CHECKLIST_STORAGE_KEY) || '[]');
      if (Array.isArray(stored)) setDone(stored);
    } catch {
      setDone([]);
    }
  }, []);

  const query = search.trim().toLowerCase();
  const filtered = useMemo(() => HELP_TOPICS.filter((topic) => matches(topic, query)), [query]);
  const groups = HELP_GROUPS.map((group) => ({
    group,
    topics: filtered.filter((topic) => topic.group === group),
  })).filter((section) => section.topics.length);

  const toggle = (id) => {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore storage restrictions */
      }
      return next;
    });
  };

  const percent = Math.round((done.length / GETTING_STARTED.length) * 100);

  const startTour = () => {
    window.dispatchEvent(new CustomEvent('sw:start-tour'));
  };

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Guide</span>
          <h1>Help centre</h1>
          <p>
            Everything you can manage in the dashboard, explained. Search a topic, follow the steps, work through the
            getting-started checklist or replay the guided walkthrough at any time.
          </p>
        </HeadText>
        <HeadActions>
          <DashButton type="button" $variant="primary" onClick={startTour}>
            <PlayCircle size={15} aria-hidden="true" /> Replay walkthrough
          </DashButton>
        </HeadActions>
      </PageHead>

      <SearchBar>
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search modules, tasks or questions…"
          aria-label="Search help topics"
        />
      </SearchBar>

      <Split>
        <div>
          {groups.length ? (
            groups.map((section) => (
              <section key={section.group} aria-label={`${section.group} help topics`}>
                <GroupTitle>{section.group}</GroupTitle>
                {section.topics.map((topic) => (
                  <Panel key={topic.id} id={`topic-${topic.id}`} as="section" style={{ marginBottom: 12 }}>
                    <PanelBody style={{ padding: '20px 22px' }}>
                      <Topic>
                        <h3>{topic.title}</h3>
                        <p className="summary">{topic.summary}</p>
                        <span className="label">What it is for</span>
                        <p className="purpose">{topic.purpose}</p>
                        <span className="label">How to use it</span>
                        <ol>
                          {topic.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        <div className="effect">
                          <b>What changes on the website</b>
                          {topic.effect}
                        </div>
                        <Link className="open" href={topic.href}>
                          Open {topic.title} <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </Topic>
                    </PanelBody>
                  </Panel>
                ))}
              </section>
            ))
          ) : (
            <Empty>
              <CircleHelp size={26} aria-hidden="true" />
              <h3>No topics match “{search.trim()}”</h3>
              <p>Try a shorter phrase such as “booking”, “icon”, “banner” or “price”.</p>
            </Empty>
          )}

          <Panel style={{ marginTop: 22 }}>
            <PanelHead>
              <h2>Frequently asked questions</h2>
              <BookOpen size={16} style={{ color: '#96938d' }} aria-hidden="true" />
            </PanelHead>
            <PanelBody>
              {HELP_FAQS.map((faq) => (
                <Faq key={faq.question}>
                  <summary>
                    {faq.question}
                    <ChevronDown size={15} aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </Faq>
              ))}
            </PanelBody>
          </Panel>
        </div>

        <Side>
          <Panel>
            <PanelHead>
              <h2>Getting started</h2>
              <Sparkles size={15} style={{ color: '#f26a0d' }} aria-hidden="true" />
            </PanelHead>
            <PanelBody>
              <Progress>
                <div className="track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Setup progress">
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p>{done.length} of {GETTING_STARTED.length} complete{percent === 100 ? ' — your site is ready to review.' : '.'}</p>
              </Progress>
              <CheckList>
                {GETTING_STARTED.map((item) => {
                  const checked = done.includes(item.id);
                  return (
                    <CheckItem key={item.id} $done={checked}>
                      <input
                        id={`check-${item.id}`}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item.id)}
                      />
                      <label htmlFor={`check-${item.id}`}>
                        {item.label}
                        <small>{item.note}</small>
                        <Link href={item.href}>Open module</Link>
                      </label>
                    </CheckItem>
                  );
                })}
              </CheckList>
              <p style={{ margin: '14px 0 0', fontSize: 10.5, lineHeight: 1.55, color: '#8a867f' }}>
                The checklist is a personal prompt stored in this browser. It does not change your website.
              </p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHead><h2>Need a refresher?</h2></PanelHead>
            <PanelBody>
              <p style={{ margin: '0 0 12px', fontSize: 12.3, lineHeight: 1.65, color: '#cbc8c2' }}>
                The guided walkthrough covers the 12 core modules in about a minute. It only opens automatically once
                and never interrupts you again unless you replay it here.
              </p>
              <DashButton type="button" onClick={startTour} style={{ width: '100%' }}>
                <PlayCircle size={15} aria-hidden="true" /> Start walkthrough
              </DashButton>
            </PanelBody>
          </Panel>
        </Side>
      </Split>
    </>
  );
}
