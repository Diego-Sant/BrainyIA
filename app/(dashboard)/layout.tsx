import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { getApiLimitCount } from "@/lib/apiLimit"
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: {children: React.ReactNode}) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  
  return (
    <div className="relative">
        <div className="hidden md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 z-[80] bg-gray-900">
            <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        </div>
        <main className="md:pl-72">
            <Navbar />
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout