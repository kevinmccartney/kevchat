"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "../config";

export default function ApiHealth() {
  const [showHealthCheck, setShowHealthCheck] = useState<boolean>(true);
  const [apiIsHealthy, setApiIsHealthy] = useState(true);
  const [apiHealthCheckDone, setApiHealthCheckDone] = useState(false);
  useEffect(() => {
    fetch(`${CONFIG.apiUrl}/healthz`, { credentials: "include" })
      .then((res) => {
        setApiHealthCheckDone(true);
        setApiIsHealthy(res.ok);
      })
      .catch(() => {
        setApiHealthCheckDone(true);
        setApiIsHealthy(false);
      });
  }, []);

  useEffect(() => {
    if (apiHealthCheckDone) {
      const timer = setTimeout(() => {
        setShowHealthCheck(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiHealthCheckDone]);

  return (
    <>
      {apiHealthCheckDone && apiIsHealthy && (
        <div
          className={`toast transition-opacity duration-500 ${
            showHealthCheck ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="alert alert-success">
            <span>KevChat API is up!</span>
          </div>
        </div>
      )}
      {showHealthCheck && apiHealthCheckDone && !apiIsHealthy && (
        <div className="toast">
          <div className="alert alert-error">
            <span>KevChat API is down!</span>
          </div>
        </div>
      )}
    </>
  );
}
