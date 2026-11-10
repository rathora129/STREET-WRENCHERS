'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Lock, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import {
  Control,
  DashButton,
  FieldBlock,
  HeadText,
  Notice,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  Spinner,
  StateBox,
  TableWrap,
  ToneBadge,
  formatDateTimeCell,
} from '@/components/dashboard/ui';

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

export default function SecurityPage() {
  const queryClient = useQueryClient();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordFlash, setPasswordFlash] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [sessionFlash, setSessionFlash] = useState('');

  const sessionsQuery = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => api('/api/admin/sessions'),
  });

  const passwordMutation = useMutation({
    mutationFn: (payload) => api('/api/admin/password', { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => {
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordFlash('Password updated. All other sessions have been signed out.');
      setPasswordError('');
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
    onError: (error) => {
      setPasswordFlash('');
      setPasswordError(
        error.details?.length
          ? error.details.map((detail) => detail.message).join(' · ')
          : error.message,
      );
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => api('/api/admin/sessions', { method: 'DELETE' }),
    onSuccess: (data) => {
      setSessionFlash(`${data.revoked} other session${data.revoked === 1 ? '' : 's'} signed out.`);
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
    onError: (error) => setSessionFlash(error.message),
  });

  const revokeMutation = useMutation({
    mutationFn: (id) => api(`/api/admin/sessions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      setSessionFlash('Session signed out.');
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
    onError: (error) => setSessionFlash(error.message),
  });

  const sessions = sessionsQuery.data || [];

  function submitPassword(event) {
    event.preventDefault();
    setPasswordFlash('');
    setPasswordError('');
    passwordMutation.mutate(passwords);
  }

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">System</span>
          <h1>Security & sessions</h1>
          <p>
            Owner-only access, database-backed sessions and scrypt password hashing. Sessions expire after seven days
            and can be revoked individually.
          </p>
        </HeadText>
      </PageHead>

      <div style={{ display: 'grid', gap: 18 }}>
        <Notice>
          There is no public registration. The owner account is created by the idempotent seed script from environment
          variables. Changing the password here revokes every other session immediately.
        </Notice>

        {sessionsQuery.isLoading ? (
          <Panel><PanelBody><StateBox><Spinner /><p>Loading sessions…</p></StateBox></PanelBody></Panel>
        ) : sessionsQuery.isError ? (
          <Panel><PanelBody><StateBox><h3>Could not load sessions</h3><p>{sessionsQuery.error.message}</p></StateBox></PanelBody></Panel>
        ) : (
          <Panel>
            <PanelHead>
              <h2>Active & recent sessions</h2>
              <DashButton
                $small
                $variant="danger"
                type="button"
                disabled={revokeAllMutation.isPending || sessions.filter((session) => !session.current && session.active).length === 0}
                onClick={() => {
                  if (window.confirm('Sign out all other sessions? This cannot be undone.')) revokeAllMutation.mutate();
                }}
              >
                Sign out other sessions
              </DashButton>
            </PanelHead>
            {sessionFlash ? <div style={{ padding: '12px 16px 0' }}><Notice $tone="success">{sessionFlash}</Notice></div> : null}
            <TableWrap $min="760px">
              <table>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>IP address</th>
                    <th>Signed in</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <span className="primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MonitorSmartphone size={13} /> {session.current ? 'This device' : 'Owner device'}
                        </span>
                        <span className="sub">{session.userAgent ? session.userAgent.slice(0, 80) : 'Unknown browser'}</span>
                      </td>
                      <td>{session.ipAddress || '—'}</td>
                      <td>{formatDateTimeCell(session.createdAt)}</td>
                      <td>{formatDateTimeCell(session.expiresAt)}</td>
                      <td>
                        <ToneBadge $tone={session.current ? 'success' : session.active ? 'info' : 'neutral'}>
                          {session.current ? 'Current' : session.revokedAt ? 'Revoked' : session.active ? 'Active' : 'Expired'}
                        </ToneBadge>
                      </td>
                      <td>
                        <div className="actions">
                          {!session.current && session.active ? (
                            <DashButton
                              $small
                              $variant="danger"
                              type="button"
                              disabled={revokeMutation.isPending}
                              onClick={() => revokeMutation.mutate(session.id)}
                            >
                              Revoke
                            </DashButton>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Panel>
        )}

        <Panel>
          <PanelHead>
            <h2>Change owner password</h2>
            <KeyRound size={15} />
          </PanelHead>
          <PanelBody>
            {passwordFlash ? <div style={{ marginBottom: 14 }}><Notice $tone="success">{passwordFlash}</Notice></div> : null}
            {passwordError ? <div style={{ marginBottom: 14 }}><Notice $tone="error">{passwordError}</Notice></div> : null}

            <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
              <FieldBlock>
                <span className="label">Current password</span>
                <Control
                  type="password"
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })}
                  required
                />
              </FieldBlock>
              <FieldBlock>
                <span className="label">New password</span>
                <Control
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
                  required
                />
                <span className="help">At least 10 characters, including a letter and a number.</span>
              </FieldBlock>
              <FieldBlock>
                <span className="label">Confirm new password</span>
                <Control
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirmPassword}
                  onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })}
                  required
                />
              </FieldBlock>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <DashButton $variant="primary" $small type="submit" disabled={passwordMutation.isPending}>
                  <Lock size={14} /> {passwordMutation.isPending ? 'Updating…' : 'Update password'}
                </DashButton>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#66645f' }}>
                  <ShieldCheck size={12} /> Hashed with scrypt. Never stored in plain text.
                </span>
              </div>
            </form>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
