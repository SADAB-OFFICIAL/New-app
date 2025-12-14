import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type'); // 'm4u' or 'hub'

  // Headers for scraping m4ulinks (Keep existing headers)
  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m4ulinks.com/'
  };

  try {
    // ---------------------------------------------------------
    // CASE 1: M4uLinks (HubCloud ke links dhundna) - Old Logic
    // ---------------------------------------------------------
    if (type === 'm4u') {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const links = [];
        
        $('a').each((i, el) => {
            const txt = $(el).text().trim();
            const href = $(el).attr('href');
            // Hum sirf Hub-Cloud ya V-Cloud ya GDFlix uthayenge
            if(href && (txt.includes('Hub-Cloud') || txt.includes('V-Cloud') || txt.includes('GDFlix'))) {
                links.push({ server: txt, url: href });
            }
        });
        return NextResponse.json({ links });
    } 
    
    // ---------------------------------------------------------
    // CASE 2: HubCloud / GDFlix (Use Your Custom API) 🚀
    // ---------------------------------------------------------
    else if (type === 'hub') {
        
        // Aapki API ka URL
        const apiUrl = `https://nothing-to-see-nine.vercel.app/hubcloud?url=${encodeURIComponent(url)}&key=sadabefy`;
        
        console.log("Calling Resolver API:", apiUrl);

        try {
            const apiRes = await axios.get(apiUrl);
            const data = apiRes.data;

            if (data && data.streams && data.streams.length > 0) {
                
                // Priority Logic: Sabse pehle FSLv2 dhundo, fir FSL, fir baaki
                let finalStream = null;

                // Priority 1: FSLv2
                finalStream = data.streams.find(s => s.server.includes('FSLv2') && s.link);
                
                // Priority 2: FSL
                if (!finalStream) {
                    finalStream = data.streams.find(s => s.server.includes('FSL') && !s.server.includes('v2') && s.link);
                }

                // Priority 3: 10Gbps / ZipDisk
                if (!finalStream) {
                    finalStream = data.streams.find(s => (s.server.includes('10Gbps') || s.server.includes('ZipDisk')) && s.link);
                }

                // Priority 4: Koi bhi jo mile (Fallback)
                if (!finalStream) {
                    finalStream = data.streams.find(s => s.link && s.link.startsWith('http'));
                }

                if (finalStream) {
                    console.log("Stream Found:", finalStream.server);
                    return NextResponse.json({ 
                        streamUrl: finalStream.link,
                        title: data.title // Optional: Title bhi bhej sakte hain
                    });
                }
            }
            
            return NextResponse.json({ error: 'No playable streams found in API response' });

        } catch (apiError) {
            console.error("Custom API Error:", apiError.message);
            return NextResponse.json({ error: 'Failed to resolve via external API' });
        }
    }

    return NextResponse.json({ error: 'Invalid Type' });

  } catch (e) {
    console.error("Server Error:", e.message);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
