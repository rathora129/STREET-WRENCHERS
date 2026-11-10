'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Check, Copy, Image as ImageIcon, Link2, Search, Trash2, UploadCloud } from 'lucide-react';
import {
  Control,
  DashButton,
  FieldBlock,
  Modal,
  Notice,
  PageHead,
  HeadText,
  Panel,
  SearchWrap,
  StateBox,
  Spinner,
} from './ui';

const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  padding: 16px;
`;

const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 9px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.coal};

  .preview {
    position: relative;
    aspect-ratio: 4 / 3;
    background: ${({ theme }) => theme.colors.ink};
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.colors.dim};

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .meta {
    padding: 10px 11px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .name { font-size: 11.5px; color: ${({ theme }) => theme.colors.white}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .folder { font-size: 10px; color: ${({ theme }) => theme.colors.dim}; }

  .actions {
    display: flex;
    gap: 5px;
    padding: 0 11px 11px;

    button { flex: 1; height: 28px; font-size: 10.5px; }
  }
`;

const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px;
  padding: 28px 20px;
  border: 1px dashed ${({ theme }) => theme.colors.lineStrong};
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.coal};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;

  input { display: none; }
  strong { color: ${({ theme }) => theme.colors.white}; font-size: 13px; }
  span { font-size: 11.5px; }
  &:hover { border-color: ${({ theme }) => theme.colors.brand}; background: ${({ theme }) => theme.colors.charcoal}; }
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

