import { useState, useRef } from "react";
import { Switch, Select, Input, Divider, Spin, Tag, Modal } from "antd";
import { ShippingWrapper } from "./shipping-providers.styles";
import { LuTruck as TruckIcon } from "react-icons/lu";
import { MdOutlineSave as SaveIcon } from "react-icons/md";
import { MdOutlineWifi as TestIcon } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineAdd as AddIcon } from "react-icons/md";
import useNotification from "@/hooks/useNotification";
import { useSettings, useUpdateSettings, useTestShippingProvider } from "@/hooks/useSettings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCouriers, createCourier, deleteCourier } from "@/network/couriers";

const { Option } = Select;

function MaskedField({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: 36, borderRadius: 8 }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
      >
        {show ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
      </button>
    </div>
  );
}

const PROVIDERS = [
  {
    key: "dhl",
    name: "DHL",
    color: "#FFCC00",
    textColor: "#cc0000",
    fields: [
      { key: "apiKey",        label: "API Key",        masked: true  },
      { key: "accountNumber", label: "Account Number", masked: false },
    ],
    hasMode: true,
  },
  {
    key: "fedex",
    name: "FedEx",
    color: "#4d148c",
    textColor: "#ff6200",
    fields: [
      { key: "apiKey",        label: "API Key",        masked: true  },
      { key: "accountNumber", label: "Account Number", masked: false },
      { key: "meterNumber",   label: "Meter Number",   masked: false },
    ],
    hasMode: true,
  },
  {
    key: "haulam",
    name: "Haulam",
    color: "#0ea5e9",
    textColor: "#0ea5e9",
    fields: [
      { key: "apiKey",   label: "API Key",  masked: true  },
      { key: "baseUrl",  label: "Base URL", masked: false },
    ],
    hasMode: false,
  },
];

function ProviderCard({ provider, values, onChange, onTest, testing }) {
  const { key, name, color, textColor, fields, hasMode } = provider;
  return (
    <div className="provider__card">
      <div className="provider__header">
        <div className="provider__brand">
          <div className="provider__dot" style={{ background: color }} />
          <span style={{ color: textColor, fontWeight: 700, fontSize: "1rem" }}>{name}</span>
          {values.enabled && (
            <Tag color={values.mode === "live" ? "green" : "orange"} style={{ marginLeft: 4 }}>
              {values.mode === "live" ? "Live" : "Test"}
            </Tag>
          )}
        </div>
        <Switch checked={values.enabled} onChange={(v) => onChange(key, "enabled", v)} />
      </div>

      {values.enabled && (
        <div className="provider__body">
          {hasMode && (
            <div className="field__row">
              <label>Mode</label>
              <Select value={values.mode || "test"} onChange={(v) => onChange(key, "mode", v)} style={{ width: 140 }} size="large">
                <Option value="test">Test</Option>
                <Option value="live">Live</Option>
              </Select>
            </div>
          )}
          <Divider style={{ margin: "12px 0" }} />
          <div className="fields__grid">
            {fields.map(({ key: fk, label, masked }) => (
              <div className="field__row" key={fk}>
                <label>{label}</label>
                {masked
                  ? <MaskedField value={values[fk] || ""} onChange={(e) => onChange(key, fk, e.target.value)} placeholder={`Enter ${label.toLowerCase()}`} />
                  : <Input value={values[fk] || ""} onChange={(e) => onChange(key, fk, e.target.value)} placeholder={`Enter ${label.toLowerCase()}`} size="large" style={{ borderRadius: 8 }} />
                }
              </div>
            ))}
          </div>
          <button className="test__btn" onClick={() => onTest(key)} disabled={testing === key}>
            <TestIcon size={14} />
            {testing === key ? "Testing…" : "Test Connection"}
          </button>
        </div>
      )}
    </div>
  );
}

