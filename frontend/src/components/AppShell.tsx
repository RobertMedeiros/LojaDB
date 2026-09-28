"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/", label: "Visão geral" },
  { href: "/categorias", label: "Categorias" },
  { href: "/produtos", label: "Produtos" },
  { href: "/clientes", label: "Clientes" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div>
            <strong>LojaDB</strong>
            <span>Painel administrativo</span>
          </div>
        </div>

        <nav className="nav">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="dot" />
          Next.js + ASP.NET Core
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
