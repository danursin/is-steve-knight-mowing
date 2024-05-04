import { Header, Statistic } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { MowEvent } from "../types";

interface MostRecentMowProps {
    mow: MowEvent | undefined;
}

const MostRecentMow: React.FC<MostRecentMowProps> = ({ mow }) => {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        function assembleMessage() {
            if (!mow) {
                return;
            }
            const mowDate = new Date(mow.timestamp);
            const now = new Date();
            const msSinceLastMow = +now - +mowDate;

            const years = Math.floor(msSinceLastMow / (365 * 24 * 60 * 60 * 1000));
            const weeks = Math.floor((msSinceLastMow % (365 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000));
            const days = Math.floor((msSinceLastMow % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
            const hours = Math.floor((msSinceLastMow % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((msSinceLastMow % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((msSinceLastMow % (60 * 1000)) / 1000);

            const segments = [];
            years && segments.push(`${years} year${years > 1 ? "s" : ""}`);
            weeks && segments.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
            days && segments.push(`${days} day${days > 1 ? "s" : ""}`);
            hours && segments.push(`${hours} hour${hours > 1 ? "s" : ""}`);
            minutes && segments.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
            seconds && segments.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

            setMessage(segments.join(", "));
        }

        const interval = setInterval(() => {
            assembleMessage();
        }, 1000);

        assembleMessage();

        return () => {
            clearInterval(interval);
        };
    }, [mow]);

    if (!mow) {
        return <Header content="Um, there are no recorded mow events. That doesn't make any sense" color="red" />;
    }

    return (
        <Statistic color="green" size="small">
            <Statistic.Value>{message}</Statistic.Value>
            <Statistic.Label content={`Last Reported Mow ${new Date(mow.timestamp).toLocaleString()}`} />
        </Statistic>
    );
};

export default MostRecentMow;
