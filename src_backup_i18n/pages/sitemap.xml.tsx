import { GetServerSideProps } from 'next';
import { aiTools } from '@/data/aiTools';

const EXTERNAL_DATA_URL = 'https://soniceai.com';

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs -->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/tools</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/categories</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/rankings</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <!-- Add the dynamic URLs -->
     ${aiTools
       .map((tool) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/tools/${tool.id}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will handle the XML generation
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Generate the XML sitemap
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap; 