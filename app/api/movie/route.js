import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    });

    const $ = cheerio.load(data);

    // 1. Details
    const title = $('h1.entry-title').text().trim();
    const plot = $('div.entry-content p').first().text().trim();
    const poster = $('div.entry-content img').first().attr('src');

    // 2. Screenshots (.ss-img class logic)
    const screenshots = [];
    $('.ss-img img').each((i, el) => {
      const src = $(el).attr('src');
      if (src) screenshots.push(src);
    });

    // 3. Download Links (Logic to find m4ulinks)
    const downloadSections = [];
    
    // Simple logic: Find texts like "480p", "720p" and associated links
    $('a').each((i, el) => {
        const txt = $(el).text().trim();
        const href = $(el).attr('href');
        
        if(href && (href.includes('m4ulinks.com') || href.includes('gdtot'))) {
            let quality = "Unknown";
            if($(el).parent().text().includes('480p')) quality = "480p";
            if($(el).parent().text().includes('720p')) quality = "720p";
            if($(el).parent().text().includes('1080p')) quality = "1080p";
            
            downloadSections.push({ quality, link: href, label: txt });
        }
    });

    return NextResponse.json({ title, plot, poster, screenshots, downloadSections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape movie' }, { status: 500 });
  }
}
