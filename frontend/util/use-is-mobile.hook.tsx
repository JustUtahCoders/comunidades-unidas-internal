import React from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(checkIsMobile);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

    function handleResize() {
      const nowIsMobile = checkIsMobile();
      if (nowIsMobile !== isMobile) {
        setIsMobile(nowIsMobile);
      }
    }
  }, [isMobile]);

  return isMobile;
}

function checkIsMobile() {
  return window.innerWidth <= 800;
}
