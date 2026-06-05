'use client';

import { useState, KeyboardEvent } from 'react';
import styles from './WaitlistForm.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <span className={styles.dot} />
        You&rsquo;re on the list. We&rsquo;ll be in touch.
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pill}>
        <input
          className={styles.input}
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={status === 'loading'}
          autoComplete="email"
        />
        <button
          className={styles.button}
          onClick={submit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? <span className={styles.spinner} /> : 'Join waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
