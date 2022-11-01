import { useEffect, useRef } from "react";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

const GoogleAuth = (props) => {
  const googleButton = useRef(null);

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    const id = props.credential;

    loadScript(src)
      .then(() => {
        /*global google*/
        google.accounts.id.initialize({
          client_id: id,
          callback: props.handleCredentialResponse,
        });
        google.accounts.id.renderButton(googleButton.current, {
          theme: "outline",
          size: "large"
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  return <div ref={googleButton}></div>;
};

export default GoogleAuth;
