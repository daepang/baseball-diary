import Link from "next/link";
import Image from "next/image";
import { PATHS } from "@/constants/path";
import { COLORS } from "@/constants/color";

export default function Header() {
  return (
    <header
      className="border-b border-black/10 dark:border-white/10"
      style={{ backgroundColor: COLORS.BRAND, color: COLORS.BASE.WHITE }}
    >
      <div className="w-full px-4 py-3 flex items-center gap-3 text-white">
        <Link href={PATHS.HOME.path} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Baseball Diary logo"
            width={28}
            height={28}
            priority
          />
          <span className="text-base font-semibold">Baseball Diary</span>
        </Link>
      </div>
    </header>
  );
}
