import Image from "next/image"
import EmptyImage from "@/public/images/empty.png"

export const Loader = () => {
    return (
        <>
            <div className="custom-loader mt-4"></div>
            <p className="text-gray-200 text-sm">Brainy está pensando...</p>
        </>
    )
}