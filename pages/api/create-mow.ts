import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "@/pages/types";
import { createMow } from "@/pages/services/mowService";

type CreateMowBody = {
   ip: string;
   geolocation: GeolocationCoordinates;
   note?: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent>) {
    const { geolocation, note } = req.body as CreateMowBody;
    const ip = req.ip
    const newMow = await createMow({ ip, geolocation, note })
    res.json(newMow);
}