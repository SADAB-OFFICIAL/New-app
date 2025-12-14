export function encodeData(data) {
  try {
    const json = JSON.stringify(data);
    // Fix for Emojis (🚀) and Special Characters
    const bytes = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode('0x' + p1));
    return btoa(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (e) {
    console.error("Encoding failed:", e);
    return "";
  }
}

export function decodeData(str) {
  try {
    if (!str) return null;
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    
    // Decode with Unicode support
    const json = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(json);
  } catch (e) {
    console.error("Decoding failed:", e);
    return null;
  }
}

export function decodeSlug(slugParam) {
  try {
    if (!slugParam) return null;
    const cleanSlug = decodeURIComponent(slugParam);
    let str = cleanSlug.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    
    const decodedString = atob(str);
    const parts = decodedString.split("|||");
    
    if (parts.length < 2) return null;
    return { slug: parts[0], sourceUrl: parts[1] };
  } catch (e) { return null; }
}
