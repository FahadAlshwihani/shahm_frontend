import DOMPurify from "dompurify";

const CMS_HTML_CONFIG = Object.freeze({
  ALLOWED_TAGS: [
    "p", "div", "span", "br", "strong", "b", "em", "i", "u", "s",
    "blockquote", "pre", "code", "ul", "ol", "li", "h1", "h2", "h3",
    "h4", "h5", "h6", "a", "img", "table", "thead", "tbody", "tr",
    "th", "td", "hr",
  ],
  ALLOWED_ATTR: [
    "href", "target", "rel", "title", "src", "alt", "width", "height",
    "class", "style", "dir", "colspan", "rowspan",
  ],
  FORBID_TAGS: [
    "script", "style", "iframe", "object", "embed", "form", "input",
    "button", "svg", "math",
  ],
  ALLOW_DATA_ATTR: false,
});

/** Sanitize CMS-authored rich text immediately before rendering it as HTML. */
export function sanitizeCmsHtml(value) {
  return DOMPurify.sanitize(value || "", CMS_HTML_CONFIG);
}
