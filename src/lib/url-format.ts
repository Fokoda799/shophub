export const urlFormat = (url: string): string => {
  // remove locale from url
  const parts = url.split("/");
  if (parts.length > 3) {
    parts.splice(3, 1);
  }
  return parts.join("/");
}