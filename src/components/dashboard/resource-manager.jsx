'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Download,
  GripVertical,
  Inbox,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import * as UI from './ui';
import { IconPicker } from './icon-picker';
import { HelpTip } from './help';
import { formatPrice, toDateInputValue } from '@/lib/utils';

const PageFlash = styled.div`
  margin-bottom: 14px;
`;

const ReorderGlobalStyle = createGlobalStyle`
  body.sw-reorder-active {
    cursor: grabbing;
    user-select: none;
  }

  body.sw-reorder-active * {
    cursor: grabbing !important;
  }
`;

const ReorderHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.dim};
  line-height: 1.4;

  svg { color: ${({ theme }) => theme.colors.brand}; flex: none; }

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

const DragHandle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 30px;
  margin-left: -5px;
  border-radius: 5px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.colors.dim};
  cursor: grab;
  touch-action: none;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.line};
    background: rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled) { cursor: grabbing; }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 2px;
  }

  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const ReorderTableWrap = styled(UI.TableWrap)`
  tbody tr[data-reorder-row] { transition: background 120ms ease; }

  tbody tr.is-dragging td {
    background: rgba(242, 106, 13, 0.07);
    border-top: 1px dashed rgba(242, 106, 13, 0.7);
    border-bottom: 1px dashed rgba(242, 106, 13, 0.7);
  }

  tbody tr.is-dragging td:first-child { border-left: 1px dashed rgba(242, 106, 13, 0.7); }
  tbody tr.is-dragging td:last-child { border-right: 1px dashed rgba(242, 106, 13, 0.7); }
  tbody tr.is-dragging td > * { opacity: 0.4; }

  tbody tr.is-dragging:last-child td { border-bottom: 1px dashed rgba(242, 106, 13, 0.7); }

  @media (prefers-reduced-motion: reduce) {
    tbody tr[data-reorder-row] { transition: none; }
  }
`;

