import { Donghua, Donghua_platform } from "@prisma/client";
import pinyin from "pinyin";

export const getDisplayTitle = (donghua: Donghua) => {
  if (donghua.titleEnglish) {
    return donghua.titleEnglish;
  }
  if (donghua.titleChinese) {
    return pinyin(donghua.titleChinese, {
      style: pinyin.STYLE_NORMAL,
    })
      .map(([word]) => {
        return [word.charAt(0).toUpperCase() + word.slice(1)];
      })
      .join(" ");
  }
  return "Unknown Title";
};

export const getDisplayPlatform = (
  platform: Donghua_platform | null
): string => {
  if (!platform) {
    return "Unknown";
  }
  switch (platform) {
    case "TV":
      return "TV";
    case "Web":
      return "Web";
    case "Unknown":
      return "Unknown";
  }
};
