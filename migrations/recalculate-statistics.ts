// scan from my dynamo db and recalculate the statistics
// and update the statistics table

import dynamodb, { TABLE_NAME } from "../db/dynamodb";

import { GlobalStatistics } from "../types";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { listMowsDescending } from "../services/mowService";

export const recalculateStatistics = async () => {
    const { items } = await listMowsDescending({ take: 1000 });

    const newGlobalStatistics: GlobalStatistics = {   
        PK: "GLOBAL#STATISTICS",
        SK: "GLOBAL#STATISTICS",
        Type: "STATISTICS",
        updated: new Date().toISOString(),
        total: items.length,
        dayOfMonthRaw: new Array(31).fill(0),
        dayOfWeekRaw: new Array(7).fill(0),
        monthOfYearRaw: new Array(12).fill(0),
        hourOfDayRaw: new Array(24).fill(0)
    };

    for (const mow of items) {
        const mowDate = new Date(new Date(mow.SK).toLocaleString('en-US', { 
            timeZone: "America/Chicago", 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }));
        newGlobalStatistics.dayOfMonthRaw[mowDate.getDate() - 1]++;
        newGlobalStatistics.dayOfWeekRaw[mowDate.getDay()]++;
        newGlobalStatistics.monthOfYearRaw[mowDate.getMonth()]++;
        newGlobalStatistics.hourOfDayRaw[mowDate.getHours()]++;
    }

    await dynamodb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newGlobalStatistics
    }));
};

recalculateStatistics();