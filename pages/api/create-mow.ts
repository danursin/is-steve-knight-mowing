import { GlobalStatistics, MowEvent } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateDistanceInMiles, calculateMinutesBetweenDates, createMow, getMostRecentMow } from "../../services/mowService";

type CreateMowBody = {
   ip: string;
   geolocation: Partial<GeolocationCoordinates>;
   note?: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ mow: MowEvent; globalStatistics: GlobalStatistics } | string>) {
    try {
        const mostRecentMow = await getMostRecentMow();
        if(mostRecentMow){
            const now = new Date();
            const mostRecentDate = new Date(mostRecentMow.timestamp);
            if(calculateMinutesBetweenDates(mostRecentDate, now) < 15){
                res.status(429).send("A mow event was recorded less than 15 minutes ago. Give it a few minutes and try again.");
                return;
            }
        }
    
        const { geolocation, note } = req.body as CreateMowBody;
    
        if(!geolocation || !geolocation.latitude || !geolocation.longitude){
            res.status(400).send("Missing required body param, geolocation");
            return;
        }
    
        const stevesHouse = {
            lat: 44.920884571565196, 
            lng: -93.48885560769446
        };
    
        const reporter = {
            lat: geolocation.latitude,
            lng: geolocation.longitude
        };
    
        if(calculateDistanceInMiles(stevesHouse, reporter) > 1){
            res.status(403).send("Remote mowing reports are not accepted. You're too far away from Steve's house");
            return;
        }
    
        const result = await createMow({ geolocation, note })
        res.json(result);
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
    
}