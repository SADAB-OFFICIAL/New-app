import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const { url } = await req.json();
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    
    const title = $('h1.entry-title').text().trim();
    const plot = $('div.entry-content p').eq(2).text().trim(); // Adjusted for movies4u structure
    const poster = $('div.entry-content img').first().attr('src');
    
    const screenshots = [];
    $('.ss-img img').each((i, el) => { if($(el).attr('src')) screenshots.push($(el).attr('src')); });

    const downloadSections = [];
    $('a[href*="m4ulinks.com"], a[href*="gdtot"]').each((i, el) => {
        const txt = $(el).text().trim() || $(el).parent().text().trim();
        downloadSections.push({ 
            link: $(el).attr('href'), 
            label: txt,
            quality: txt.includes('480p') ? '480p' : txt.includes('720p') ? '720p' : '1080p'
        });
    });

    return NextResponse.json({ title, plot, poster, screenshots, downloadSections });
  } catch (e) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}
