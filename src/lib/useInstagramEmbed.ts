import { useEffect, useState } from "react";

const SCRIPT_ID = "instagram-embed-script";

export function useInstagramEmbed(enabled: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const processEmbeds = () => {
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
        setReady(true);
      }
    };

    if (document.getElementById(SCRIPT_ID)) {
      processEmbeds();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = processEmbeds;

    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [enabled]);

  return { ready };
}
