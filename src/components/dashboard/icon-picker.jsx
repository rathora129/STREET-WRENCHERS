'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Check, Search, X } from 'lucide-react';
import { CategoryIcon, ICON_GROUPS, ICON_LIBRARY } from '@/components/ui/icon';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TriggerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PreviewBox = styled.span`
  width: 44px;
  height: 44px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  background: ${({ theme }) => theme.colors.brandWash};
  color: ${({ theme }) => theme.colors.brand};
`;

const Current = styled.span`
  flex: 1;
  min-width: 140px;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.smoke};
  line-height: 1.45;

  strong {
    display: block;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
  }

  small {
    display: block;
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

const SmallButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.white};
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.ink};
  padding: 12px;
  max-height: 340px;
  overflow-y: auto;
`;

const SearchRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 11px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.dim};

  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.white};
    font-family: inherit;
    font-size: 12.5px;
    outline: none;

    &::placeholder { color: ${({ theme }) => theme.colors.dim}; }
  }
`;

const GroupTitle = styled.p`
  margin: 12px 2px 7px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 6px;
`;

const IconButton = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 66px;
  padding: 8px 4px;
  border-radius: 7px;
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(242,106,13,0.75)' : 'rgba(255,255,255,0.1)')};
  background: ${({ $selected }) => ($selected ? 'rgba(242,106,13,0.12)' : 'rgba(255,255,255,0.02)')};
  color: ${({ $selected, theme }) => ($selected ? theme.colors.brand : theme.colors.smoke)};
  cursor: pointer;
  font-family: inherit;

  span {
    font-size: 9.5px;
    line-height: 1.2;
    text-align: center;
    color: ${({ $selected, theme }) => ($selected ? theme.colors.white : theme.colors.muted)};
  }

  svg.tick {
    position: absolute;
    top: 4px;
    right: 4px;
    color: ${({ theme }) => theme.colors.brand};
  }

  &:hover {
    border-color: rgba(242, 106, 13, 0.6);
    background: rgba(242, 106, 13, 0.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 1px;
  }
`;

const Empty = styled.p`
  padding: 14px 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

export function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = ICON_LIBRARY.find((icon) => icon.name === value);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ICON_GROUPS;
    return ICON_GROUPS.map((group) => ({
      group: group.group,
      icons: group.icons.filter(
        (icon) =>
          icon.name.includes(term) ||
          icon.label.toLowerCase().includes(term) ||
          icon.group.toLowerCase().includes(term),
      ),
    })).filter((group) => group.icons.length);
  }, [query]);

  function choose(name) {
    onChange(name);
    setOpen(false);
    setQuery('');
  }

  return (
    <Wrap>
      <TriggerRow>
        <PreviewBox>
          <CategoryIcon name={value} size={22} />
        </PreviewBox>
        <Current>
          <strong>{selected ? selected.label : 'Default workshop icon'}</strong>
          <small>{value ? `Icon key: ${value}` : 'No icon selected — the wrench icon is used'}</small>
        </Current>
        <SmallButton type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
          {open ? 'Close picker' : 'Choose icon'}
        </SmallButton>
        {value ? (
          <SmallButton type="button" onClick={() => onChange('')} aria-label="Clear selected icon">
            <X size={13} /> Clear
          </SmallButton>
        ) : null}
      </TriggerRow>

      {open ? (
        <Panel>
          <SearchRow>
            <Search size={14} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons by name or group…"
              aria-label="Search icon library"
            />
          </SearchRow>
          {groups.length ? (
            groups.map((group) => (
              <div key={group.group}>
                <GroupTitle>{group.group}</GroupTitle>
                <Grid>
                  {group.icons.map((icon) => {
                    const isSelected = icon.name === value;
                    return (
                      <IconButton
                        key={icon.name}
                        type="button"
                        $selected={isSelected}
                        aria-pressed={isSelected}
                        onClick={() => choose(icon.name)}
                      >
                        <CategoryIcon name={icon.name} size={20} />
                        <span>{icon.label}</span>
                        {isSelected ? <Check size={12} className="tick" aria-hidden="true" /> : null}
                      </IconButton>
                    );
                  })}
                </Grid>
              </div>
            ))
          ) : (
            <Empty>No icons match “{query}”. Try a different term.</Empty>
          )}
        </Panel>
      ) : null}
    </Wrap>
  );
}
