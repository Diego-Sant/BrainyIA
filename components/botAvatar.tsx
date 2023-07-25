import { Avatar, AvatarImage } from "./ui/avatar"

export const BotAvatar = () => {
    return (
        <Avatar className="-ml-3 -mr-4 w-14 h-14">
            <AvatarImage className="p-1" src="/images/avatar.png" />
        </Avatar>
    )
}