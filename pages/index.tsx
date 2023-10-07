import "react-toastify/dist/ReactToastify.css";

import { GetStaticProps, GetStaticPropsResult } from "next";
import { GlobalStatistics, MowEvent } from "../types";
import { getGlobalStatistics, getMostRecentMow } from "../services/mowService";
import { useCallback, useState } from "react";

import { Grid } from "semantic-ui-react";
import Layout from "../components/Layout";
import MostRecentMow from "../components/MostRecentMow";
import MowChart from "../components/MowChart";
import SteveKnightExplanation from "../components/SteveKnightExplanation";
import SubmitMowEvent from "../components/SubmitMowEvent";
import { ToastContainer } from "react-toastify";

interface HomeProps {
    mostRecentMow?: MowEvent | undefined;
    globalStatistics: GlobalStatistics;
}

const Home: React.FC<HomeProps> = ({ mostRecentMow: initalMostRecentMow, globalStatistics: initialGlobalStatistics }) => {
    const [mostRecentMow, setMosetRecentMow] = useState<MowEvent | undefined>(initalMostRecentMow);
    const [globalStatistics, setGlobalStatistics] = useState<GlobalStatistics>(initialGlobalStatistics);

    const handleOnSave = useCallback(({ mow, globalStatistics }: { mow: MowEvent; globalStatistics: GlobalStatistics }) => {
        setMosetRecentMow(mow);
        setGlobalStatistics(globalStatistics);
    }, []);

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

export const getStaticProps: GetStaticProps<HomeProps> = async (): Promise<GetStaticPropsResult<HomeProps>> => {
    const [mostRecentMow, globalStatistics] = await Promise.all([getMostRecentMow(), getGlobalStatistics()]);
    return {
        props: {
            mostRecentMow,
            globalStatistics
        }
    };
};
