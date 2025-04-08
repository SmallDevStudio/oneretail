import { useEffect } from "react";

const CookieConsent = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // เพิ่ม CSS cookieconsent
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href =
        "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
      document.head.appendChild(css);

      // โหลด JS และเริ่ม initialise
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
      script.onload = () => {
        window.cookieconsent.initialise({
          palette: {
            popup: { background: "#000" },
            button: { background: "#f1d600" },
          },
          type: "opt-in",
          content: {
            message: "เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งาน",
            dismiss: "ยอมรับทั้งหมด",
            allow: "เลือกประเภทคุกกี้",
            deny: "ปฏิเสธ",
            link: "เรียนรู้เพิ่มเติม",
            href: "/privacy-policy",
          },
          onInitialise: function (status) {
            if (this.hasConsented()) {
              loadTrackingScripts();
            }
          },
          onStatusChange: function (status) {
            if (this.hasConsented()) {
              loadTrackingScripts();
            }
          },
        });
      };
      document.body.appendChild(script);
    }

    const loadTrackingScripts = () => {
      if (!window.gtag) {
        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", "G-CSWDW901VK");
      }
    };
  }, []);

  return null;
};

export default CookieConsent;
