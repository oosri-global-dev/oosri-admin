import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import AllCategoriesScreen from '@/screens/Categories/AllCategories/all-categories';
import Head from 'next/head';

const CategoriesPage = () => {
    return (
        <>
            <Head>
                <title>Categories | Oosri</title>
            </Head>
            <AllCategoriesScreen />
        </>
    );
};

CategoriesPage.getLayout = (page) => (
    <DashboardLayout title="Categories">{page}</DashboardLayout>
);

export default CategoriesPage;
