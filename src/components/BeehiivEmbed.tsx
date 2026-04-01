import { useEffect } from "react";

export default function BeehiivEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://subscribe-forms.beehiiv.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      src="https://subscribe-forms.beehiiv.com/ba049f1b-7691-4f47-a34e-78392412d5b1"
      className="beehiiv-embed"
      data-test-id="beehiiv-embed"
      frameBorder="0"
      scrolling="no"
      style={{
        width: "560px",
        height: "315px",
        margin: 0,
        borderRadius: 0,
        backgroundColor: "transparent",
        boxShadow: "0 0 #0000",
        maxWidth: "100%",
      }}
      title="Subscribe to newsletter"
    />
  );
}
