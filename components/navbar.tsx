import { UserButton } from "@clerk/nextjs"
import MobileNavbar from "./mobileNavbar"

const Navbar = () => {
  return (
    <div className="flex items-center p-4 bg-[#1f1f1f] md:ml-2 md:rounded-b-md">
        <MobileNavbar />
        <div className="flex w-full justify-end">
            <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  )
}

export default Navbar