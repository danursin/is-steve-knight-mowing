import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "@/app/types";
import { createMow } from "@/app/services/mowService";

type CreateMowBody = {
   ip: string;
   geolocation: GeolocationCoordinates;
   note?: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent>) {
    const { ip, geolocation, note } = req.body as CreateMowBody;
    const newMow = await createMow({ ip, geolocation, note })
    res.json(newMow);
}