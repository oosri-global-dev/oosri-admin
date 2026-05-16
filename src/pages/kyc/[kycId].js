import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import KycDetail from "@/screens/KYC/KycDetail/kyc-detail";
import { useKyc } from "@/hooks/useKyc";
import { Spin } from "antd";

const KycDetailPage = () => {
  const { query } = useRouter();
  const { data, isLoading } = useKyc(query.kycId);
  const kyc = data?.body;

  return (
    <>
      <Head><title>KYC Application | Oosri</title></Head>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : kyc ? (
        <KycDetail kyc={kyc} />
      ) : (
        <p style={{ color: "#6b7280", padding: "40px 0" }}>Application not found.</p>
      )}
    </>
  );
};

KycDetailPage.getLayout = (page) => (
  <DashboardLayout title="KYC Detail" showBackBtn>{page}</DashboardLayout>
);

export default KycDetailPage;
