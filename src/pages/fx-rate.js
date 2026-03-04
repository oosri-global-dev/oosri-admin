import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import FxRateScreen from "@/screens/Settings/fx-rate";
import Head from "next/head";

const FxRatePage = () => {
    return (
        <>
            <Head>
                <title>Exchange Rate Settings | Oosri Admin</title>
                <meta name="description" content="Set the NGN/USD exchange rate for the platform" />
            </Head>
            <FxRateScreen />
        </>
    );
};

FxRatePage.getLayout = (page) => (
    <DashboardLayout title="Exchange Rate" titleSubText="Set the NGN/USD rate used across the platform">
        {page}
    </DashboardLayout>
);

export default FxRatePage;
