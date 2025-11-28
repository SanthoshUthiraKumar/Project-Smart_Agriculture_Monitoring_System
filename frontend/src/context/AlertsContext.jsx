import React, { createContext, useContext, useEffect, useState } from "react";
import { ALERTS_SSE_URL } from "../api/analyticsAPI";

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alertsMap, setAlertsMap] = useState({});

  useEffect(() => {
    let es;
    let reconnectDelay = 1000;

    const connect = () => {
      // 1. Retrieve the token
      const token = localStorage.getItem("token");
      
      // If no token, we can't connect yet (or handle as needed)
      if (!token) {
        console.warn("No token found, skipping SSE connection");
        return;
      }

      // 2. Append token to the URL query string
      es = new EventSource(`${ALERTS_SSE_URL}?token=${token}`);

      es.onopen = () => {
        console.log("SSE open");
        reconnectDelay = 1000;
      };

      es.addEventListener("initial", (e) => {
        try {
          const data = JSON.parse(e.data || "{}");
          // normalize keys to strings
          const normalized = {};
          Object.keys(data || {}).forEach(k => {
            normalized[String(k)] = data[k];
          });
          setAlertsMap(normalized);
        } catch (err) {
          console.warn("invalid initial snapshot", err);
        }
      });

      es.addEventListener("alert", (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload && payload.action === "cleared") {
            setAlertsMap(prev => {
              const copy = { ...prev };
              delete copy[String(payload.fieldId)];
              return copy;
            });
            return;
          }

          if (payload && payload.fieldId && payload.type) {
            const fid = String(payload.fieldId);
            setAlertsMap(prev => {
              const copy = { ...prev };
              if (!copy[fid]) copy[fid] = {};
              copy[fid][payload.type] = {
                message: payload.message,
                level: payload.level,
                timestamp: payload.timestamp
              };
              return copy;
            });
          }
        } catch (err) {
          console.warn("bad alert event", err);
        }
      });

      es.onerror = (err) => {
        console.error("SSE error", err);
        try { es.close(); } catch (_) {}
        setTimeout(() => {
          reconnectDelay = Math.min(60000, reconnectDelay * 2);
          connect();
        }, reconnectDelay);
      };
    };

    connect();
    return () => { try { es.close(); } catch(_) {} };
  }, []);

  const clearFieldAlertsLocal = (fieldId) => {
    setAlertsMap(prev => {
      const copy = { ...prev };
      delete copy[String(fieldId)];
      return copy;
    });
  };

  return (
    <AlertsContext.Provider value={{ alertsMap, clearFieldAlertsLocal }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertsContext);
}
