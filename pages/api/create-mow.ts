import { NextApiRequest, NextApiResponse } from "next";
import { createMow, getMostRecentMow } from "../../services/mowService";

import { MowEvent } from "../../types";

type CreateMowBody = {
   ip: string;
   geolocation: Partial<GeolocationCoordinates>;
   note?: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent | string>) {
    const mostRecentMow = await getMostRecentMow();
    if(mostRecentMow){
        const now = new Date();
        const mostRecentDate = new Date(mostRecentMow.timestamp);
        if(Math.abs(+now - +mostRecentDate) < 15 * 1000){
            console.log(`Got a request to add an event but it was invalid: Most recent date ${mostRecentDate.toISOString()}, 15 min ago: ${fifteenMinutesAgo.toISOString()}`)
            res.status(429).send("A mow event was recorded less than 15 minutes ago. Give it a few minutes and try again.");
            return;
        }
    }

    const { geolocation, note } = req.body as CreateMowBody;

    if(!geolocation){
        res.status(400).send("Missing required body param, geolocation");
        return;
    }
    const newMow = await createMow({ geolocation, note })
    res.json(newMow);
}