function CourierManagement() {
  const qc = useQueryClient();
  const [success, error] = useNotification();
  const fileInputRef = useRef(null);
  const [nameInput, setNameInput] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["couriers"],
    queryFn: getCouriers,
    staleTime: 2 * 60 * 1000,
  });
  const couriers = data?.body || [];

  const { mutate: doDelete } = useMutation({
    mutationFn: (id) => deleteCourier(id),
    onSuccess: () => { success("Courier removed."); qc.invalidateQueries({ queryKey: ["couriers"] }); },
    onError:   () => error("Failed to remove courier."),
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setModalOpen(true);
    e.target.value = "";
  };

  const handleAdd = async () => {
    if (!nameInput.trim() || !pendingFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", nameInput.trim());
      fd.append("image", pendingFile);
      await createCourier(fd);
      qc.invalidateQueries({ queryKey: ["couriers"] });
      success("Courier added.");
      setModalOpen(false);
      setNameInput("");
      setPendingFile(null);
    } catch {
      error("Failed to add courier. Name may already be taken.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: "Remove this courier?",
      content: `"${name}" will no longer appear as a shipping option.`,
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => doDelete(id),
    });
  };

  return (
    <>
      <div className="couriers__section">
        <div className="couriers__header">
          <div>
            <p style={{ margin: 0, fontSize: ".78rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em" }}>Marketplace Couriers</p>
            <p style={{ margin: "2px 0 0", fontSize: ".8rem", color: "#9ca3af" }}>Courier logos displayed on the marketplace shipping selection.</p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: 32, display: "flex", justifyContent: "center" }}><Spin /></div>
        ) : (
          <div className="couriers__grid">
            {couriers.map((c) => (
              <div className="courier__item" key={c.id}>
                {c.image
                  ? <img src={c.image} alt={c.name} />
                  : <div style={{ width: 52, height: 52, background: "#f1f5f9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><TruckIcon size={22} color="#9ca3af" /></div>
                }
                <span className="courier__name">{c.name}</span>
                <button className="courier__delete" onClick={() => handleDelete(c.id, c.name)}>✕</button>
              </div>
            ))}

            <button className="courier__add__btn" onClick={() => fileInputRef.current?.click()}>
              <AddIcon size={20} />
              Add Courier
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden__input"
        onChange={handleFileChange}
      />

      <Modal
        title="Add Courier Service"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setPendingFile(null); setNameInput(""); }}
        onOk={handleAdd}
        okText={uploading ? "Adding…" : "Add Courier"}
        confirmLoading={uploading}
        okButtonProps={{ disabled: !nameInput.trim() }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          {pendingFile && (
            <div style={{ textAlign: "center" }}>
              <img
                src={URL.createObjectURL(pendingFile)}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: ".8rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Courier Name</label>
            <Input
              placeholder="e.g. GIG Logistics"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onPressEnter={handleAdd}
              size="large"
              style={{ borderRadius: 8 }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function ShippingProvidersScreen() {
  const [success, error] = useNotification();
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isLoading: isSaving } = useUpdateSettings();
  const { mutate: testProvider } = useTestShippingProvider();

  const [providers, setProviders] = useState(() => ({
    dhl:    data?.dhl    || { enabled: false, mode: "test" },
    fedex:  data?.fedex  || { enabled: false, mode: "test" },
    haulam: data?.haulam || { enabled: false },
  }));
  const [testing, setTesting] = useState(null);

  const handleChange = (provider, key, value) => {
    setProviders((p) => ({ ...p, [provider]: { ...p[provider], [key]: value } }));
  };

  const handleTest = (provider) => {
    setTesting(provider);
    testProvider(provider, {
      onSuccess: (res) => {
        setTesting(null);
        if (res?.data?.success) success(`${provider.toUpperCase()} connection successful`);
        else error(`${provider.toUpperCase()} connection failed`);
      },
      onError: () => { setTesting(null); error(`Could not reach ${provider.toUpperCase()}`); },
    });
  };

  const handleSave = () => {
    updateSettings(providers, {
      onSuccess: () => success("Shipping provider settings saved"),
      onError:   () => error("Failed to save settings"),
    });
  };

  if (isLoading) return <div style={{ padding: 40, textAlign: "center" }}><Spin size="large" /></div>;

  return (
    <ShippingWrapper>
      <div className="page__intro">
        <h2 className="section__title">Shipping Providers</h2>
        <p className="section__sub">Enable and configure logistics integrations and manage marketplace courier options.</p>
      </div>

      <div className="providers__list">
        {PROVIDERS.map((p) => (
          <ProviderCard
            key={p.key}
            provider={p}
            values={providers[p.key]}
            onChange={handleChange}
            onTest={handleTest}
            testing={testing}
          />
        ))}
      </div>

      <div className="save__row">
        <button className="save__btn" onClick={handleSave} disabled={isSaving}>
          <SaveIcon size={16} />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <CourierManagement />
    </ShippingWrapper>
  );
}
