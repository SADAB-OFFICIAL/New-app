import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const { data } = await axios.get('https://movies4u.nexus/');
    const $ = cheerio.load(data);
    const movies = [];
    $('article').each((i, el) => {
      const title = $(el).find('h2.entry-title a').text().trim();
      const link = $(el).find('h2.entry-title a').attr('href');
      const img = $(el).find('img').attr('src');
      if(title && link) {
        // Simple magic URL generator
        const encodedSlug = btoa(`${link.split('/').filter(Boolean).pop()}|||https://movies4u.nexus`)
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        movies.push({ title, image: img, slug: encodedSlug });
      }
    });
    return NextResponse.json({ movies });
  } catch (e) { return NextResponse.json({ movies: [] }); }
}
