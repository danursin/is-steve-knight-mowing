import { NextApiRequest, NextApiResponse } from "next";

import { MowEvent } from "@/pages/types";
import { getMows } from "@/pages/services/mowService";

type ListMowsQueryParams = {
    start_date: string;
    end_date: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MowEvent[]>) {
    const { start_date, end_date } = req.query as ListMowsQueryParams;
    const mows = await getMows({ start_date, end_date })
    res.json(mows);
}