import { useCallback } from "react";
import { Tooltip } from "antd";
import { ApiStatusWrapper } from "./api-status.styles";
import { useApiHealth } from "@/hooks/useApiHealth";
import { MdRefresh as RefreshIcon } from "react-icons/md";
import { SiStripe, SiPaystack, SiMongodb, SiRedis, SiAlgolia, SiCloudinary } from "react-icons/si";
import { LuTruck as DhlIcon } from "react-icons/lu";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";
import { TbBrandFedex as FedExIcon } from "react-icons/tb";

const SERVICE_META = {
  mongodb:    { label: "MongoDB",    icon: SiMongodb,    color: "#47a248" },
  redis:      { label: "Redis",      icon: SiRedis,      color: "#dc382d" },
  stripe:     { label: "Stripe",     icon: SiStripe,     color: "#635bff" },
  paystack:   { label: "Paystack",   icon: SiPaystack,   color: "#0ba360" },
  dhl:        { label: "DHL",        icon: DhlIcon,      color: "#cc0000" },
  fedex:      { label: "FedEx",      icon: FedExIcon,    color: "#ff6200" },
  algolia:    { label: "Algolia",    icon: SiAlgolia,    color: "#003dff" },
  cloudinary: { label: "Cloudinary", icon: SiCloudinary, color: "#3448c5" },
  email:      { label: "Email",      icon: EmailIcon,    color: "#6b7280" },
};

function StatusBadge({ status }) {
  const map = {
    up:       { label: "Operational",  cls: "up"      },
    degraded: { label: "Degraded",     cls: "degraded"},
    down:     { label: "Down",         cls: "down"    },
    unknown:  { label: "Unknown",      cls: "unknown" },
  };
  const { label, cls } = map[status] || map.unknown;
  return <span className={`status__badge ${cls}`}>{label}</span>;
}

function ServiceCard({ serviceKey, result }) {
  const meta  = SERVICE_META[serviceKey] || { label: serviceKey, icon: RefreshIcon, color: "#6b7280" };
  const Icon  = meta.icon;
  const ms    = result?.latencyMs != null ? `${result.latencyMs} ms` : "—";
  const ts    = result?.checkedAt  ? new Date(result.checkedAt).toLocaleTimeString() : "—";
  const status = result?.status || "unknown";

  return (
    <div className={`service__card ${status}`}>
      <div className="service__top">
        <div className="service__brand">
          <Icon size={22} color={meta.color} />
          <span className="service__name">{meta.label}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="service__meta">
        <Tooltip title="Response latency"><span className="meta__chip latency">{ms}</span></Tooltip>
        <Tooltip title="Last checked"><span className="meta__chip time">{ts}</span></Tooltip>
      </div>
      {result?.error && <p className="service__error">{result.error}</p>}
    </div>
  );
}

export default function ApiStatusScreen() {
  const { data, isLoading, isFetching, refetch } = useApiHealth();

  const allStatuses = data?.services || {};
  const overallUp   = Object.values(allStatuses).every((s) => s?.status === "up");
  const anyDown     = Object.values(allStatuses).some((s)  => s?.status === "down");

  const overallStatus = !Object.keys(allStatuses).length
    ? "unknown"
    : anyDown
      ? "down"
      : overallUp
        ? "up"
        : "degraded";

  const handleRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <ApiStatusWrapper>
      <div className="status__header">
        <div>
          <h2 className="section__title">API Status</h2>
          <p className="section__sub">
            Live health of all platform integrations.
            {data?.checkedAt && ` Last checked: ${new Date(data.checkedAt).toLocaleTimeString()}`}
          </p>
        </div>
        <div className="header__right">
          <div className={`overall__badge ${overallStatus}`}>
            <span className="overall__dot" />
            {overallStatus === "up"      && "All Systems Operational"}
            {overallStatus === "down"    && "Outage Detected"}
            {overallStatus === "degraded"&& "Partial Degradation"}
            {overallStatus === "unknown" && "Checking…"}
          </div>
          <button className="refresh__btn" onClick={handleRefresh} disabled={isFetching}>
            <RefreshIcon size={16} className={isFetching ? "spinning" : ""} />
            {isFetching ? "Checking…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="services__grid">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div className="service__card skeleton" key={i}>
                <div className="skel__line wide" />
                <div className="skel__line short" />
              </div>
            ))
          : Object.keys(SERVICE_META).map((k) => (
              <ServiceCard key={k} serviceKey={k} result={allStatuses[k]} />
            ))
        }
      </div>
    </ApiStatusWrapper>
  );
}
