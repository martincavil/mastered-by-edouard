"use client";

import { useEffect } from "react";

export function AdminBodyMarker() {
  useEffect(() => {
    document.body.setAttribute("data-admin", "true");
    return () => document.body.removeAttribute("data-admin");
  }, []);

  return null;
}
