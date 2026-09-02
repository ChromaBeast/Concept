import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-text-tertiary flex-wrap ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-text-tertiary/60 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-text-primary transition-colors max-w-[150px] sm:max-w-[200px] truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-secondary font-medium max-w-[180px] sm:max-w-[240px] truncate">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
