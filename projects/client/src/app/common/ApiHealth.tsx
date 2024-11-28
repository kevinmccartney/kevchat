"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "../config";

export default function ApiHealth() {
  const [apiIsHealthy, setApiIsHealthy] = useState(true);
  const [apiHealthCheckDone, setApiHealthCheckDone] = useState(false);
  useEffect(() => {
    fetch(`${CONFIG.apiUrl}/healthz`)
      .then((res) => {
        setApiHealthCheckDone(true);
        setApiIsHealthy(res.ok);
      })
      .catch(() => {
        setApiHealthCheckDone(true);
        setApiIsHealthy(false);
      });
  }, []);

  return (
    <>
      {apiHealthCheckDone && apiIsHealthy && (
        <div className="toast">
          <div className="alert alert-success">
            <span>KevChat API is up!</span>
          </div>
        </div>
      )}
      {apiHealthCheckDone && !apiIsHealthy && (
        <div className="toast">
          <div className="alert alert-error">
            <span>KevChat API is down!</span>
          </div>
        </div>
      )}
    </>
  );
}