export function MediaLibrary() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [editing, setEditing] = useState(null);
  const [editAlt, setEditAlt] = useState('');
  const [editFolder, setEditFolder] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ url: '', filename: '', alt: '', folder: 'library' });

  const query = useQuery({
    queryKey: ['admin-media', search],
    queryFn: () => api(`/api/admin/media?perPage=100${search ? `&q=${encodeURIComponent(search)}` : ''}`),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      api(`/api/admin/media/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: () => {
      setEditing(null);
      setFlash('Media details updated.');
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
    onError: (mutationError) => setError(mutationError.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api(`/api/admin/media/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setFlash('Media record removed.');
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
    onError: (mutationError) => setError(mutationError.message),
  });

  const createLinkMutation = useMutation({
    mutationFn: (payload) => api('/api/admin/media', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      setLinkOpen(false);
      setLinkForm({ url: '', filename: '', alt: '', folder: 'library' });
      setFlash('Media record added.');
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    },
    onError: (mutationError) => setError(mutationError.message),
  });

  const items = query.data?.items || [];

  async function uploadFiles(files) {
    if (!files.length) return;
    setError('');
    setUploading(true);
    try {
      const signature = await api('/api/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ folder: 'library' }),
      });

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);

        const data = new FormData();
        data.append('file', file);
        data.append('api_key', signature.apiKey);
        data.append('timestamp', String(signature.timestamp));
        data.append('folder', signature.folder);
        data.append('signature', signature.signature);

        const response = await fetch(signature.uploadUrl, { method: 'POST', body: data });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || `Could not upload ${file.name}`);

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
            folder: 'library',
          }),
        });
      }

      setFlash(`${files.length} image${files.length === 1 ? '' : 's'} uploaded.`);
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
      setProgress('');
    }
  }

  async function copy(item) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(''), 1800);
    } catch {
      setError('Could not copy to clipboard. Select the URL manually.');
    }
  }

  const folders = useMemo(() => {
    const set = new Set(items.map((item) => item.folder).filter(Boolean));
    return Array.from(set);
  }, [items]);

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Website content</span>
          <h1>Media library</h1>
          <p>
            Upload images to Cloudinary and copy their URLs into services, banners, blog posts and pages. Vercel’s
            filesystem is never used for uploads.
          </p>
        </HeadText>
        <DashButton $small type="button" onClick={() => setLinkOpen(true)}>
          <Link2 size={14} /> Add by URL
        </DashButton>
      </PageHead>

      {flash ? <div style={{ marginBottom: 14 }}><Notice $tone="success">{flash}</Notice></div> : null}
      {error ? <div style={{ marginBottom: 14 }}><Notice $tone="error">{error}</Notice></div> : null}
      {uploading ? <div style={{ marginBottom: 14 }}><Notice>{progress || 'Uploading…'}</Notice></div> : null}

      <Panel>
        <UploadZone>
          <UploadCloud size={22} />
          <strong>{uploading ? 'Upload in progress…' : 'Upload images'}</strong>
          <span>Select one or more images. They are stored in Cloudinary under your configured folder.</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(event) => {
              uploadFiles(Array.from(event.target.files || []));
              event.target.value = '';
            }}
          />
        </UploadZone>

        <div style={{ padding: '0 16px 14px' }}>
          <SearchWrap>
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search media by filename, alt text or folder…"
              aria-label="Search media"
            />
          </SearchWrap>
        </div>

        {query.isLoading ? (
          <StateBox><Spinner /><p>Loading media…</p></StateBox>
        ) : items.length === 0 ? (
          <StateBox>
            <ImageIcon size={26} />
            <h3>No media yet</h3>
            <p>Upload images above, or add an existing Cloudinary or external image URL.</p>
          </StateBox>
        ) : (
          <Grid>
            {items.map((item) => (
              <Card key={item.id}>
                <div className="preview">
                  {item.mimeType?.startsWith('image') || /\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(item.url) ? (
                    <img src={item.url} alt={item.alt || item.filename} loading="lazy" />
                  ) : (
                    <ImageIcon size={22} />
                  )}
                </div>
                <div className="meta">
                  <span className="name" title={item.filename}>{item.filename}</span>
                  <span className="folder">{item.folder || 'library'}{item.width && item.height ? ` · ${item.width}×${item.height}` : ''}</span>
                </div>
                <div className="actions">
                  <DashButton type="button" $small onClick={() => copy(item)}>
                    {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === item.id ? 'Copied' : 'URL'}
                  </DashButton>
                  <DashButton
                    type="button"
                    $small
                    onClick={() => {
                      setEditing(item);
                      setEditAlt(item.alt || '');
                      setEditFolder(item.folder || 'library');
                    }}
                  >
                    Edit
                  </DashButton>
                  <DashButton
                    type="button"
                    $small
                    $variant="danger"
                    onClick={() => {
                      if (window.confirm(`Remove “${item.filename}” from the media library? The Cloudinary file itself is not deleted.`)) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    aria-label="Delete media record"
                  >
                    <Trash2 size={12} />
                  </DashButton>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </Panel>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit media details"
        description={editing?.filename}
        footer={
          <>
            <DashButton $small type="button" onClick={() => setEditing(null)}>Cancel</DashButton>
            <DashButton
              $small
              $variant="primary"
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate({ alt: editAlt, folder: editFolder || 'library' })}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save details'}
            </DashButton>
          </>
        }
      >
        <FieldBlock>
          <span className="label">Alt text</span>
          <Control value={editAlt} onChange={(event) => setEditAlt(event.target.value)} placeholder="Describe the image" />
        </FieldBlock>
        <div style={{ height: 12 }} />
        <FieldBlock>
          <span className="label">Folder</span>
          <Control value={editFolder} onChange={(event) => setEditFolder(event.target.value)} placeholder="library" />
          {folders.length ? <span className="help">Existing folders: {folders.join(', ')}</span> : null}
        </FieldBlock>
      </Modal>

      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Add media by URL"
        description="Use this for images already hosted in Cloudinary or elsewhere."
        footer={
          <>
            <DashButton $small type="button" onClick={() => setLinkOpen(false)}>Cancel</DashButton>
            <DashButton
              $small
              $variant="primary"
              type="button"
              disabled={createLinkMutation.isPending || !linkForm.url || !linkForm.filename}
              onClick={() => createLinkMutation.mutate(linkForm)}
            >
              {createLinkMutation.isPending ? 'Adding…' : 'Add media'}
            </DashButton>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FieldBlock>
            <span className="label">Image URL <em>*</em></span>
            <Control value={linkForm.url} onChange={(event) => setLinkForm({ ...linkForm, url: event.target.value })} placeholder="https://res.cloudinary.com/…" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">Filename <em>*</em></span>
            <Control value={linkForm.filename} onChange={(event) => setLinkForm({ ...linkForm, filename: event.target.value })} placeholder="workshop-hero.jpg" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">Alt text</span>
            <Control value={linkForm.alt} onChange={(event) => setLinkForm({ ...linkForm, alt: event.target.value })} />
          </FieldBlock>
          <FieldBlock>
            <span className="label">Folder</span>
            <Control value={linkForm.folder} onChange={(event) => setLinkForm({ ...linkForm, folder: event.target.value })} placeholder="library" />
          </FieldBlock>
        </div>
      </Modal>
    </>
  );
}
