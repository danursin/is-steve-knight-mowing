import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "../../types";
import { getMows } from "../../services/mowService";

type ListMowsQueryParams = {
    start_date: string;
    end_date: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent[] | string>) {
    try {
        const { start_date, end_date } = req.query as ListMowsQueryParams;
        const mows = await getMows({ start_date, end_date })
        res.json(mows);
    } catch(err){
        res.status(500).send((err as Error).message);
    }
    
}