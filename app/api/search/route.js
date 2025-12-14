import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if(!query) return NextResponse.json({ movies: [] });

    const url = `https://movies4u.nexus/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const movies = [];

    $('article').each((i, el) => {
      const title = $(el).find('h2.entry-title a').text().trim();
      const link = $(el).find('h2.entry-title a').attr('href');
      const img = $(el).find('img').attr('src');
      
      if(title && link) {
        const encodedSlug = btoa(`${link.split('/').filter(Boolean).pop()}|||https://movies4u.nexus`)
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        movies.push({ title, image: img, slug: encodedSlug });
      }
    });

    return NextResponse.json({ movies });
  } catch (error) {
    return NextResponse.json({ movies: [] });
  }
}
