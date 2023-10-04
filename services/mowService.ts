import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb, { TABLE_NAME } from "../db/dynamodb";

import { MowEvent } from "../types";

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

export const createMow = async ({geolocation, note }: { geolocation: Partial<GeolocationCoordinates>; note?: string | undefined}): Promise<MowEvent> => {
    const item: MowEvent = {
        PK: "EVENT#MOW",
        SK: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        Type: "MOW",
        geolocation,
        note
    };
    await dynamodb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
    }));
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