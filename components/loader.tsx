import Image from "next/image"
import EmptyImage from "@/public/images/empty.png"

export const Loader = () => {
    return (
        <>
            <div className="lds-roller mt-4"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <p className="text-gray-200 text-sm">Brainy está pensando...</p>
        </>
    )
}