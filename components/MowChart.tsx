import { Form, Header, Input, Segment } from "semantic-ui-react";
import React, { useCallback, useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MowEvent } from "../types";
import { toast } from "react-toastify";

function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month < 10 ? `0${month}` : month, day < 10 ? `0${day}` : day].join("-");
}

function fromISODate(date: string): Date {
    const [year, month, day] = date.split("-");
    return new Date(+year, +month - 1, +day);
}

const MowChart: React.FC = () => {
    const [mows, setMows] = useState<MowEvent[]>();
    const [chartProps, setChartProps] = useState<Highcharts.Options>();
    const [startDate, setStartDate] = useState<string>(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return toISODate(thirtyDaysAgo);
    });
    const [endDate, setEndDate] = useState<string>(() => {
        const today = new Date();
        return toISODate(today);
    });

    const getMows = useCallback(async ({ start_date, end_date }: { start_date: string; end_date: string }) => {
        const query = new URLSearchParams({
            start_date,
            end_date
        });
        const response = await fetch("/api/list-mows?" + query.toString());
        if (!response.ok) {
            toast.error(await response.text());
            return;
        }
        const data = (await response.json()) as MowEvent[];
        setMows(data);
    }, []);

    useEffect(() => {
        if (endDate < startDate) {
            toast.warning(`End date cannot be earlier than start date`);
            return;
        }
        (async () => {
            const end_date = fromISODate(endDate).toISOString();
            const start_date = fromISODate(startDate).toISOString();
            await getMows({ end_date, start_date });
        })();
    }, [endDate, getMows, startDate]);

    useEffect(() => {
        if (!mows) {
            return;
        }

        const mappedData = mows.map((mow) => {
            return {
                date: new Date(mow.timestamp).toLocaleDateString(),
                count: 1
            };
        });

        const dates = [...new Set(mappedData.map((mow) => mow.date))];
        const counts = dates.map((date) => {
            const matches = mappedData.filter((d) => d.date === date);
            return matches.length;
        });

        const options: Highcharts.Options = {
            chart: {
                type: "column"
            },
            title: {
                text: undefined
            },
            xAxis: {
                categories: dates, // Dates on the x-axis
                title: {
                    text: "Date"
                }
            },
            yAxis: {
                title: {
                    text: "Count"
                },
                tickInterval: 1
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: () => false // Prevent clicking on the series name from hiding the series
                    }
                }
            },
            series: [
                {
                    name: "Observed Mow Count",
                    type: "column",
                    data: counts, // Counts on the y-axis
                    dataLabels: {
                        enabled: true,
                        format: "{point.y}", // Show the count value on top of each column
                        style: {
                            fontWeight: "bold"
                        }
                    },
                    color: "green"
                }
            ],
            credits: {
                enabled: false
            }
        };
        setChartProps(options);
    }, [endDate, mows, startDate]);

    return (
        <Segment>
            <Header
                textAlign="center"
                content={
                    <>
                        Mow Counts from
                        <Form.Input
                            type="date"
                            fluid
                            value={startDate}
                            size="mini"
                            max={endDate}
                            onChange={(e, { value }) => setStartDate(value)}
                        />{" "}
                        to{" "}
                        <Form.Input
                            type="date"
                            value={endDate}
                            size="mini"
                            fluid
                            min={startDate}
                            onChange={(e, { value }) => setEndDate(value)}
                        />
                    </>
                }
            />

            {!!mows && !mows.length && <Header textAlign="center" content="No mowing events recorded in this range" color="red" />}
            {!!mows && !!mows.length && <HighchartsReact highcharts={Highcharts} options={chartProps} />}
        </Segment>
    );
};

export default MowChart;
