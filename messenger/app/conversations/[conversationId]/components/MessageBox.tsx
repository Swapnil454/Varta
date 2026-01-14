
'use client'

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session?.data?.user?.email === data?.sender?.email;

    const seenList = (data.seen || [])
        .filter((user) => user?.email !== data?.sender?.email)
        .map((user) => user?.name || user?.email)
        .join(", ");

    const container = clsx(
        "flex gap-3 p-2 md:p-4",
        isOwn ? "justify-end" : "justify-start"
    );

    const avatar = clsx(isOwn && "order-2");

    const body = clsx(
        "flex flex-col gap-1 md:gap-2 max-w-[70%]",
        isOwn ? "items-end" : "items-start"
    );

    const message = clsx(
        "text-sm md:text-base w-fit overflow-hidden relative",
        isOwn 
            ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        data.image ? "rounded-lg p-0" : "rounded-2xl py-2 px-3 shadow-sm",
        "transition-all duration-200 hover:scale-[1.02]"
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                {/* Sender name & timestamp */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 dark:text-gray-500">
                    <span className="font-medium">{data.sender?.name || data.sender?.email || "Unknown"}</span>
                    <span>{format(new Date(data.createdAt), "p")}</span>
                </div>

                {/* Message / Image */}
                <div className={message}>
                    {data.image && (
                        <>
                            <ImageModal
                                src={data.image}
                                isOpen={imageModalOpen}
                                onClose={() => setImageModalOpen(false)}
                            />
                            <Image
                                onClick={() => setImageModalOpen(true)}
                                alt="Message Image"
                                src={data.image}
                                width={288}
                                height={288}
                                className="object-cover cursor-pointer rounded-lg hover:scale-105 transition-transform duration-200"
                            />
                        </>
                    )}
                    {!data.image && <div>{data.body}</div>}
                </div>

                {/* Seen Status */}
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox;
