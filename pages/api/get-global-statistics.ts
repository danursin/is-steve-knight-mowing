import { NextApiRequest, NextApiResponse } from "next";

import { GlobalStatistics } from "../../types";
import { getGlobalStatistics } from "../../services/mowService";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<GlobalStatistics | string>) {
    try {
        const result = await getGlobalStatistics();
        res.json(result);
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
}