export function encodeData(data) {
  try {
    const str = JSON.stringify(data);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (e) { return ""; }
}

export function decodeData(str) {
  try {
    if (!str) return null;
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return JSON.parse(atob(base64));
  } catch (e) { return null; }
}

export function decodeSlug(slugParam) {
  try {
    if (!slugParam) return null;
    // URL encoded strings ko pehle normal string banayein
    const cleanSlug = decodeURIComponent(slugParam);
    
    let str = cleanSlug.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    
    const decodedString = atob(str);
    const parts = decodedString.split("|||");
    
    if (parts.length < 2) return null;
    
    return { slug: parts[0], sourceUrl: parts[1] };
  } catch (e) { 
    console.error("Slug Decoding Error:", e);
    return null; 
  }
}
