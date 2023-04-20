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

export const getDisplaySummary = (donghua: Donghua, limit?: number): string => {
  let htmlStr = donghua.summaryEnglish || "";

  if (limit && htmlStr.length > limit) {
    htmlStr = htmlStr.substring(0, limit) + "...";
  }

  htmlStr = htmlStr.replace(/&lt;/g , "<");	 
  htmlStr = htmlStr.replace(/&gt;/g , ">");     
  htmlStr = htmlStr.replace(/&quot;/g , "\"");  
  htmlStr = htmlStr.replace(/&#39;/g , "\'");   
  htmlStr = htmlStr.replace(/&amp;/g , "&");
  return htmlStr;
}