import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { socket_id, channel_name } = req.body;

    if (!socket_id || !channel_name) {
      return res.status(400).json({ error: "Invalid body" });
    }

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: session.user.email,
    });

    return res.send(authResponse);
  } catch (err) {
    console.error("Pusher auth error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
