'use client'

import Image from "next/image";
import { User, UserConversation } from "../generated/prisma";


interface AvatarGroupProps {
    users: (UserConversation & { user: User })[];
    size?: number;
    overlap?: boolean;
    animate?: boolean;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
    users
}) => {
    const slicedUser = users.slice(0,3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    };

    return (
        <div className=" relative h-11 w-11">
            {slicedUser.map((user, index) => (
                <div
                    key={user.id}
                    className={`
                        absolute
                        inline-block
                        rounded-full
                        overflow-hidden
                        h-[21px]
                        w-[21px]
                        ${positionMap[index as keyof typeof positionMap]}
                    `}
                >
                    <Image 
                        alt="Avatar"
                        src={user.user?.image || '/images/PlaceHolder.jpg'}
                        fill
                        sizes="(max-width: 768px) 40px, (max-width: 1200px) 50px, 60px"
                    />
                </div>
            ))}
        </div>
    )
}

export default AvatarGroup;