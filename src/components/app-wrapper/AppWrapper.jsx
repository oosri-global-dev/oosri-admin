import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "@/context";
import { handleFetchUser } from "@/network/user";
import { CURRENT_USER } from "@/context/types";
import CustomLoader from "@/components/lib/CustomLoader";
import { getDataInCookie } from "@/data-helpers/auth-session";
import { useRouter } from "next/router";

// Array of paths that should be excluded from redirection
const excludedPaths = [
  "/otp",
  "/register",
  "/login",
  "/forgot-password",
  "/check-email",
  "/create-business",
];

const AppWrapper = ({ children }) => {
  const {
    dispatch,
    state: { user },
  } = useContext(MainContext);
  const [pageLoading, setIsPageLoading] = useState(true);
  const { pathname, push } = useRouter();

  useEffect(() => {
    const userToken = getDataInCookie("access_token__admin");

    if (
      !userToken &&
      !excludedPaths.some((path) => pathname.startsWith(path))
    ) {
      push("/");
      setIsPageLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await handleFetchUser();

        if (typeof res === "undefined") {
          throw new Error();
        }

        dispatch({
          type: CURRENT_USER,
          payload: { ...res?.data?.body?.user },
        });

        // Check if the current path is in the excluded list
        const isExcludedPath = excludedPaths.some((path) =>
          pathname.startsWith(path)
        );

        if (res && pathname === "/" && !isExcludedPath) {
          push("/dashboard").then(() => {
            setIsPageLoading(false);
          });
          return;
        }
        setIsPageLoading(false);
      } catch (err) {
        console.clear();
        console.log(err, "err");
        // Only redirect to home if not on an excluded path
        if (
          !excludedPaths.some((path) => pathname.startsWith(path)) &&
          pathname !== "/"
        ) {
          window.location.href = "/";
        } else {
          setIsPageLoading(false);
        }
      }
    };

    fetchUser();
  }, [dispatch, pathname]);

  if (pageLoading) {
    return <CustomLoader />;
  }

  return children;
};

export default AppWrapper;
