import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body; // URL from slug decoder

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // 1. Poster Image Link
    // Content ke andar pehli image aksar poster hoti hai
    let poster = $('div.entry-content img').first().attr('src');
    if (!poster) poster = $('meta[property="og:image"]').attr('content');

    // 2. Title & Description
    const title = $('h1.entry-title').text().trim();
    
    // Description dhoondhne ka logic (p tags check karega)
    let plot = "";
    $('div.entry-content p').each((i, el) => {
        const text = $(el).text();
        // Agar text me 'Story' ya 'Plot' likha ho, ya text lamba ho
        if ((text.includes('Story') || text.length > 50) && !text.includes('Download') && !plot) {
            plot = text.replace('Storyline:', '').trim();
        }
    });

    // 3. Screenshots (Optional but good for UI)
    const screenshots = [];
    $('.ss-img img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) screenshots.push(src);
    });

    // 4. Download Links + Size + Quality
    const downloadSections = [];

    // Logic: Movies4u par links aksar "Download 720p" text ke saath hote hain
    // Hum saare links scan karenge jo 'm4ulinks' ya 'gdtot' par jaate hain
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        const parentText = $(el).parent().text().trim(); // Kabhi kabhi size upar likha hota hai

        if (href && (href.includes('m4ulinks.com') || href.includes('gdtot') || href.includes('drive'))) {
            
            // Quality Detection
            let quality = "HD";
            if (text.includes('480p') || parentText.includes('480p')) quality = "480p";
            else if (text.includes('720p') || parentText.includes('720p')) quality = "720p";
            else if (text.includes('1080p') || parentText.includes('1080p')) quality = "1080p";
            else if (text.includes('2160p') || parentText.includes('4k')) quality = "4K";

            // Size Detection (Regex to find MB/GB)
            let size = "Unknown";
            const sizeMatch = text.match(/\[(\d+(\.\d+)?\s*(MB|GB))\]/i) || parentText.match(/\[(\d+(\.\d+)?\s*(MB|GB))\]/i);
            if (sizeMatch) {
                size = sizeMatch[1];
            }

            downloadSections.push({
                label: text || "Download Link",
                link: href,
                quality: quality,
                size: size
            });
        }
    });

    // Agar duplicates hain to filter kar sakte hain, abhi direct bhej rahe hain
    return NextResponse.json({
        title,
        plot,
        poster,
        screenshots,
        downloadSections
    });

  } catch (e) {
    console.error("Movie Scraping Error:", e.message);
    return NextResponse.json({ error: 'Failed to load movie details' }, { status: 500 });
  }
}
