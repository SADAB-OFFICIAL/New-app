import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    // Target Website
    const url = `https://movies4u.nexus/page/${page}/`;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);
    const movies = [];

    // Articles loop (Movies4u specific structure)
    $('article').each((i, el) => {
      const title = $(el).find('h2.entry-title a').text().trim();
      const link = $(el).find('h2.entry-title a').attr('href');
      
      // Image scraping (Handle lazy loading if present)
      let image = $(el).find('img').attr('src');
      const dataSrc = $(el).find('img').attr('data-src');
      if (dataSrc) image = dataSrc;

      if(title && link) {
        // Create Magic Slug (Base64)
        // Ye slug detail page par kaam aayega
        const encodedSlug = btoa(`${link.split('/').filter(Boolean).pop()}|||https://movies4u.nexus`)
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        
        movies.push({ 
            title, 
            image, 
            slug: encodedSlug,
            quality: title.includes('480p') ? '480p' : title.includes('720p') ? '720p' : 'HD' 
        });
      }
    });

    return NextResponse.json({ movies });

  } catch (error) {
    console.error("Home Scraping Error:", error.message);
    return NextResponse.json({ movies: [] }); // Return empty array on error
  }
}
