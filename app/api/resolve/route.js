import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type'); // 'm4u' or 'hub'

  // Headers bahut zaroori hain taaki HubCloud humein block na kare
  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m4ulinks.com/', 
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  };

  try {
    // ---------------------------------------------------------
    // CASE 1: M4uLinks (HubCloud ke links dhundna)
    // ---------------------------------------------------------
    if (type === 'm4u') {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const links = [];
        
        $('a').each((i, el) => {
            const txt = $(el).text().trim();
            const href = $(el).attr('href');
            // Hum sirf Hub-Cloud ya V-Cloud uthayenge
            if(href && (txt.includes('Hub-Cloud') || txt.includes('V-Cloud') || txt.includes('GDFlix'))) {
                links.push({ server: txt, url: href });
            }
        });
        return NextResponse.json({ links });
    } 
    
    // ---------------------------------------------------------
    // CASE 2: HubCloud / GamerxYT (Final Video Link dhundna)
    // ---------------------------------------------------------
    else if (type === 'hub') {
        
        // Step 1: Link open karo (Ye gamerxyt.com par redirect hoga)
        const response = await axios.get(url, { headers });
        const finalPageHtml = response.data;
        const $ = cheerio.load(finalPageHtml);

        let finalStreamUrl = null;

        // Step 2: Buttons dhundo (Priority ke hisab se)
        // Order: FSLv2 > FSL > PixelServer > 100% Resume > Download
        
        const selectors = [
            'a:contains("FSLv2 Server")',
            'a:contains("FSL Server")', 
            'a:contains("PixelServer")',
            'a:contains("100% Resume")',
            'a.btn-primary', // Aksar main download button ki class hoti hai
            'a:contains("Download Link Generated")'
        ];

        for (const selector of selectors) {
            // Cheerio me :contains directly kaam nahi karta kabhi kabhi, isliye loop lagayenge
            if (selector.includes(':contains')) {
                const searchText = selector.match(/"(.*?)"/)[1];
                $('a').each((i, el) => {
                    if ($(el).text().includes(searchText)) {
                        finalStreamUrl = $(el).attr('href');
                        return false; // Break loop
                    }
                });
            } else {
                finalStreamUrl = $(selector).attr('href');
            }

            if (finalStreamUrl) break; // Agar link mil gaya to loop roko
        }

        // Agar abhi bhi nahi mila, to shayad koi redirection URL ho
        if (!finalStreamUrl) {
             const metaRefresh = $('meta[http-equiv="refresh"]').attr('content');
             if(metaRefresh) {
                 finalStreamUrl = metaRefresh.split('url=')[1];
             }
        }

        // Step 3: Result bhejo
        if (finalStreamUrl) {
            console.log("Found Stream URL:", finalStreamUrl);
            return NextResponse.json({ streamUrl: finalStreamUrl });
        } else {
            // Agar fail hua, to Frontend ko error batao (wo Iframe dikha dega)
            return NextResponse.json({ error: 'No playable link found inside HubCloud' });
        }
    }

    return NextResponse.json({ error: 'Invalid Type' });

  } catch (e) {
    console.error("Resolve Error:", e.message);
    return NextResponse.json({ error: 'Failed' });
  }
}
