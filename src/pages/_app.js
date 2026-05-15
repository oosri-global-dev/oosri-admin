import "@/styles/globals.css";
import "@/styles/vars.css";
import useNotification from "@/hooks/useNotification";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import StyledComponentsRegistry from "@/hooks/registry";
import { MainProvider } from "@/context";
import AppWrapper from "@/components/app-wrapper/AppWrapper";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Router from 'next/router';
import CustomLoader from '@/components/lib/CustomLoader';
import { App as AntdApp } from "antd";

function AppContent({ Component, pageProps }) {
  const [isOnline] = useOnlineStatus();
  const [, error] = useNotification();
  const getLayout = Component.getLayout || ((page) => page);

  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isOnline) {
      error("You are offline.");
    }

    const handleStart = () => setPageLoading(true);
    const handleDone  = () => setPageLoading(false);

    Router.events.on('routeChangeStart',    handleStart);
    Router.events.on('routeChangeComplete', handleDone);
    Router.events.on('routeChangeError',    handleDone);

    return () => {
      Router.events.off('routeChangeStart',    handleStart);
      Router.events.off('routeChangeComplete', handleDone);
      Router.events.off('routeChangeError',    handleDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = !mounted || pageLoading;

  return (
    <>
      {isLoading && <CustomLoader />}
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MainProvider>
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <AppContent Component={Component} pageProps={pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </AntdApp>
        </QueryClientProvider>
      </StyledComponentsRegistry>
    </MainProvider>
  );
}
