import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

import { pickDominantColor } from "@/src/utils/pokemon";

type UseDominantColorOptions = {
  fallbackColor: string;
};

export function useDominantColor(
  imageUrl: string | null | undefined,
  options: UseDominantColorOptions
) {
  const { fallbackColor } = options;
  const [color, setColor] = useState(fallbackColor);
  const [isLoading, setIsLoading] = useState(Boolean(imageUrl));

  useEffect(() => {
    let isMounted = true;

    async function loadDominantColor() {
      if (!imageUrl) {
        if (isMounted) {
          setColor(fallbackColor);
          setIsLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setIsLoading(true);
        }

        const result = await getColors(imageUrl, {
          fallback: fallbackColor,
          cache: true,
          key: imageUrl,
        });

        if (!isMounted) {
          return;
        }

        setColor(pickDominantColor(result, fallbackColor));
      } catch {
        if (isMounted) {
          setColor(fallbackColor);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDominantColor();

    return () => {
      isMounted = false;
    };
  }, [fallbackColor, imageUrl]);

  return { color, isLoading };
}
