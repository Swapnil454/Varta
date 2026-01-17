
'use client'

import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/LoadingModal";
import { User } from "@/generated/prisma";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((res) => {
        router.push(`/conversations/${res.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && <LoadingModal />}

      <div
        onClick={handleClick}
        className="
          w-full
          relative
          flex
          items-center
          gap-3
          mb-2
          p-3
          rounded-xl
          cursor-pointer
          bg-gradient-to-r from-blue-50 via-white to-blue-50
          transition
          hover:shadow-md hover:from-blue-100 hover:to-blue-50
        "
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar user={data} />
        </div>

        {/* User info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {data.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
