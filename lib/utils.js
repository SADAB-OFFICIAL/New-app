export function encodeData(data) {
  try {
    const str = JSON.stringify(data);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (e) { return ""; }
}

export function decodeData(str) {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return JSON.parse(atob(base64));
  } catch (e) { return null; }
}

export function decodeSlug(slugParam) {
  // Logic for /v/YOUR_ENCODED_STRING
  try {
    let str = slugParam.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const parts = atob(str).split("|||");
    return { slug: parts[0], sourceUrl: parts[1] };
  } catch (e) { return null; }
}
