"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/path";
import { COLORS } from "@/constants/color";

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 inset-x-0 md:static md:w-full border-t border-black/10 dark:border-white/10 md:rounded-b-3xl"
      style={{ backgroundColor: COLORS.BRAND, color: COLORS.BASE.WHITE }}
    >
      <div className="w-full px-4 text-white">
        <ul className="grid grid-cols-5 text-sm">
          {NAV_ITEMS.map((it) => {
            const active = pathname === it.path;
            return (
              <li key={it.path} className="text-center">
                <Link
                  href={it.path}
                  className={`block py-3 ${
                    active ? "font-semibold" : "opacity-90"
                  }`}
                >
                  {it.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
