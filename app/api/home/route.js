import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  try {
    // Target website (Change this if domain changes)
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const url = `https://movies4u.nexus/page/${page}/`;

    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });

    const $ = cheerio.load(data);
    const movies = [];

    $('article').each((i, el) => {
      const title = $(el).find('h2.entry-title a').text().trim();
      const link = $(el).find('h2.entry-title a').attr('href');
      const img = $(el).find('img').attr('src');
      
      // Create magic slug for our site
      if(title && link) {
        const encodedSlug = btoa(`${link.split('/').filter(Boolean).pop()}|||https://movies4u.nexus`)
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        
        movies.push({ title, image: img, slug: encodedSlug });
      }
    });

    return NextResponse.json({ movies });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
