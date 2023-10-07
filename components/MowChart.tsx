import React, { useEffect, useState } from "react";

import { GlobalStatistics } from "../types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Segment } from "semantic-ui-react";

interface MowChartProps {
    globalStatistics: GlobalStatistics;
}

const MowChart: React.FC<MowChartProps> = ({ globalStatistics }) => {
    const [dayOfWeekChartProps, setDayOfWeekChartProps] = useState<Highcharts.Options>();
    const [dayOfMonthChartProps, setDayOfMonthChartProps] = useState<Highcharts.Options>();

    useEffect(() => {
        const { dayOfWeekRaw, dayOfMonthRaw } = globalStatistics;

        const dayOfWeekOptions: Highcharts.Options = {
            chart: {
                type: "column"
            },
            title: {
                text: undefined
            },
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
                    data: dayOfWeekRaw, // Counts on the y-axis
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
        setDayOfWeekChartProps(dayOfWeekOptions);

        const dayOfMonthOptions: Highcharts.Options = {
            chart: {
                type: "column"
            },
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
                    data: dayOfMonthRaw, // Counts on the y-axis
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
        setDayOfMonthChartProps(dayOfMonthOptions);
    }, [globalStatistics]);

    return (
        <Segment>
            <HighchartsReact highcharts={Highcharts} options={dayOfWeekChartProps} />
            <HighchartsReact highcharts={Highcharts} options={dayOfMonthChartProps} />
        </Segment>
    );
};

export default MowChart;
