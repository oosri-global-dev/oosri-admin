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

export default function App({ Component, pageProps }) {
  const [isOnline] = useOnlineStatus();
  const [success, error] = useNotification();
  const getLayout = Component.getLayout || ((page) => page);

  const [queryClient] = useState(() => new QueryClient());

  /**
   * `mounted` is false on the server and becomes true only after the first
   * client-side useEffect fires — i.e. after React has finished hydrating.
   * Showing the loader until then hides the styled-components SSR flash.
   */
  const [mounted, setMounted] = useState(false);

  /**
   * `pageLoading` becomes true on routeChangeStart (navigating between pages)
   * and false again once the route is fully resolved.
   */
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Mark the app as hydrated
    setMounted(true);

    // Online status warning
    if (!isOnline) {
      error("You are offline.");
    }

    // Next.js page-transition events
    const handleStart = () => setPageLoading(true);
    const handleDone = () => setPageLoading(false);

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleDone);
    Router.events.on('routeChangeError', handleDone);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleDone);
      Router.events.off('routeChangeError', handleDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = !mounted || pageLoading;

  return (
    <MainProvider>
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          {isLoading && <CustomLoader />}
          {getLayout(<Component {...pageProps} />)}
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </StyledComponentsRegistry>
    </MainProvider>
  );
}
