import "react-toastify/dist/ReactToastify.css";

import { Button, Form, Grid, Header, Modal, Segment, Statistic } from "semantic-ui-react";
import { GetStaticProps, GetStaticPropsResult } from "next";
import { ToastContainer, toast } from "react-toastify";
import { getMostRecentMow, getMows } from "../services/mowService";
import { useCallback, useState } from "react";

import Layout from "../components/Layout";
import MostRecentMow from "../components/MostRecentMow";
import MowChart from "../components/MowChart";
import { MowEvent } from "../types";
import SteveKnightExplanation from "../components/SteveKnightExplanation";
import SubmitMowEvent from "../components/SubmitMowEvent";

interface HomeProps {
    mostRecentMow?: MowEvent | undefined;
}

const Home: React.FC<HomeProps> = ({ mostRecentMow: initalMostRecentMow }) => {
    const [mostRecentMow, setMosetRecentMow] = useState<MowEvent | undefined>(initalMostRecentMow);
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
                    <MowChart />
                </Grid.Column>
                <Grid.Column>
                    <SubmitMowEvent onSave={setMosetRecentMow} />
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async (): Promise<GetStaticPropsResult<HomeProps>> => {
    const mostRecentMow = await getMostRecentMow();
    return {
        props: {
            mostRecentMow
        }
    };
};
