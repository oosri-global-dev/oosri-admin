import Head from 'next/head';
import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import AuditLogScreen from '@/screens/AuditLog/audit-log';

const AuditLogPage = () => (
  <>
    <Head><title>Audit Log | Oosri Admin</title></Head>
    <AuditLogScreen />
  </>
);

AuditLogPage.getLayout = (page) => (
  <DashboardLayout title="Audit Log">{page}</DashboardLayout>
);

export default AuditLogPage;
