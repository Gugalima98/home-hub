import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: object; // Support for JSON-LD Structured Data
}

export function SEO({ 
  title, 
  description = "A maneira mais fácil de alugar e comprar imóveis. Sem fiador, sem burocracia. Encontre casas e apartamentos com a R7 Consultoria.", 
  image = "/placeholder.svg", 
  url,
  schema
}: SEOProps) {
  const siteTitle = "R7 Consultoria";
  const fullTitle = `${title} | ${siteTitle}`;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={currentUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
