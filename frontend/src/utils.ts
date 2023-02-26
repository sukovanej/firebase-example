import prettyMilliseconds from "pretty-ms";

export const humanReadableDuration = (createdAtMs: number) => {
  const now = Date.now();
  const diff = now - createdAtMs;

  if (diff < 5000) {
    return "Just now";
  }

  const duration = prettyMilliseconds(diff, { compact: true });
  return `${duration} ago`;
};
