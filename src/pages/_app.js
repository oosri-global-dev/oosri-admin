import "@/styles/globals.css";
import "@/styles/vars.css";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import useNotification from "@/hooks/useNotification";
import { useEffect, useState } from "react";
import StyledComponentsRegistry from "@/hooks/registry";
import { MainProvider } from "@/context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Router from 'next/router';
import CustomLoader from '@/components/lib/CustomLoader';
import { App as AntdApp } from "antd";

function OnlineWatcher() {
  const [isOnline] = useOnlineStatus();
  const [, error] = useNotification();
  useEffect(() => {
    if (!isOnline) error("You are offline.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);
  return null;
}

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

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
  }, []);

  const isLoading = !mounted || pageLoading;

  return (
    <MainProvider>
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <OnlineWatcher />
            {isLoading && <CustomLoader />}
            {getLayout(<Component {...pageProps} />)}
          </AntdApp>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StyledComponentsRegistry>
    </MainProvider>
  );
}
