import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "../../types";
import { getMostRecentMow } from "../../services/mowService";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<MowEvent | string>) {
    try {
        const result = await getMostRecentMow();
        res.json(result);
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
}