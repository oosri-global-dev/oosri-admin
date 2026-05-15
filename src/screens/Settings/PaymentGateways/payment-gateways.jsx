import { useState } from "react";
import { Switch, Select, Form, Input, Divider, Spin } from "antd";
import { GatewaysWrapper } from "./payment-gateways.styles";
import { SiStripe } from "react-icons/si";
import { MdOutlinePayment as PaystackIcon } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineSave as SaveIcon } from "react-icons/md";
import useNotification from "@/hooks/useNotification";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

const { Option } = Select;

function MaskedInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: 36 }}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
      >
        {visible ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
      </button>
    </div>
  );
}

function GatewayCard({ icon, name, color, fields, values, onChange }) {
  return (
    <div className="gateway__card">
      <div className="gateway__header">
        <div className="gateway__brand" style={{ color }}>
          {icon}
          <span>{name}</span>
        </div>
        <Switch
          checked={values.enabled}
          onChange={(v) => onChange("enabled", v)}
          style={{ "--switch-color": color }}
        />
      </div>

      {values.enabled && (
        <div className="gateway__body">
          <div className="field__row">
            <label>Mode</label>
            <Select
              value={values.mode}
              onChange={(v) => onChange("mode", v)}
              style={{ width: 140 }}
              size="large"
            >
              <Option value="test">Test</Option>
              <Option value="live">Live</Option>
            </Select>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div className="fields__grid">
            {fields.map(({ key, label, masked }) => (
              <div className="field__row" key={key}>
                <label>{label}</label>
                {masked
                  ? <MaskedInput
                      value={values[key] || ""}
                      onChange={(e) => onChange(key, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  : <Input
                      value={values[key] || ""}
                      onChange={(e) => onChange(key, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      size="large"
                    />
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STRIPE_FIELDS = [
  { key: "livePublishableKey", label: "Live Publishable Key",  masked: false },
  { key: "liveSecretKey",      label: "Live Secret Key",       masked: true  },
  { key: "testPublishableKey", label: "Test Publishable Key",  masked: false },
  { key: "testSecretKey",      label: "Test Secret Key",       masked: true  },
  { key: "webhookSecret",      label: "Webhook Secret",        masked: true  },
];

const PAYSTACK_FIELDS = [
  { key: "livePublicKey",  label: "Live Public Key",  masked: false },
  { key: "liveSecretKey",  label: "Live Secret Key",  masked: true  },
  { key: "testPublicKey",  label: "Test Public Key",  masked: false },
  { key: "testSecretKey",  label: "Test Secret Key",  masked: true  },
];

export default function PaymentGatewaysScreen() {
  const [success, error] = useNotification();
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isLoading: isSaving } = useUpdateSettings();

  const [stripe, setStripe]     = useState(() => data?.stripe   || { enabled: false, mode: "test" });
  const [paystack, setPaystack] = useState(() => data?.paystack || { enabled: false, mode: "test" });

  const handleChange = (gateway, key, value) => {
    if (gateway === "stripe")   setStripe((p)   => ({ ...p, [key]: value }));
    if (gateway === "paystack") setPaystack((p) => ({ ...p, [key]: value }));
  };

  const handleSave = () => {
    updateSettings({ stripe, paystack }, {
      onSuccess: () => success("Payment gateway settings saved"),
      onError:   () => error("Failed to save settings"),
    });
  };

  if (isLoading) return <div style={{ padding: 40, textAlign: "center" }}><Spin size="large" /></div>;

  return (
    <GatewaysWrapper>
      <div className="page__intro">
        <h2 className="section__title">Payment Gateways</h2>
        <p className="section__sub">Configure Stripe and Paystack keys. Live keys are used in production mode.</p>
      </div>

      <div className="gateways__grid">
        <GatewayCard
          icon={<SiStripe size={22} />}
          name="Stripe"
          color="#635bff"
          fields={STRIPE_FIELDS}
          values={stripe}
          onChange={(k, v) => handleChange("stripe", k, v)}
        />
        <GatewayCard
          icon={<PaystackIcon size={22} />}
          name="Paystack"
          color="#0ba360"
          fields={PAYSTACK_FIELDS}
          values={paystack}
          onChange={(k, v) => handleChange("paystack", k, v)}
        />
      </div>

      <div className="save__row">
        <button className="save__btn" onClick={handleSave} disabled={isSaving}>
          <SaveIcon size={16} />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </GatewaysWrapper>
  );
}