const DragGhost = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 260px;
  padding: 9px 13px;
  border-radius: 8px;
  border: 1px solid rgba(242, 106, 13, 0.55);
  background: rgba(18, 18, 23, 0.97);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  transform: translate(-50%, -135%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg { color: ${({ theme }) => theme.colors.brand}; flex: none; }
  span { overflow: hidden; text-overflow: ellipsis; }
`;

const ImageRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-wrap: wrap;

  ${UI.Control} { flex: 1; min-width: 150px; }
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding-inline: 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.smoke};
  font-size: 11.5px;
  cursor: pointer;
  white-space: nowrap;

  input { display: none; }
  &:hover { border-color: ${({ theme }) => theme.colors.brand}; color: ${({ theme }) => theme.colors.white}; }
`;

const Preview = styled.span`
  display: block;
  width: 100%;
  max-width: 230px;
  aspect-ratio: 16 / 9;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 6px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.ink};
  margin-top: 8px;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const UploadError = styled.span`
  display: block;
  margin-top: 5px;
  font-size: 11px;
  color: #ff9a9d;
  line-height: 1.45;
`;

async function api(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed');
    error.details = payload.details || [];
    throw error;
  }
  return payload.data;
}

function getPath(object, path) {
  return path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), object);
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

export function ResourceManager({
  resource,
  title,
  eyebrow = 'Manage',
  description,
  columns,
  fields,
  filters = [],
  searchPlaceholder = 'Search records…',
  canCreate = true,
  canEdit = true,
  canDelete = true,
  createDefaults = {},
  payloadDefaults = {},
  fixedFilters = {},
  rowActions,
  exportable = false,
  createLabel = 'New record',
  emptyTitle = 'Nothing here yet',
  emptyBody = 'Records you add will appear in this list.',
  modalWide = false,
  helpTopic = null,
  reorder = null,
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filters.map((filter) => [filter.name, filter.defaultValue || 'ALL'])),
  );
  const [editor, setEditor] = useState(null);
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirming, setConfirming] = useState(null);
  const [flash, setFlash] = useState(null);
  const [orderPreview, setOrderPreview] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragLabel, setDragLabel] = useState('');
  const rowRefs = useRef(new Map());
  const dragRef = useRef(null);
  const flipTopsRef = useRef(null);
  const ghostRef = useRef(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 320);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(timer);
  }, [flash]);

  const needsOptions = useMemo(
    () =>
      fields.some((field) => field.optionsFrom) ||
      filters.some((filter) => filter.optionsFrom),
    [fields, filters],
  );

  const optionsQuery = useQuery({
    queryKey: ['admin-options'],
    queryFn: () => api('/api/admin/options'),
    enabled: needsOptions,
    staleTime: 120_000,
  });

  const listParams = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), perPage: '20' });
    if (term) params.set('q', term);
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value !== 'ALL') params.set(key, value);
    }
    for (const [key, value] of Object.entries(fixedFilters)) {
      if (value !== undefined && value !== null && value !== '') params.set(key, value);
    }
    return params.toString();
  }, [page, term, filterValues, fixedFilters]);

  const listQuery = useQuery({
    queryKey: ['admin', resource, listParams],
    queryFn: () => api(`/api/admin/${resource}?${listParams}`),
    placeholderData: (previous) => previous,
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      api(`/api/admin/${resource}${editor?.mode === 'edit' ? `/${editor.row.id}` : ''}`, {
        method: editor?.mode === 'edit' ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      const wasEditing = editor?.mode === 'edit';
      setEditor(null);
      setFieldErrors({});
      setFormError('');
      setFlash({ tone: 'success', text: wasEditing ? `${title} updated.` : `${title} created.` });
      queryClient.invalidateQueries({ queryKey: ['admin', resource] });
      queryClient.invalidateQueries({ queryKey: ['admin-options'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
    onError: (error) => {
      setFormError(error.message);
      const errors = {};
      for (const detail of error.details || []) {
        if (detail.field) errors[detail.field] = detail.message;
      }
      setFieldErrors(errors);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api(`/api/admin/${resource}/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setConfirming(null);
      setFlash({ tone: 'success', text: `${title} deleted.` });
      queryClient.invalidateQueries({ queryKey: ['admin', resource] });
      queryClient.invalidateQueries({ queryKey: ['admin-options'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
    onError: (error) => {
      setConfirming(null);
      setFlash({ tone: 'error', text: error.message });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ orderedIds, previousIds }) =>
      api(reorder.endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ ...(reorder.scope || {}), orderedIds, previousIds }),
      }),
  });

  const items = listQuery.data?.items || [];
  const pagination = listQuery.data?.pagination || { page, perPage: 20, total: 0, totalPages: 1 };

  const reorderEnabled = Boolean(reorder?.endpoint);
  const hasActiveFilters = Object.entries(filterValues).some(([, value]) => value && value !== 'ALL');
  const reorderAllowed =
    reorderEnabled &&
    items.length > 1 &&
    !term &&
    !hasActiveFilters &&
    pagination.totalPages <= 1 &&
    items.length === pagination.total;
  const reorderBusy = reorderMutation.isPending;

  const displayItems = useMemo(() => {
    if (!orderPreview) return items;
    const byId = new Map(items.map((item) => [item.id, item]));
    return orderPreview.map((id) => byId.get(id)).filter(Boolean);
  }, [items, orderPreview]);

  useEffect(() => {
    setOrderPreview(null);
  }, [listParams]);

  useEffect(
    () => () => {
      const drag = dragRef.current;
      if (drag?.handlers) {
        window.removeEventListener('pointermove', drag.handlers.move);
        window.removeEventListener('pointerup', drag.handlers.end);
        window.removeEventListener('pointercancel', drag.handlers.end);
        window.removeEventListener('keydown', drag.handlers.key, true);
      }
      if (drag?.autoFrame) cancelAnimationFrame(drag.autoFrame);
      dragRef.current = null;
      document.body.classList.remove('sw-reorder-active');
    },
    [],
  );

  useLayoutEffect(() => {
    if (draggingId && ghostRef.current) {
      paintGhost(lastPointerRef.current.x, lastPointerRef.current.y);
    }
  }, [draggingId]);

  useLayoutEffect(() => {
    const previousTops = flipTopsRef.current;
    flipTopsRef.current = null;
    if (!previousTops || !previousTops.size) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const animated = [];
    for (const [id, top] of previousTops) {
      const element = rowRefs.current.get(id);
      if (!element) continue;
      const delta = top - element.getBoundingClientRect().top;
      if (Math.abs(delta) < 1) continue;
      element.style.transition = 'none';
      element.style.transform = `translateY(${delta}px)`;
      animated.push(element);
    }
    if (!animated.length) return undefined;

    const frame = requestAnimationFrame(() => {
      for (const element of animated) {
        element.style.transition = 'transform 170ms cubic-bezier(0.2, 0.8, 0.2, 1)';
        element.style.transform = '';
      }
    });
    const timer = setTimeout(() => {
      for (const element of animated) {
        element.style.transition = '';
        element.style.transform = '';
      }
    }, 240);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [orderPreview]);

  function reorderLabel(row) {
    if (reorder?.getLabel) return reorder.getLabel(row);
    return row.key || row.heading || row.title || row.name || 'Item';
  }

  function paintGhost(x, y) {
    lastPointerRef.current = { x, y };
    const element = ghostRef.current;
    if (!element) return;
    const half = element.offsetWidth / 2;
    const minX = half + 8;
    const maxX = Math.max(minX, window.innerWidth - half - 8);
    element.style.left = `${Math.min(Math.max(x, minX), maxX)}px`;
    element.style.top = `${y}px`;
  }

  function captureRowTops(order) {
    const tops = new Map();
    for (const id of order) {
      const element = rowRefs.current.get(id);
      if (element) tops.set(id, element.getBoundingClientRect().top);
    }
    return tops;
  }

  function placeDragged(drag, clientY) {
    const remaining = drag.order.filter((id) => id !== drag.id);
    let target = 0;
    for (const id of drag.order) {
      if (id === drag.id) continue;
      const element = rowRefs.current.get(id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (clientY > rect.top + rect.height / 2) target += 1;
    }
    if (target === drag.order.indexOf(drag.id)) return;

    const next = remaining.slice();
    next.splice(target, 0, drag.id);
    drag.order = next;
    flipTopsRef.current = captureRowTops(next);
    setOrderPreview(next);
  }

  function autoScrollStep() {
    const drag = dragRef.current;
    if (!drag || !drag.active) return;
    if (!drag.autoSpeed) {
      drag.autoFrame = null;
      return;
    }
    window.scrollBy(0, drag.autoSpeed);
    placeDragged(drag, drag.lastY);
    drag.autoFrame = requestAnimationFrame(autoScrollStep);
  }

  function handleDragMove(event) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    drag.lastY = event.clientY;
    paintGhost(event.clientX, event.clientY);

    if (!drag.active) {
      if (Math.abs(event.clientY - drag.startY) < 6) return;
      drag.active = true;
      setDraggingId(drag.id);
      document.body.classList.add('sw-reorder-active');
    }

    const edge = 84;
    if (event.clientY < edge) {
      drag.autoSpeed = -Math.ceil(((edge - event.clientY) / edge) * 18);
    } else if (event.clientY > window.innerHeight - edge) {
      drag.autoSpeed = Math.ceil(((event.clientY - (window.innerHeight - edge)) / edge) * 18);
    } else {
      drag.autoSpeed = 0;
    }

    placeDragged(drag, event.clientY);

    if (drag.autoSpeed && !drag.autoFrame) drag.autoFrame = requestAnimationFrame(autoScrollStep);
  }

  function finishDrag() {
    const drag = dragRef.current;
    if (drag?.handlers) {
      window.removeEventListener('pointermove', drag.handlers.move);
      window.removeEventListener('pointerup', drag.handlers.end);
      window.removeEventListener('pointercancel', drag.handlers.end);
      window.removeEventListener('keydown', drag.handlers.key, true);
    }
    if (drag?.autoFrame) cancelAnimationFrame(drag.autoFrame);
    dragRef.current = null;
    document.body.classList.remove('sw-reorder-active');
    setDraggingId(null);
  }

  function handleDragEnd(event) {
    const drag = dragRef.current;
    if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;

    finishDrag();
    if (!drag.active) {
      setOrderPreview(null);
      return;
    }

    const previousOrder = drag.previousOrder;
    const nextOrder = drag.order;
    if (nextOrder.join('|') === previousOrder.join('|')) {
      setOrderPreview(null);
      return;
    }
    commitOrder(nextOrder, previousOrder);
  }

  function handleDragKey(event) {
    if (!dragRef.current || event.key !== 'Escape') return;
    finishDrag();
    setOrderPreview(null);
  }

  function startDrag(event, row) {
    if (!reorderAllowed || reorderBusy || event.button > 0) return;
    event.preventDefault();

    const order = (orderPreview || items.map((item) => item.id)).slice();
    if (order.length < 2 || !order.includes(row.id)) return;

    const handlers = { move: handleDragMove, end: handleDragEnd, key: handleDragKey };
    dragRef.current = {
      pointerId: event.pointerId,
      id: row.id,
      startY: event.clientY,
      lastY: event.clientY,
      active: false,
      autoSpeed: 0,
      autoFrame: null,
      order,
      previousOrder: items.map((item) => item.id),
      handlers,
    };
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    setDragLabel(reorderLabel(row));

    window.addEventListener('pointermove', handlers.move, { passive: false });
    window.addEventListener('pointerup', handlers.end);
    window.addEventListener('pointercancel', handlers.end);
    window.addEventListener('keydown', handlers.key, true);
  }

  async function commitOrder(orderedIds, previousIds) {
    setOrderPreview(orderedIds);
    try {
      await reorderMutation.mutateAsync({ orderedIds, previousIds });
      queryClient.setQueryData(['admin', resource, listParams], (current) => {
        if (!current?.items) return current;
        const byId = new Map(current.items.map((item) => [item.id, item]));
        return { ...current, items: orderedIds.map((id) => byId.get(id)).filter(Boolean) };
      });
      setOrderPreview(null);
      setFlash({ tone: 'success', text: 'Order saved. The website now uses this sequence.' });
      queryClient.invalidateQueries({ queryKey: ['admin', resource] });
    } catch (error) {
      setOrderPreview(null);
      setFlash({ tone: 'error', text: `Could not save the new order: ${error.message}` });
    }
  }

  function handleKeyReorder(event, row) {
    if (!reorderAllowed || reorderBusy) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();

    const persisted = items.map((item) => item.id);
    const order = (orderPreview || persisted).slice();
    const index = order.indexOf(row.id);
    const target = event.key === 'ArrowUp' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= order.length) return;

    const next = order.slice();
    next.splice(index, 1);
    next.splice(target, 0, row.id);
    flipTopsRef.current = captureRowTops(next);
    commitOrder(next, persisted);
  }

  function optionsFor(field) {
    if (Array.isArray(field.options)) {
      return field.options.map((option) =>
        typeof option === 'string' ? { value: option, label: option } : option,
      );
    }
    if (field.optionsFrom) {
      const source = optionsQuery.data?.[field.optionsFrom] || [];
      return source.map((item) => ({
        value: item.id,
        label: field.optionLabel?.(item) || item.label || item.name || item.title || item.slug || item.id,
      }));
    }
    return [];
  }

  function initialValues(mode, row) {
    const next = {};
    for (const field of fields) {
      if (mode === 'edit' && row) {
        const raw = field.getValue ? field.getValue(row) : getPath(row, field.name);
        if (field.type === 'checkbox') next[field.name] = Boolean(raw);
        else if (field.type === 'multi-relation') next[field.name] = Array.isArray(raw) ? raw.map((item) => (typeof item === 'object' ? item.id : item)) : [];
        else if (field.type === 'tags' || field.type === 'images') next[field.name] = Array.isArray(raw) ? raw.join(', ') : raw || '';
        else if (field.type === 'json') next[field.name] = raw && typeof raw === 'object' ? JSON.stringify(raw, null, 2) : raw || '';
        else if (field.type === 'date') next[field.name] = raw ? toDateInputValue(raw) : '';
        else next[field.name] = raw === null || raw === undefined ? '' : raw;
      } else if (field.defaultValue !== undefined) {
        next[field.name] = field.defaultValue;
      } else if (mode === 'create' && createDefaults[field.name] !== undefined) {
        next[field.name] = createDefaults[field.name];
      } else {
        next[field.name] = field.type === 'checkbox' ? false : '';
      }
    }
    return next;
  }

  function openCreate() {
    setEditor({ mode: 'create', row: null });
    setValues(initialValues('create'));
    setFieldErrors({});
    setFormError('');
  }

  function openEdit(row) {
    setEditor({ mode: 'edit', row });
    setValues(initialValues('edit', row));
    setFieldErrors({});
    setFormError('');
  }

  function updateValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function buildPayload() {
    const payload = { ...payloadDefaults };
    for (const field of fields) {
      if (!(field.name in values)) continue;
      let value = values[field.name];
      if (field.type === 'checkbox') value = Boolean(value);
      else if (field.type === 'number') value = value === '' || value === null || value === undefined ? null : Number(value);
      else if (field.type === 'tags' || field.type === 'images') {
        value = String(value || '')
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean);
      } else if (field.type === 'multi-relation') value = Array.isArray(value) ? value : [];
      else if (field.type === 'json') {
        if (!String(value || '').trim()) value = null;
        else {
          try {
            value = JSON.parse(value);
          } catch {
            throw new Error(`${field.label} must be valid JSON`);
          }
        }
      } else if (field.type === 'date') value = value || null;
      else if (field.type === 'relation') value = value || null;
      else value = cleanString(value);
      payload[field.name] = value;
    }
    return payload;
  }

  function submit(event) {
    event.preventDefault();
    setFormError('');
    setFieldErrors({});
    try {
      saveMutation.mutate(buildPayload());
    } catch (error) {
      setFormError(error.message);
    }
  }

  function renderField(field) {
    const value = values[field.name] ?? '';
    const error = fieldErrors[field.name];
    const label = (
      <span className="label">
        {field.label}
        {field.required ? <em>*</em> : null}
      </span>
    );

    if (field.type === 'checkbox') {
      return (
        <div className={field.span === 2 ? 'span-2' : ''} key={field.name}>
          <UI.CheckControl>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => updateValue(field.name, event.target.checked)}
            />
            <span>
              {field.label}
              {field.help ? <span className="help" style={{ display: 'block' }}>{field.help}</span> : null}
            </span>
          </UI.CheckControl>
        </div>
      );
    }

    return (
      <UI.FieldBlock className={field.span === 2 ? 'span-2' : ''} key={field.name}>
        {label}
        {field.type === 'select' || field.type === 'relation' ? (
          <UI.SelectControl
            value={value}
            onChange={(event) => updateValue(field.name, event.target.value)}
            required={field.required}
          >
            <option value="">{field.placeholder || 'Select…'}</option>
            {optionsFor(field).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </UI.SelectControl>
        ) : field.type === 'multi-relation' ? (
          <UI.SelectControl
            multiple
            size={Math.min(8, optionsFor(field).length || 4)}
            value={Array.isArray(value) ? value : []}
            onChange={(event) =>
              updateValue(field.name, Array.from(event.target.selectedOptions).map((option) => option.value))
            }
          >
            {optionsFor(field).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </UI.SelectControl>
        ) : field.type === 'textarea' || field.type === 'longtext' || field.type === 'tags' || field.type === 'images' || field.type === 'json' ? (
          <UI.TextControl
            value={value}
            rows={field.rows || (field.type === 'longtext' ? 10 : field.type === 'json' ? 8 : 4)}
            placeholder={field.placeholder}
            onChange={(event) => updateValue(field.name, event.target.value)}
            required={field.required}
          />
        ) : field.type === 'icon' ? (
          <IconPicker value={value} onChange={(next) => updateValue(field.name, next)} />
        ) : field.type === 'image' ? (
          <ImageField
            field={field}
            value={value}
            onChange={(next) => updateValue(field.name, next)}
          />
        ) : (
          <UI.Control
            type={
              field.type === 'number'
                ? 'number'
                : field.type === 'date'
                  ? 'date'
                  : field.type === 'time'
                    ? 'time'
                    : field.type === 'email'
                      ? 'email'
                      : field.type === 'url'
                        ? 'url'
                        : 'text'
            }
            step={field.step || (field.type === 'number' ? 'any' : undefined)}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateValue(field.name, event.target.value)}
            required={field.required}
          />
        )}
        {field.help ? <span className="help">{field.help}</span> : null}
        {error ? <span className="error">{error}</span> : null}
      </UI.FieldBlock>
    );
  }

  function renderCell(row, column) {
    if (column.render) return column.render(row);
    const value = getPath(row, column.key);
    if (column.type === 'date') return UI.formatDateCell(value);
    if (column.type === 'datetime') return UI.formatDateTimeCell(value);
    if (column.type === 'price') return value === null || value === undefined ? '—' : formatPrice(value);
    if (column.type === 'boolean') {
      return <UI.ToneBadge $tone={value ? 'success' : 'neutral'}>{value ? 'Yes' : 'No'}</UI.ToneBadge>;
    }
    if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
    if (value === null || value === undefined || value === '') return '—';
    if (column.subKey) {
      const sub = getPath(row, column.subKey);
      return (
        <>
          <span className="primary">{String(value)}</span>
          {sub ? <span className="sub">{String(sub)}</span> : null}
        </>
      );
    }
    return String(value);
  }

  const hasActions = canEdit || canDelete || Boolean(rowActions);

  return (
    <>
      {reorderEnabled ? <ReorderGlobalStyle /> : null}
      {draggingId ? (
        <DragGhost ref={ghostRef} aria-hidden="true">
          <GripVertical size={14} />
          <span>{dragLabel}</span>
        </DragGhost>
      ) : null}
      <UI.PageHead>
        <UI.HeadText>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </UI.HeadText>
        <UI.HeadActions>
          {helpTopic ? <HelpTip topicId={helpTopic} /> : null}
          {exportable ? (
            <UI.DashButton
              as="a"
              href={`/api/admin/export?resource=${resource}&${listParams}`}
              $small
              title="Download a CSV of the current view"
            >
              <Download size={14} /> CSV
            </UI.DashButton>
          ) : null}
          {canCreate ? (
            <UI.DashButton $variant="primary" $small onClick={openCreate} type="button">
              <Plus size={15} /> {createLabel}
            </UI.DashButton>
          ) : null}
        </UI.HeadActions>
      </UI.PageHead>

      {flash ? (
        <PageFlash>
          <UI.Notice $tone={flash.tone}>{flash.text}</UI.Notice>
        </PageFlash>
      ) : null}

      <UI.Panel>
        <UI.Toolbar>
          <UI.SearchWrap>
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </UI.SearchWrap>
          {filters.map((filter) => (
            <UI.FilterSelect
              key={filter.name}
              value={filterValues[filter.name]}
              onChange={(event) => {
                setFilterValues((current) => ({ ...current, [filter.name]: event.target.value }));
                setPage(1);
              }}
              aria-label={filter.label}
            >
              <option value="ALL">{filter.allLabel || `All ${filter.label.toLowerCase()}`}</option>
              {(filter.optionsFrom
                ? (optionsQuery.data?.[filter.optionsFrom] || []).map((item) => ({
                    value: item.id,
                    label: item.label || item.name || item.title,
                  }))
                : (filter.options || []).map((option) =>
                    typeof option === 'string' ? { value: option, label: option } : option,
                  )
              ).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </UI.FilterSelect>
          ))}
          {reorderEnabled ? (
            reorderAllowed ? (
              <ReorderHint>
                <GripVertical size={13} /> Drag rows to reorder — changes save automatically
              </ReorderHint>
            ) : (
              <ReorderHint>
                {items.length < 2
                  ? 'Add at least two sections to reorder.'
                  : pagination.totalPages > 1
                    ? 'Reordering needs all records on one page.'
                    : 'Clear search and filters to reorder.'}
              </ReorderHint>
            )
          ) : null}
          {reorderBusy ? <UI.ToneBadge $tone="info">Saving order…</UI.ToneBadge> : null}
        </UI.Toolbar>

        {listQuery.isLoading ? (
          <UI.StateBox>
            <UI.Spinner />
            <p>Loading {title.toLowerCase()}…</p>
          </UI.StateBox>
        ) : listQuery.isError ? (
          <UI.StateBox>
            <AlertTriangle size={24} />
            <h3>Could not load records</h3>
            <p>{listQuery.error.message}</p>
            <UI.DashButton $small onClick={() => listQuery.refetch()}>Try again</UI.DashButton>
          </UI.StateBox>
        ) : items.length === 0 ? (
          <UI.StateBox>
            <Inbox size={26} />
            <h3>{emptyTitle}</h3>
            <p>{emptyBody}</p>
            {canCreate ? (
              <UI.DashButton $variant="primary" $small onClick={openCreate} type="button">
                <Plus size={14} /> {createLabel}
              </UI.DashButton>
            ) : null}
          </UI.StateBox>
        ) : (
          <ReorderTableWrap $min={(columns.length + (reorderEnabled ? 1 : 0)) > 6 ? '980px' : '760px'}>
            <table>
              <thead>
                <tr>
                  {reorderEnabled ? (
                    <th style={{ width: 44 }} aria-label="Reorder" />
                  ) : null}
                  {columns.map((column) => (
                    <th key={column.key} style={column.width ? { width: column.width } : undefined}>
                      {column.label}
                    </th>
                  ))}
                  {hasActions ? <th style={{ textAlign: 'right' }}>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {displayItems.map((row) => (
                  <tr
                    key={row.id}
                    data-reorder-row={reorderEnabled ? '' : undefined}
                    className={row.id === draggingId ? 'is-dragging' : undefined}
                    ref={(element) => {
                      if (!reorderEnabled) return;
                      if (element) rowRefs.current.set(row.id, element);
                      else rowRefs.current.delete(row.id);
                    }}
                  >
                    {reorderEnabled ? (
                      <td>
                        <DragHandle
                          type="button"
                          title="Drag to reorder"
                          aria-label={`Move ${reorderLabel(row)} up or down`}
                          disabled={!reorderAllowed || reorderBusy}
                          onPointerDown={(event) => startDrag(event, row)}
                          onKeyDown={(event) => handleKeyReorder(event, row)}
                        >
                          <GripVertical size={15} />
                        </DragHandle>
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td key={column.key} className={column.align === 'right' ? 'numeric' : undefined}>
                        {renderCell(row, column)}
                      </td>
                    ))}
                    {hasActions ? (
                      <td>
                        <div className="actions">
                          {rowActions ? rowActions(row) : null}
                          {canEdit ? (
                            <UI.RowButton type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.name || row.title || row.reference || 'record'}`}>
                              <Pencil size={12} /> Edit
                            </UI.RowButton>
                          ) : null}
                          {canDelete ? (
                            <UI.RowButton
                              type="button"
                              $danger
                              onClick={() => setConfirming(row)}
                              aria-label="Delete record"
                            >
                              <Trash2 size={12} />
                            </UI.RowButton>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </ReorderTableWrap>
        )}

        {pagination.total > 0 ? (
          <UI.Pagination>
            <span>
              {pagination.total} record{pagination.total === 1 ? '' : 's'} · Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="controls">
              <UI.DashButton
                $small
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </UI.DashButton>
              <UI.DashButton
                $small
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </UI.DashButton>
            </div>
          </UI.Pagination>
        ) : null}
      </UI.Panel>

      <UI.Modal
        open={Boolean(editor)}
        onClose={() => {
          if (!saveMutation.isPending) setEditor(null);
        }}
        title={`${editor?.mode === 'edit' ? 'Edit' : 'New'} ${title.replace(/s$/, '').toLowerCase()}`}
        description={editor?.mode === 'edit' ? 'Update the record and save your changes.' : 'Fill in the fields below to create a new record.'}
        wide={modalWide}
        footer={
          <>
            <UI.DashButton type="button" $small onClick={() => setEditor(null)} disabled={saveMutation.isPending}>
              Cancel
            </UI.DashButton>
            <UI.DashButton
              type="submit"
              form="resource-form"
              $variant="primary"
              $small
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save changes'}
            </UI.DashButton>
          </>
        }
      >
        <form id="resource-form" onSubmit={submit}>
          {formError ? (
            <div style={{ marginBottom: 14 }}>
              <UI.Notice $tone="error">{formError}</UI.Notice>
            </div>
          ) : null}
          <UI.FormGrid>{fields.map(renderField)}</UI.FormGrid>
        </form>
      </UI.Modal>

      <UI.Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete this record?"
        description="This action cannot be undone. Related website content may also be affected."
        footer={
          <>
            <UI.DashButton $small type="button" onClick={() => setConfirming(null)}>
              Keep record
            </UI.DashButton>
            <UI.DashButton
              $small
              $variant="danger"
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(confirming.id)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}
            </UI.DashButton>
          </>
        }
      >
        <p style={{ fontSize: 13, color: '#cbc8c2', lineHeight: 1.7 }}>
          {confirming?.name || confirming?.title || confirming?.reference || confirming?.slug || confirming?.id}
        </p>
      </UI.Modal>
    </>
  );
}

function ImageField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file) {
    setError('');
    setUploading(true);
    try {
      const signature = await api('/api/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ folder: field.folder || 'library' }),
      });

      const data = new FormData();
      data.append('file', file);
      data.append('api_key', signature.apiKey);
      data.append('timestamp', String(signature.timestamp));
      data.append('folder', signature.folder);
      data.append('signature', signature.signature);

      const response = await fetch(signature.uploadUrl, { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Cloudinary upload failed');

      onChange(result.secure_url);
      await api('/api/admin/media', {
        method: 'POST',
        body: JSON.stringify({
          url: result.secure_url,
          publicId: result.public_id,
          filename: result.original_filename ? `${result.original_filename}.${result.format}` : file.name,
          alt: '',
          mimeType: file.type,
          width: result.width,
          height: result.height,
          size: result.bytes,
          folder: field.folder || 'library',
        }),
      });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <ImageRow>
        <UI.Control
          value={value}
          placeholder="Paste an image URL or upload"
          onChange={(event) => onChange(event.target.value)}
        />
        <UploadLabel>
          <UploadCloud size={14} />
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = '';
            }}
          />
        </UploadLabel>
      </ImageRow>
      {value ? (
        <Preview>
          <img src={value} alt="" />
        </Preview>
      ) : null}
      {error ? <UploadError>{error}</UploadError> : null}
    </>
  );
}
