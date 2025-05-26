import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'SoniceAI - AI Tools Directory',
  description = 'Discover and explore the best AI tools for various tasks. From chatbots to image generation, find the perfect AI solution for your needs.',
  keywords = 'AI tools, artificial intelligence, chatbot, image generation, coding assistant, productivity tools',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  const router = useRouter();
  const canonicalUrl = `https://soniceai.com${router.asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="SoniceAI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Language */}
      <meta httpEquiv="content-language" content={router.locale || 'en'} />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default SEO; 