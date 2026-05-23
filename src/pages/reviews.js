import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AllReviews from "@/screens/Reviews/all-reviews";

const ReviewsPage = () => (
  <>
    <Head><title>Product Reviews | Oosri Admin</title></Head>
    <AllReviews />
  </>
);

ReviewsPage.getLayout = (page) => (
  <DashboardLayout title="Product Reviews">{page}</DashboardLayout>
);

export default ReviewsPage;
