import { useCallback } from "react";

export function useScreenShake() {
  const shake = useCallback((duration = 300, intensity = 5) => {
    const body = document.body;
    const startTime = Date.now();
    const originalPosition = body.style.position;

    // bodyを相対配置にして、top/leftで揺らす
    body.style.position = "relative";

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const x = (Math.random() - 0.5) * intensity * (1 - progress);
        const y = (Math.random() - 0.5) * intensity * (1 - progress);
        body.style.left = `${x}px`;
        body.style.top = `${y}px`;
        requestAnimationFrame(animate);
      } else {
        body.style.position = originalPosition;
        body.style.left = "";
        body.style.top = "";
      }
    };

    animate();
  }, []);

  return shake;
}
