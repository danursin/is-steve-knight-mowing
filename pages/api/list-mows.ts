import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "../../types";
import { listMowsDescending } from "../../services/mowService";

type ListMowsQueryParams = {
    take: string;
    last_key: string | undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{
    items: MowEvent[];
    last_evaluated_key: string | undefined;
} | string>) {
    try {
        const { take, last_key } = req.query as ListMowsQueryParams;
        const mows = await listMowsDescending({ take: +take, last_key })
        res.json(mows);
    } catch(err){
        res.status(500).send((err as Error).message);
    }
    
}