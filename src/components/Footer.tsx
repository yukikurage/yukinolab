import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-surface border-t border-border dark:border-primary relative">
      <div className="container mx-auto px-8 text-center">
        <p className="text-sm text-text-secondary">
          © 2025 yukikurage. All rights reserved.
        </p>
      </div>
      <Link
        href="/admin"
        className="absolute top-1/2 -translate-y-1/2 right-4 text-xs text-text-tertiary hover:text-text-secondary transition-colors flex items-center gap-1"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Admin
      </Link>
    </footer>
  );
}
