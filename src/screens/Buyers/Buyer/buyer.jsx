import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BuyerWrapper } from "./buyer.styles";
import { useBuyer } from "@/hooks/useBuyer";
import { suspendBuyer, unsuspendBuyer } from "@/network/buyers";
import useNotification from "@/hooks/useNotification";
import { Spin } from "antd";
import { formatDate } from "@/utils/format-date";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

function StatusPill({ buyer }) {
  if (buyer.isSuspended) return <span className="status__pill suspended"><span className="pill__dot" />Suspended</span>;
  if (!buyer.isConfirmed) return <span className="status__pill unverified"><span className="pill__dot" />Unverified</span>;
  return <span className="status__pill active"><span className="pill__dot" />Active</span>;
}

export default function BuyerScreen({ buyerId }) {
  const [success, error] = useNotification();
  const qc = useQueryClient();
  const { data, isLoading } = useBuyer(buyerId);
  const buyer = data?.data?.body || {};

  const { mutate: suspend, isLoading: suspending } = useMutation({
    mutationFn: (id) => suspendBuyer(id, "Admin action"),
    onSuccess: () => { success("Buyer suspended"); qc.invalidateQueries({ queryKey: ["buyer", buyerId] }); },
    onError:   () => error("Failed to suspend buyer"),
  });

  const { mutate: unsuspend, isLoading: unsuspending } = useMutation({
    mutationFn: (id) => unsuspendBuyer(id),
    onSuccess: () => { success("Buyer unsuspended"); qc.invalidateQueries({ queryKey: ["buyer", buyerId] }); },
    onError:   () => error("Failed to unsuspend buyer"),
  });

  if (isLoading) return <div style={{ padding: 60, textAlign: "center" }}><Spin size="large" /></div>;

  return (
    <BuyerWrapper>
      <div className="profile__card">
        <div className="profile__avatar">{initials(buyer.fullName)}</div>
        <div className="profile__main">
          <h2 className="profile__name">{buyer.fullName || "—"}</h2>
          <p className="profile__email">{buyer.email}</p>
          <div className="profile__badges">
            <StatusPill buyer={buyer} />
          </div>
        </div>
        <div className="profile__actions">
          {buyer.isSuspended
            ? <button className="btn__unsuspend" disabled={unsuspending} onClick={() => unsuspend(buyerId)}>
                {unsuspending ? "Unsuspending…" : "Unsuspend"}
              </button>
            : <button className="btn__suspend" disabled={suspending} onClick={() => suspend(buyerId)}>
                {suspending ? "Suspending…" : "Suspend Buyer"}
              </button>
          }
        </div>
      </div>

      <div className="details__grid">
        <div className="info__card">
          <h3 className="card__title">Account Details</h3>
          {[
            ["Full Name",    buyer.fullName  || "—"],
            ["Email",        buyer.email     || "—"],
            ["Phone",        buyer.phoneNumber || "—"],
            ["Gender",       buyer.gender    || "—"],
            ["Email Verified", buyer.isConfirmed ? "Yes" : "No"],
            ["Last Login",   buyer.lastLogin  || "—"],
            ["Joined",       buyer.createdAt ? formatDate(buyer.createdAt) : "—"],
          ].map(([label, value]) => (
            <div className="info__row" key={label}>
              <span className="info__label">{label}</span>
              <span className="info__value">{value}</span>
            </div>
          ))}
        </div>

        <div className="info__card">
          <h3 className="card__title">Auth Providers</h3>
          {[
            ["Google Linked",     buyer.authProviders?.googleLinked    ? "Yes" : "No"],
            ["Password Enabled",  buyer.authProviders?.localPasswordEnabled ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div className="info__row" key={label}>
              <span className="info__label">{label}</span>
              <span className="info__value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="addresses__card">
        <h3 className="card__title">Delivery Addresses</h3>
        {(buyer.deliveryAddresses?.length || 0) === 0
          ? <p className="empty__text">No delivery addresses saved.</p>
          : buyer.deliveryAddresses.map((addr, i) => (
            <div className="address__item" key={i}>
              <p className="address__line">{addr.address}</p>
              <p className="address__meta">{addr.cityName}, {addr.countryName} {addr.postalCode}</p>
              {addr.isDefault && <span className="default__badge">Default</span>}
            </div>
          ))
        }
      </div>
    </BuyerWrapper>
  );
}
