type MowEventType = "MOW";
type GlobalStatisticsType = "STATISTICS";

type ItemType = MowEventType | GlobalStatisticsType;

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

export interface GlobalStatistics extends DynamoDbItem {
    PK: `GLOBAL#${GlobalStatisticsType}`,
    SK: `GLOBAL#${GlobalStatisticsType}`,
    Type: GlobalStatisticsType,
    updated: string;
    /** Total number of events that have been recordeded all-time */
    total: number;
    /** All-time groupings of events by day of the week. Sunday = 0 */
    dayOfWeekRaw: number[];
    /** All-time groupings of events by day of month, zero-indexed so day 1 is in index 0, day 31 is in index 30. */
    dayOfMonthRaw: number[];
    /** All-time groupings of events by month of year, zero-indexed so January is in index 0, December is in index 11. */
    monthOfYearRaw: number[];
    /** All-time groupings of events by hour of the day, in US Central Time, zero-indexed. */
    hourOfDayRaw: number[];
}