import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "../../types";
import { createMow } from "../../services/mowService";

type CreateMowBody = {
   ip: string;
   geolocation: GeolocationCoordinates;
   note?: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent>) {
    const { geolocation, note } = req.body as CreateMowBody;
    const ip = "ip";
    const newMow = await createMow({ ip, geolocation, note })
    res.json(newMow);
}