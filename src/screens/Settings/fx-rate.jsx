import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useFxRate } from '@/hooks/useFxRate';
import { useSetFxRate } from '@/hooks/useSetFxRate';
import useNotification from '@/hooks/useNotification';

const MIN_RATE = 100;
const MAX_RATE = 10000;

export default function FxRateScreen() {
  const { data: rateResponse, isLoading } = useFxRate();
  const { mutate: updateRate, isPending: isSaving } = useSetFxRate();
  const [notifySuccess, notifyError] = useNotification();

  const currentRate = rateResponse?.body || null;
  const [rateInput, setRateInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (currentRate?.usdToNgnRate) setRateInput(String(currentRate.usdToNgnRate));
  }, [currentRate?.usdToNgnRate]);

  const parsedRate = parseInt(rateInput, 10);
  const previewValid = !isNaN(parsedRate) && parsedRate >= MIN_RATE && parsedRate <= MAX_RATE;

  const validate = () => {
    if (!rateInput.trim()) { setValidationError('Please enter a rate.'); return false; }
    if (isNaN(parsedRate) || !Number.isInteger(parsedRate)) { setValidationError('Rate must be a whole number.'); return false; }
    if (parsedRate < MIN_RATE || parsedRate > MAX_RATE) { setValidationError(`Rate must be between ${MIN_RATE} and ${MAX_RATE.toLocaleString()}.`); return false; }
    setValidationError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    updateRate({ usdToNgnRate: parsedRate, note: noteInput.trim() }, {
      onSuccess: () => notifySuccess(`Exchange rate updated: $1 = ₦${parsedRate.toLocaleString()}`),
      onError: (err) => notifyError(err?.response?.data?.message || 'Failed to update exchange rate'),
    });
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>

      {/* Header */}
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>Exchange Rate Settings</h2>
        <p style={{ margin: 0, fontSize: '.84rem', color: '#6b7280' }}>Set the NGN/USD rate used across all product prices, cart totals, and payments.</p>
      </div>

      {/* Current rate banner */}
      {currentRate ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>Current Rate</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
              ₦{currentRate.usdToNgnRate?.toLocaleString()}
            </span>
            <span style={{ fontSize: '.9rem', color: '#6b7280' }}>per $1 USD</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {currentRate.note && <span style={{ fontSize: '.78rem', color: '#6b7280', fontStyle: 'italic' }}>"{currentRate.note}"</span>}
            {currentRate.updatedAt && (
              <span style={{ fontSize: '.78rem', color: '#9ca3af' }}>
                Updated {new Date(currentRate.updatedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 10 }}>
          <span>⚠️</span>
          <p style={{ margin: 0, fontSize: '.84rem', color: '#92400e' }}>No rate set. The system uses the default fallback of ₦1,355/$1.</p>
        </div>
      )}

      {/* Update form */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
        <p style={{ margin: '0 0 20px', fontSize: '.88rem', fontWeight: 700, color: '#111827' }}>Update Rate</p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Rate (₦ per $1 USD)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', height: 44, border: `1px solid ${validationError ? '#dc2626' : '#e2e8f0'}`, borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
            <span style={{ padding: '0 14px', fontSize: '.9rem', fontWeight: 600, color: '#6b7280', borderRight: '1px solid #e2e8f0', background: '#f1f5f9', height: '100%', display: 'flex', alignItems: 'center' }}>₦</span>
            <input
              type="number" min={MIN_RATE} max={MAX_RATE} step="1" placeholder="e.g. 1350"
              value={rateInput}
              onChange={(e) => { setRateInput(e.target.value); setValidationError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              style={{ flex: 1, height: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '0 14px', fontSize: '.9rem', color: '#111827', fontFamily: 'inherit' }}
            />
          </div>
          {validationError ? (
            <p style={{ margin: '5px 0 0', fontSize: '.75rem', color: '#dc2626' }}>{validationError}</p>
          ) : previewValid ? (
            <p style={{ margin: '5px 0 0', fontSize: '.75rem', color: '#16a34a' }}>
              $1 USD = ₦{parsedRate.toLocaleString()} · $100 = ₦{(parsedRate * 100).toLocaleString()}
            </p>
          ) : (
            <p style={{ margin: '5px 0 0', fontSize: '.75rem', color: '#9ca3af' }}>
              Allowed range: {MIN_RATE}–{MAX_RATE.toLocaleString()}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Note (optional)</label>
          <textarea
            placeholder="e.g. CBN official rate — May 2026"
            maxLength={200}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            style={{ width: '100%', height: 80, border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: '.84rem', color: '#374151', fontFamily: 'inherit', resize: 'vertical', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
          />
          <p style={{ margin: '4px 0 0', fontSize: '.72rem', color: '#9ca3af' }}>{noteInput.length}/200 characters</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            style={{ height: 42, padding: '0 28px', background: 'var(--oosriPrimary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? .65 : 1, fontFamily: 'inherit' }}
          >
            {isSaving ? 'Saving…' : 'Update Rate'}
          </button>
        </div>
      </div>
    </div>
  );
}
