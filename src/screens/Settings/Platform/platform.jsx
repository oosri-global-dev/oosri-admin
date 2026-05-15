import { useState } from "react";
import { Switch, InputNumber, Input, Spin } from "antd";
import { PlatformWrapper } from "./platform.styles";
import { MdOutlineSave as SaveIcon } from "react-icons/md";
import useNotification from "@/hooks/useNotification";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

const TOGGLES = [
  { key: "maintenanceMode",            label: "Maintenance Mode",           sub: "Redirects all visitors to a maintenance page." },
  { key: "guestCheckoutEnabled",       label: "Guest Checkout",             sub: "Allow buyers to checkout without creating an account." },
  { key: "reviewsEnabled",             label: "Product Reviews",            sub: "Allow buyers to leave reviews on products." },
  { key: "sellerRegistrationEnabled",  label: "Seller Registration",        sub: "Allow new sellers to register on the platform." },
  { key: "buyerRegistrationEnabled",   label: "Buyer Registration",         sub: "Allow new buyers to create accounts." },
];

export default function PlatformConfigScreen() {
  const [success, error] = useNotification();
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isLoading: isSaving } = useUpdateSettings();

  const [cfg, setCfg] = useState(() => ({
    maintenanceMode:           data?.maintenanceMode           ?? false,
    maintenanceMessage:        data?.maintenanceMessage        ?? "",
    guestCheckoutEnabled:      data?.guestCheckoutEnabled      ?? true,
    reviewsEnabled:            data?.reviewsEnabled            ?? true,
    sellerRegistrationEnabled: data?.sellerRegistrationEnabled ?? true,
    buyerRegistrationEnabled:  data?.buyerRegistrationEnabled  ?? true,
    maxProductsPerSeller:      data?.maxProductsPerSeller      ?? 100,
    orderAutoConfirmDays:      data?.orderAutoConfirmDays      ?? 7,
  }));

  const set = (key, value) => setCfg((p) => ({ ...p, [key]: value }));

  const handleSave = () => {
    updateSettings({ platform: cfg }, {
      onSuccess: () => success("Platform settings saved"),
      onError:   () => error("Failed to save platform settings"),
    });
  };

  if (isLoading) return <div style={{ padding: 40, textAlign: "center" }}><Spin size="large" /></div>;

  return (
    <PlatformWrapper>
      <div className="page__intro">
        <h2 className="section__title">Platform Configuration</h2>
        <p className="section__sub">Control platform-wide feature flags and operational settings.</p>
      </div>

      <div className="settings__card">
        <h3 className="card__title">Feature Flags</h3>
        <div className="toggles__list">
          {TOGGLES.map(({ key, label, sub }) => (
            <div className="toggle__row" key={key}>
              <div className="toggle__info">
                <p className="toggle__label">{label}</p>
                <p className="toggle__sub">{sub}</p>
              </div>
              <Switch
                checked={cfg[key]}
                onChange={(v) => set(key, v)}
                style={cfg[key] ? {} : {}}
              />
            </div>
          ))}
        </div>

        {cfg.maintenanceMode && (
          <div className="maintenance__msg">
            <label>Maintenance Message</label>
            <Input.TextArea
              rows={3}
              value={cfg.maintenanceMessage}
              onChange={(e) => set("maintenanceMessage", e.target.value)}
              placeholder="We'll be back shortly. Thank you for your patience."
              style={{ borderRadius: 8, fontSize: "0.84rem" }}
            />
          </div>
        )}
      </div>

      <div className="settings__card">
        <h3 className="card__title">Operational Limits</h3>
        <div className="limits__grid">
          <div className="limit__row">
            <div className="limit__info">
              <p className="limit__label">Max Products Per Seller</p>
              <p className="limit__sub">Maximum number of active listings a single seller can have.</p>
            </div>
            <InputNumber
              min={1}
              max={10000}
              value={cfg.maxProductsPerSeller}
              onChange={(v) => set("maxProductsPerSeller", v)}
              style={{ width: 120, borderRadius: 8 }}
              size="large"
            />
          </div>
          <div className="limit__row">
            <div className="limit__info">
              <p className="limit__label">Auto-Confirm Orders After (days)</p>
              <p className="limit__sub">Orders without a seller response are auto-confirmed after this many days.</p>
            </div>
            <InputNumber
              min={1}
              max={30}
              value={cfg.orderAutoConfirmDays}
              onChange={(v) => set("orderAutoConfirmDays", v)}
              style={{ width: 120, borderRadius: 8 }}
              size="large"
            />
          </div>
        </div>
      </div>

      <div className="save__row">
        <button className="save__btn" onClick={handleSave} disabled={isSaving}>
          <SaveIcon size={16} />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </PlatformWrapper>
  );
}
