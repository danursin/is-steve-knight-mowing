type MowEventType = "MOW";

type ItemType = MowEventType;

export interface DynamoDbItem {
    PK: string;
    SK: string;
    Type: ItemType
}

export interface MowEvent extends DynamoDbItem {
    PK: `EVENT#${MowEventType}`;
    SK: string;
    Type: MowEventType;
    timestamp: string;
    geolocation: Partial<GeolocationCoordinates>;
    note?: string;
}