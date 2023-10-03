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

export const getMostRecentMow = async (): Promise<MowEvent | undefined> => {
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