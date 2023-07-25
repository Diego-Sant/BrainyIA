import { UserButton } from "@clerk/nextjs"
import MobileNavbar from "./mobileNavbar"
import { getApiLimitCount } from "@/lib/apiLimit"
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4 bg-[#1f1f1f] md:ml-2 md:rounded-bl-md">
        <MobileNavbar apiLimitCount={apiLimitCount} isPro={isPro} />
        <div className="flex w-full justify-end">
            <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  )
}

export default Navbar