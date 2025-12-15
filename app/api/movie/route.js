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

    // 2. SMART DOWNLOAD LINKS SCRAPING 🧠
    const downloadSections = [];

    // Hum Page ke saare 'Center' tags ya 'h3/h4/p' tags ko scan karenge
    // Kyunki link se pehle Quality likhi hoti hai
    // Example Structure: <h3>Download 720p [1GB]</h3> <p><a href="...">Link</a></p>

    $('a').each((i, el) => {
        const href = $(el).attr('href');
        
        // Sirf kaam ke links
        if (href && (href.includes('m4ulinks.com') || href.includes('gdtot') || href.includes('drive'))) {
            
            let qualityLabel = "Download Link";
            let qualityTag = "HD";
            let size = "";

            // --- CONTEXT FINDER LOGIC ---
            
            // 1. Check Link Text directly (e.g. "Download 720p")
            const ownText = $(el).text().trim();
            
            // 2. Check Previous Heading/Element (Just above the link)
            // Ye loop piche jayega jab tak koi heading na mile jisme "p" (480p) likha ho
            let prevNode = $(el).parent().prev(); 
            let foundHeader = "";
            
            for(let k=0; k<3; k++) { // Max 3 steps piche check karo
                const txt = prevNode.text().trim();
                if(txt && (txt.includes('480p') || txt.includes('720p') || txt.includes('1080p') || txt.includes('Zip'))) {
                    foundHeader = txt;
                    break;
                }
                prevNode = prevNode.prev();
            }

            // Combine Texts to analyze
            const fullContext = (ownText + " " + foundHeader).toLowerCase();

            // Quality Assign Karna
            if (fullContext.includes('480p')) qualityTag = "480p";
            else if (fullContext.includes('720p') && fullContext.includes('hevc')) qualityTag = "720p HEVC";
            else if (fullContext.includes('720p')) qualityTag = "720p";
            else if (fullContext.includes('1080p') && fullContext.includes('hevc')) qualityTag = "1080p HEVC";
            else if (fullContext.includes('1080p')) qualityTag = "1080p";
            else if (fullContext.includes('2160p') || fullContext.includes('4k')) qualityTag = "4K";

            // Size Extraction (e.g. [300MB])
            const sizeMatch = fullContext.match(/\[(\d+(\.\d+)?\s*(mb|gb))\]/i);
            if (sizeMatch) size = sizeMatch[1].toUpperCase();

            // Label Banana (Display ke liye)
            // Agar Header mila (Jaise "Download 720p [1GB]") to wahi use karo, warna Link Text
            qualityLabel = foundHeader && foundHeader.length < 50 ? foundHeader : ownText;

            // Type Detection (Series Batch)
            let type = "episode";
            if (fullContext.includes('pack') || fullContext.includes('zip') || fullContext.includes('batch') || fullContext.includes('season')) {
                type = "batch";
                qualityTag = "Zip Pack";
            }

            downloadSections.push({
                label: size ? `${qualityTag} [${size}]` : qualityLabel, // Clean Display Name
                link: href,
                quality: qualityTag,
                size: size,
                type: type
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
