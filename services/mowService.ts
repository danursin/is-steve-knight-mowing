import { GetCommand, PutCommand, QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { GlobalStatistics, MowEvent } from "../types";
import dynamodb, { TABLE_NAME } from "../db/dynamodb";

export const getMows = async ({ start_date, end_date }: { start_date: string; end_date: string }): Promise<MowEvent[]> => {
    const { Items } = await dynamodb.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#PK = :pk AND #SK BETWEEN :start_date AND :end_date",
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK": "SK"
        },
        ExpressionAttributeValues: {
            ":pk": "EVENT#MOW",
            ":start_date": start_date,
            ":end_date": end_date
        }
    }));
    return (Items ?? []) as MowEvent[];
};

export const listMowsDescending = async ({ take, last_key }: { take: number; last_key?: string }): Promise<{ items: MowEvent[]; last_evaluated_key: string | undefined }> => {
    const result = await dynamodb.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#PK = :pk",
        ExpressionAttributeNames: {
            "#PK": "PK"
        },
        ExpressionAttributeValues: {
            ":pk": "EVENT#MOW"
        },
        ScanIndexForward: false,
        Limit: take,
        ExclusiveStartKey: last_key ? {
            PK: "EVENT#MOW",
            SK: last_key
        }: undefined
    }));
    return {
        items: (result.Items ?? []) as MowEvent[],
        last_evaluated_key: (result.LastEvaluatedKey as Pick<MowEvent, "PK" | "SK">)?.SK ?? undefined
    }
};

export const getMostRecentMow = async (): Promise<MowEvent> => {
    const { Items } = await dynamodb.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#PK = :pk",
        Limit: 1,
        ScanIndexForward: false,
        ExpressionAttributeNames: {
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ":pk": "EVENT#MOW",
        }
    }));
    return Items?.[0] as MowEvent
};

export const getGlobalStatistics = async (): Promise<GlobalStatistics> => {
    const { Item } = await dynamodb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            PK: "GLOBAL#STATISTICS",
            SK: "GLOBAL#STATISTICS"
        }
    }));
    return Item as GlobalStatistics
};

export const createMow = async ({geolocation, note }: { geolocation: Partial<GeolocationCoordinates>; note?: string | undefined}): Promise<{ mow: MowEvent; globalStatistics: GlobalStatistics }> => {
    const mow: MowEvent = {
        PK: "EVENT#MOW",
        SK: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        Type: "MOW",
        geolocation,
        note
    };

    const globalStatistics = await getUpdatedGlobalStatisticsItem();

    await dynamodb.send(new TransactWriteCommand({
        TransactItems: [
            {
                Put: {
                    TableName: TABLE_NAME,
                    Item: mow
                }
            }, 
            {
                Put: {
                    TableName: TABLE_NAME,
                    Item: globalStatistics
                }
            }
        ]}
    ));

    return { mow, globalStatistics };
};

const getUpdatedGlobalStatisticsItem = async (): Promise<GlobalStatistics> => {
    const { Item } = await dynamodb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            PK: "GLOBAL#STATISTICS",
            SK: "GLOBAL#STATISTICS"
        }
    }));

    const { total, dayOfMonthRaw, dayOfWeekRaw } = Item as GlobalStatistics;

    const timestamp = new Date();
    const dayOfWeek = timestamp.getDay();
    const dayOfMonth = timestamp.getDate();
    const newTotal = total + 1

    const newDayOfMonthRaw = [...dayOfMonthRaw];
    newDayOfMonthRaw[dayOfMonth - 1] += 1; // subtract one since we're storing days zero-indexed

    const newDayOfWeekRaw = [...dayOfWeekRaw];
    newDayOfWeekRaw[dayOfWeek] += 1;

    const item: GlobalStatistics = {
        PK: "GLOBAL#STATISTICS",
        SK: "GLOBAL#STATISTICS",
        updated: new Date().toISOString(),
        Type: "STATISTICS",
        total: newTotal,
        dayOfWeekRaw: newDayOfWeekRaw,
        dayOfMonthRaw: newDayOfMonthRaw
    };
    
    return item;
};

/** Calculate distance using haversine */
export const calculateDistanceInMiles = (p1: { lat: number; lng: number}, p2: { lat: number; lng: number}): number => {
    const earthRadiusMiles = 3958.8; // Earth's radius in miles
    const lat1Rad = (p1.lat * Math.PI) / 180;
    const lon1Rad = (p1.lng * Math.PI) / 180;
    const lat2Rad = (p2.lat * Math.PI) / 180;
    const lon2Rad = (p2.lng * Math.PI) / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusMiles * c;
    return distance;
};

export const calculateMinutesBetweenDates = (d1: Date, d2: Date): number => {
    const diffMs = Math.abs(+d1 - +d2);
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes;
}