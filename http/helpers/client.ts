/**
 * @description Get the host part of a given URL
 *
 * @param url Url from which to generate the base path from
 */
export const httpHost = (url: string) => {
  if (url) {
    const jsUrl = new URL(url);
    url = `${jsUrl.protocol}//${jsUrl.host}`;
    return `${`${url.endsWith("/") ? url.slice(0, -1) : url}`}`;
  }
  return url ?? '';
};
