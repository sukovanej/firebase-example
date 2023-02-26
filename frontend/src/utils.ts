import prettyMilliseconds from "pretty-ms";
import { ThingTag } from "./schema";

export const humanReadableDuration = (createdAtMs: number) => {
  const now = Date.now();
  const diff = now - createdAtMs;

  if (diff < 5000) {
    return "Just now";
  }

  const duration = prettyMilliseconds(diff, { compact: true });
  return `${duration} ago`;
};

export const thingTagFromId =
  (thingTags: readonly ThingTag[]) => (id: string) =>
    thingTags.find((thingTag) => thingTag.id === id)!;
