"use client"
import { Menubar } from "@/components/ui/menubar"
import { usePathname } from "next/navigation"
import Link from "next/link"

type HeaderProps = {}

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname()
  return (
    <div className="fixed top-[5%] z-50 flex w-full justify-center">
      <Menubar className="flex w-fit items-center justify-center gap-5 rounded-full border-none bg-arcMenuBg px-9 text-sm text-white hover:text-white">
        <Link
          className={`${
            pathname === "/" ? "" : "text-secondaryGrey"
          } transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline `}
          href={"/"}
        >
          Home
        </Link>

        <Link
          className={`${
            pathname === "/medical-report" ? "" : "text-secondaryGrey"
          } transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline`}
          href={"/medical-report"}
        >
          Report Analyzer
        </Link>

        <Link
          className={`${
            pathname === "/chat" ? "" : "text-secondaryGrey"
          } transition-all duration-300 ease-in-out hover:scale-105 hover:text-white hover:underline`}
          href={"/medicine-analyzer"}
        >
          Medicine Analyzer
        </Link>
      </Menubar>
    </div>
  )
}
export default Header
