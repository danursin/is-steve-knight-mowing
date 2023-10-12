import "react-toastify/dist/ReactToastify.css";

import { GetStaticProps, GetStaticPropsResult } from "next";
import { GlobalStatistics, MowEvent } from "../types";
import { Grid, Header, Icon, Loader } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import { getGlobalStatistics, getMostRecentMow } from "../services/mowService";
import { useCallback, useEffect, useState } from "react";

import Layout from "../components/Layout";
import MostRecentMow from "../components/MostRecentMow";
import MowChart from "../components/MowChart";
import SteveKnightExplanation from "../components/SteveKnightExplanation";
import SubmitMowEvent from "../components/SubmitMowEvent";

const Home: React.FC = () => {
    const [mostRecentMow, setMosetRecentMow] = useState<MowEvent>();
    const [globalStatistics, setGlobalStatistics] = useState<GlobalStatistics>();

    const handleOnSave = useCallback(({ mow, globalStatistics }: { mow: MowEvent; globalStatistics: GlobalStatistics }) => {
        setMosetRecentMow(mow);
        setGlobalStatistics(globalStatistics);
    }, []);

    const getMostRecentMow = useCallback(async () => {
        const response = await fetch("/api/get-most-recent-mow");
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = (await response.json()) as MowEvent;
        return json;
    }, []);

    const getGlobalStatistics = useCallback(async () => {
        const response = await fetch("/api/get-global-statistics");
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = (await response.json()) as GlobalStatistics;
        return json;
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [mow, stats] = await Promise.all([getMostRecentMow(), getGlobalStatistics()]);
                setMosetRecentMow(mow);
                setGlobalStatistics(stats);
            } catch (err) {
                toast.error(`Error fetching mow data. Please try again later`);
            }
        })();
    }, [getGlobalStatistics, getMostRecentMow]);

    if (!mostRecentMow || !globalStatistics) {
        return <Header icon={<Icon loading name="cog" />} content="Loading mow content" color="grey" />;
    }

    return (
        <Layout>
            <ToastContainer theme="colored" />

            <Grid textAlign="center" columns={1}>
                <Grid.Column>
                    <MostRecentMow mow={mostRecentMow} />
                </Grid.Column>
                <Grid.Column>
                    <SteveKnightExplanation />
                </Grid.Column>
                <Grid.Column>
                    <MowChart globalStatistics={globalStatistics} />
                </Grid.Column>
                <Grid.Column>
                    <SubmitMowEvent onSave={handleOnSave} />
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export default Home;
