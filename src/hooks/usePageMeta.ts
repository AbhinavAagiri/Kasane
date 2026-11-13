import { useEffect } from 'react';
import { canonicalUrl, type JsonLdObject, type RouteMeta } from '@/seo/routes';
import { site } from '@/data/site';

const setMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
};

const removeMeta = (selector: string) => {
  document.head.querySelectorAll(selector).forEach((element) => element.remove());
};

const setLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
};

const serialiseJsonLd = (jsonLd: JsonLdObject[]) =>
  jsonLd.length
    ? JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd }).replace(/</g, '\\u003c')
    : '';

/** Applies route-specific metadata after client-side navigation. Static HTML carries the same values. */
export const usePageMeta = (meta: RouteMeta) => {
  const jsonLd = serialiseJsonLd(meta.jsonLd);

  useEffect(() => {
    const canonical = canonicalUrl(meta.path);
    const image = meta.image.startsWith('http') ? meta.image : `${site.url}${meta.image}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', { name: 'description', content: meta.description });
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: meta.noindex ? 'noindex, nofollow' : 'index, follow',
    });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: meta.type });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: site.name });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: meta.imageAlt });
    setMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    if (meta.noindex) {
      removeMeta('link[rel="canonical"]');
    } else {
      setLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    }

    let script = document.head.querySelector<HTMLScriptElement>('script#kasane-jsonld');
    if (!jsonLd) {
      script?.remove();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.id = 'kasane-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = jsonLd;
    }
  }, [jsonLd, meta.description, meta.image, meta.imageAlt, meta.noindex, meta.path, meta.title, meta.type]);
};
