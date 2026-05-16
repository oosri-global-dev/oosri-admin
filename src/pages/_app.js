import "@/styles/globals.css";
import "@/styles/vars.css";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import useNotification from "@/hooks/useNotification";
import { useContext, useEffect, useState } from "react";
import StyledComponentsRegistry from "@/hooks/registry";
import { MainContext, MainProvider } from "@/context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Router from 'next/router';
import CustomLoader from '@/components/lib/CustomLoader';
import { App as AntdApp } from "antd";
import { handleFetchUser } from "@/network/user";
import { CURRENT_USER } from "@/context/types";
import { getDataInCookie } from "@/data-helpers/auth-session";

function OnlineWatcher() {
  const [isOnline] = useOnlineStatus();
  const [, error] = useNotification();
  useEffect(() => {
    if (!isOnline) error("You are offline.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);
  return null;
}

function UserGate({ onReady }) {
  const { dispatch } = useContext(MainContext);

  useEffect(() => {
    const token = getDataInCookie("access_token__admin");
    if (!token) {
      onReady();
      return;
    }
    handleFetchUser()
      .then((res) => {
        if (res?.data?.body?.user) {
          dispatch({ type: CURRENT_USER, payload: { ...res.data.body.user } });
        }
      })
      .catch(() => {})
      .finally(onReady);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [userReady, setUserReady] = useState(false);

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

  const isLoading = !mounted || pageLoading || !userReady;

  return (
    <MainProvider>
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          <AntdApp>
            <UserGate onReady={() => setUserReady(true)} />
            <OnlineWatcher />
            {isLoading ? <CustomLoader /> : getLayout(<Component {...pageProps} />)}
          </AntdApp>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StyledComponentsRegistry>
    </MainProvider>
  );
}
