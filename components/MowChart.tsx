import { Header, Segment } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { GlobalStatistics } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface MowChartProps {
    globalStatistics: GlobalStatistics;
}

const MowChart: React.FC<MowChartProps> = ({ globalStatistics }) => {
    const [dayOfWeekChartProps, setDayOfWeekChartProps] = useState<Highcharts.Options>();
    const [dayOfMonthChartProps, setDayOfMonthChartProps] = useState<Highcharts.Options>();
    const [monthOfYearChartProps, setMonthOfYearChartProps] = useState<Highcharts.Options>();
    const [hourOfDayChartProps, setHourOfDayChartProps] = useState<Highcharts.Options>();

    useEffect(() => {
        const { dayOfWeekRaw, dayOfMonthRaw, monthOfYearRaw, hourOfDayRaw } = globalStatistics;

        let maxDayOfWeek = 0;
        for (const val of dayOfWeekRaw) {
            if (val > maxDayOfWeek) {
                maxDayOfWeek = val;
            }
        }

        let maxDayOfMonth = 0;
        for (const val of dayOfMonthRaw) {
            if (val > maxDayOfMonth) {
                maxDayOfMonth = val;
            }
        }

        let maxMonthOfYear = 0;
        for (const val of monthOfYearRaw) {
            if (val > maxMonthOfYear) {
                maxMonthOfYear = val;
            }
        }

        let maxHourOfDay = 0;
        for (const val of hourOfDayRaw) {
            if (val > maxHourOfDay) {
                maxHourOfDay = val;
            }
        }

        const dayOfWeekOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: "200px"
            },
            title: {
                text: undefined
            },
            legend: { enabled: false },
            xAxis: {
                categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                title: {
                    text: "Day of Week"
                }
            },
            yAxis: {
                title: {
                    text: "Count"
                },
                tickInterval: 1,
                max: maxDayOfWeek
            },
            series: [
                {
                    name: "Observed Mow Count",
                    type: "column",
                    data: dayOfWeekRaw, // Counts on the y-axis
                    color: "green"
                }
            ],
            credits: {
                enabled: false
            }
        };
        setDayOfWeekChartProps(dayOfWeekOptions);

        const monthOfYearOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: "200px"
            },
            title: {
                text: undefined
            },
            legend: { enabled: false },
            xAxis: {
                categories: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                title: {
                    text: "Month of Year"
                }
            },
            yAxis: {
                title: {
                    text: "Count"
                },
                tickInterval: 1,
                max: maxMonthOfYear
            },
            series: [
                {
                    name: "Observed Mow Count",
                    type: "column",
                    data: monthOfYearRaw, // Counts on the y-axis
                    color: "green"
                }
            ],
            credits: {
                enabled: false
            }
        };
        setMonthOfYearChartProps(monthOfYearOptions);

        const dayOfMonthOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: "200px"
            },
            legend: { enabled: false },
            title: {
                text: undefined
            },
            xAxis: {
                categories: dayOfMonthRaw.map((_, index) => (index + 1).toString()),
                title: {
                    text: "Day of Month"
                }
            },
            yAxis: {
                title: {
                    text: "Count"
                },
                tickInterval: 1,
                max: maxDayOfMonth
            },
            series: [
                {
                    name: "Observed Mow Count",
                    type: "column",
                    data: dayOfMonthRaw, // Counts on the y-axis
                    color: "green"
                }
            ],
            credits: {
                enabled: false
            }
        };
        setDayOfMonthChartProps(dayOfMonthOptions);

        const hourOfDayOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: "200px"
            },
            legend: { enabled: false },
            title: {
                text: undefined
            },
            xAxis: {
                categories: hourOfDayRaw.map((_, index) => {
                    if (index === 0) {
                        return "12 AM";
                    }
                    if (index === 12) {
                        return "12 PM";
                    }
                    if (index < 12) {
                        return `${index} AM`;
                    }
                    return `${index - 12} PM`;
                }),
                title: {
                    text: "Hour of Day"
                }
            },
            yAxis: {
                title: {
                    text: "Count"
                },
                tickInterval: 1,
                max: maxHourOfDay
            },
            series: [
                {
                    name: "Observed Mow Count",
                    type: "column",
                    data: hourOfDayRaw, // Counts on the y-axis
                    color: "green"
                }
            ],
            credits: {
                enabled: false
            }
        };
        setHourOfDayChartProps(hourOfDayOptions);
    }, [globalStatistics]);

    return (
        <Segment>
            <Header content={`${globalStatistics.total} mows recorded all-time`} />
            <HighchartsReact highcharts={Highcharts} options={dayOfWeekChartProps} />
            <HighchartsReact highcharts={Highcharts} options={dayOfMonthChartProps} />
            <HighchartsReact highcharts={Highcharts} options={monthOfYearChartProps} />
            <HighchartsReact highcharts={Highcharts} options={hourOfDayChartProps} />
        </Segment>
    );
};

export default MowChart;
