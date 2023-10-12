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

    useEffect(() => {
        const { dayOfWeekRaw, dayOfMonthRaw } = globalStatistics;

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
    }, [globalStatistics]);

    return (
        <Segment>
            <Header content={`${globalStatistics.total} mows recorded all-time`} />
            <HighchartsReact highcharts={Highcharts} options={dayOfWeekChartProps} />
            <HighchartsReact highcharts={Highcharts} options={dayOfMonthChartProps} />
        </Segment>
    );
};

export default MowChart;
