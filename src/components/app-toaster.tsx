"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/** Toast container that follows the site's own dark/light toggle (the `dark` class on <html>). */
export function AppToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} position="top-center" richColors closeButton toastOptions={{ duration: 4000 }} />;
}
