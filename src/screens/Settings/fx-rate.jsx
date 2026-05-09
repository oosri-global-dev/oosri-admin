import { useState, useEffect } from 'react';
import { FxRateWrapper } from './fx-rate.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import CustomLoader from '@/components/lib/CustomLoader';
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

    // Pre-fill the input with the current rate when it loads
    useEffect(() => {
        if (currentRate?.usdToNgnRate) {
            setRateInput(String(currentRate.usdToNgnRate));
        }
    }, [currentRate?.usdToNgnRate]);

    const parsedRate = parseInt(rateInput, 10);
    const previewValid = !isNaN(parsedRate) && parsedRate >= MIN_RATE && parsedRate <= MAX_RATE;

    function validate() {
        if (!rateInput.trim()) {
            setValidationError('Please enter a rate.');
            return false;
        }
        if (isNaN(parsedRate) || !Number.isInteger(parsedRate)) {
            setValidationError('Rate must be a whole number (e.g. 1350).');
            return false;
        }
        if (parsedRate < MIN_RATE || parsedRate > MAX_RATE) {
            setValidationError(`Rate must be between ${MIN_RATE} and ${MAX_RATE.toLocaleString()}.`);
            return false;
        }
        setValidationError('');
        return true;
    }

    function handleSubmit() {
        if (!validate()) {
            return;
        }

        try {
            updateRate(
                { usdToNgnRate: parsedRate, note: noteInput.trim() },
                {
                    onSuccess: () => {
                        notifySuccess(`Exchange rate updated: $1 = ₦${parsedRate.toLocaleString()}`);
                    },
                    onError: (err) => {
                        console.error('[FxRate] API Error Caught by onError hook:', err);
                        console.error('Error Response:', err?.response?.data);
                        const msg = err?.response?.data?.message || 'Failed to update exchange rate. Please try again.';
                        notifyError(msg);
                    },
                }
            );
        } catch (syncErr) {
            console.error('[FxRate] Synchronous crash in handleSubmit:', syncErr);
            notifyError('An unexpected error occurred before sending the request.');
        }
    }

    if (isLoading) return <CustomLoader />;

    return (
        <FxRateWrapper>
            {/* ── Page header ─────────────────────────────────────────── */}
            <FlexibleDiv className="page__header">
                <h2>Exchange Rate Settings</h2>
                <p>Set the NGN/USD rate used across all product prices, cart totals, and payments.</p>
            </FlexibleDiv>

            {/* ── Current rate banner ──────────────────────────────────── */}
            {currentRate ? (
                <FlexibleDiv className="current__rate__card">
                    <FlexibleDiv className="rate__label">
                        <p>Current Rate</p>
                        <span className="rate__display">
                            ₦{currentRate.usdToNgnRate?.toLocaleString()} / $1
                        </span>
                        <span className="rate__sub">
                            (ngnToUsd ≈ {currentRate.ngnToUsdRate?.toFixed(6)})
                        </span>
                    </FlexibleDiv>

                    <FlexibleDiv className="rate__meta">
                        {currentRate.note && (
                            <span className="meta__note" title={currentRate.note}>
                                &quot;{currentRate.note}&quot;
                            </span>
                        )}
                        <span className="meta__item">
                            Updated{' '}
                            {currentRate.updatedAt
                                ? new Date(currentRate.updatedAt).toLocaleDateString('en-NG', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : '—'}
                        </span>
                    </FlexibleDiv>
                </FlexibleDiv>
            ) : (
                <FlexibleDiv className="no__rate__card">
                    <span className="warning__icon">⚠️</span>
                    <p>
                        No exchange rate has been set yet. The system is using the default fallback rate of ₦1,355/$1.
                        Set a rate below to take control.
                    </p>
                </FlexibleDiv>
            )}

            {/* ── Form ────────────────────────────────────────────────── */}
            <FlexibleDiv className="update__card">
                <h3>Update Exchange Rate</h3>

                {/* Rate input */}
                <FlexibleDiv className="input__group">
                    <label htmlFor="fx-rate-input">Rate (₦ per $1 USD)</label>
                    <div className="input__prefix__wrapper">
                        <span className="prefix">₦</span>
                        <input
                            id="fx-rate-input"
                            type="number"
                            min={MIN_RATE}
                            max={MAX_RATE}
                            step="1"
                            placeholder="e.g. 1350"
                            value={rateInput}
                            onChange={(e) => {
                                setRateInput(e.target.value);
                                setValidationError('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit();
                            }}
                        />
                    </div>
                    {validationError ? (
                        <p className="error__text">{validationError}</p>
                    ) : previewValid ? (
                        <p className="preview__text">
                            Preview: $1 USD = ₦{parsedRate.toLocaleString()}&nbsp;·&nbsp;
                            $100 = ₦{(parsedRate * 100).toLocaleString()}
                        </p>
                    ) : (
                        <p className="helper__text">
                            Enter the number of Naira per 1 US Dollar. Allowed range: {MIN_RATE}–{MAX_RATE.toLocaleString()}.
                        </p>
                    )}
                </FlexibleDiv>

                {/* Optional note */}
                <FlexibleDiv className="input__group">
                    <label htmlFor="fx-note-input">Note (optional)</label>
                    <textarea
                        id="fx-note-input"
                        placeholder="e.g. CBN official rate — March 2026"
                        maxLength={200}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                    />
                    <p className="helper__text">{noteInput.length}/200 characters</p>
                </FlexibleDiv>

                <FlexibleDiv justifyContent="flex-end" style={{ width: '100%' }}>
                    <Button
                        backgroundColor="var(--oosriPrimary)"
                        hoverBg="#d44070"
                        color="#fff"
                        height="44px"
                        radius="10px"
                        width="180px"
                        disabled={isSaving}
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        {isSaving ? 'Saving…' : 'Update Rate'}
                    </Button>
                </FlexibleDiv>
            </FlexibleDiv>
        </FxRateWrapper>
    );
}
