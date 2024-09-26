import React, { useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Trans } from "@lingui/macro";

export const NotFoundScreen = () => {
  const error = useRouteError();

  const message = useMemo(() => {
    if (isRouteErrorResponse(error)) {
      return error.statusText;
    } else if (error instanceof Error) {
      return error.message;
    }
  }, [error]);

  return (
    <div id="error-page">
      <h1>
        <Trans>Oops!</Trans>
      </h1>
      <p>
        <Trans>Sorry, an unexpected error has occurred.</Trans>
      </p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
};
