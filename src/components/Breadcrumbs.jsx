import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbSchema } from '../utils/seo';

/**
 * Breadcrumbs — renders a visible breadcrumb trail and injects BreadcrumbList schema.
 *
 * @param {Array<{name: string, path: string}>} items  — ordered list; last item is current page
 * @param {string} [className]                         — extra Tailwind classes for the wrapper
 * @param {'light'|'dark'} [theme]                     — 'light' (default) or 'dark' for hero overlays
 */
export default function Breadcrumbs({ items = [], className = '', theme = 'light' }) {
  if (items.length < 2) return null;

  const schema = buildBreadcrumbSchema(items);

  const textBase  = theme === 'dark' ? 'text-white/50' : 'text-primary/35';
  const textHover = theme === 'dark' ? 'hover:text-white' : 'hover:text-accent';
  const textCurrent = theme === 'dark' ? 'text-white/80' : 'text-primary/70';
  const chevronColor = theme === 'dark' ? 'text-white/25' : 'text-primary/20';

  return (
    <>
      {/* Inject BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1 text-[11px] font-medium ${className}`}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={item.path}>
              {isLast ? (
                <span className={textCurrent} aria-current="page">{item.name}</span>
              ) : (
                <Link to={item.path} className={`${textBase} ${textHover} transition-colors`}>
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRight size={11} className={chevronColor} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
