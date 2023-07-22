import Image from "next/image";
import EmptyImage from "@/public/images/empty.png"

interface EmptyProps {
    label: string;
}

export const Empty: React.FC<EmptyProps> = ({ label }) => {
    
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-60 w-72">
                <Image alt="Não há nenhum histórico de conversa" fill src={EmptyImage} />
            </div>
            <p className="text-gray-200 text-sm text-center">
                {label}
            </p>
        </div>
    )
}