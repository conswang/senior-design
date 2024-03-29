import { Donghua, Donghua_platform } from "@prisma/client";
import pinyin from "pinyin";

export const getDisplayTitle = (donghua: Donghua, showTones?: boolean) => {
  if (donghua.titleEnglish) {
    return donghua.titleEnglish;
  }
  if (donghua.titleChinese) {
    return pinyin(donghua.titleChinese, {
      style: showTones ? pinyin.STYLE_TONE : pinyin.STYLE_NORMAL,
    })
      .map(([word]) => {
        return [word.charAt(0).toUpperCase() + word.slice(1)];
      })
      .join(" ");
  }
  return "Unknown Title";
};

export const getDisplayChineseTitle = (donghua: Donghua) => {
  return pinyin(donghua.titleChinese!, { style: pinyin.STYLE_TONE }).map(([word]) => {
    return [word.charAt(0).toUpperCase() + word.slice(1)];
  })
  .join(" ");
};

export const getDisplayPlatform = (
  platform: Donghua_platform | null
): string => {
  if (!platform) {
    return "Unknown";
  }
  switch (platform) {
    case Donghua_platform.TV:
      return "TV";
    case Donghua_platform.WEB:
      return "Web";
    case "Unknown":
      return Donghua_platform.Unknown;
  }
};

export const getDisplaySummary = (donghua: Donghua, limit?: number): string => {
  let htmlStr = donghua.summaryEnglish || "No summary ¯\\_(˶′◡‵˶)_/¯";

  if (limit && htmlStr.length > limit) {
    htmlStr = htmlStr.substring(0, limit) + "...";
  }

  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
};

// source: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export const getYouTubeId = (url: string | null) => {
  if (!url) return false;
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

export const placeHolderImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/White_Persian_Cat.jpg/220px-White_Persian_Cat.jpg";
