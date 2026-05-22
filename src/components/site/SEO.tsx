import { useEffect } from "react";

interface Props {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
}

const upsertMeta = (selector: string, attr: string, value: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const SEO = ({ title, description, canonical, image, type = "website" }: Props) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    }
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    if (image) upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    const url = canonical || window.location.href;
    upsertLink("canonical", url);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
  }, [title, description, canonical, image, type]);
  return null;
};

export default SEO;