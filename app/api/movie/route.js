import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body; 

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // 1. Basic Details
    const title = $('h1.entry-title').text().trim();
    let plot = "";
    $('div.entry-content p').each((i, el) => {
        const text = $(el).text();
        if ((text.includes('Story') || text.length > 50) && !text.includes('Download') && !plot) {
            plot = text.replace('Storyline:', '').trim();
        }
    });

    let poster = $('div.entry-content img').first().attr('src');
    if (!poster) poster = $('meta[property="og:image"]').attr('content');

    const screenshots = [];
    $('.ss-img img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) screenshots.push(src);
    });

    // 2. Download Links with TYPE Detection (Episode vs Batch)
    const downloadSections = [];

    $('a').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        const parentText = $(el).parent().text().trim(); 

        // Valid Link Check
        if (href && (href.includes('m4ulinks.com') || href.includes('gdtot') || href.includes('drive'))) {
            
            // Quality Detection
            let quality = "HD";
            if (text.includes('480p') || parentText.includes('480p')) quality = "480p";
            else if (text.includes('720p') || parentText.includes('720p')) quality = "720p";
            else if (text.includes('1080p') || parentText.includes('1080p')) quality = "1080p";
            else if (text.includes('2160p') || parentText.includes('4k')) quality = "4K";

            // Type Detection (Series Logic) 🧠
            let type = "episode"; // Default
            const lowerText = (text + parentText).toLowerCase();
            
            if (lowerText.includes('pack') || lowerText.includes('zip') || lowerText.includes('batch') || lowerText.includes('complete') || lowerText.includes('season')) {
                type = "batch";
            }

            downloadSections.push({
                label: text || "Download Link",
                link: href,
                quality: quality,
                type: type // 'episode' or 'batch'
            });
        }
    });

    return NextResponse.json({
        title,
        plot,
        poster,
        screenshots,
        downloadSections
    });

  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
