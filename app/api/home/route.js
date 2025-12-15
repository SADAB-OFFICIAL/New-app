import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    // Target: Original Website
    const url = `https://movies4u.nexus/page/${page}/`;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);
    const movies = [];

    $('article').each((i, el) => {
      const titleRaw = $(el).find('h2.entry-title a').text().trim();
      const link = $(el).find('h2.entry-title a').attr('href');
      
      // Image Handling: Lazy load ya src check
      let img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

      if(titleRaw && link) {
        // Quality extract karna (Title se)
        let quality = "HD";
        if (titleRaw.includes('480p')) quality = "480p";
        else if (titleRaw.includes('720p')) quality = "720p";
        else if (titleRaw.includes('1080p')) quality = "1080p";
        else if (titleRaw.includes('4K') || titleRaw.includes('2160p')) quality = "4K";

        // Slug banana (Base64 Magic)
        const encodedSlug = btoa(`${link.split('/').filter(Boolean).pop()}|||https://movies4u.nexus`)
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        
        movies.push({
          title: titleRaw.replace(/\(20\d{2}\).*/, '').trim(), // Title clean kiya
          originalTitle: titleRaw,
          link: link,
          image: img,
          slug: encodedSlug,
          quality: quality,
          year: titleRaw.match(/\d{4}/)?.[0] || '2025'
        });
      }
    });

    return NextResponse.json({ movies });

  } catch (error) {
    return NextResponse.json({ movies: [] });
  }
}
