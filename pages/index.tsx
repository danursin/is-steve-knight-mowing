import "react-toastify/dist/ReactToastify.css";

import { Button, Form, Grid, Header, Modal, Segment, Statistic } from "semantic-ui-react";
import { GetStaticProps, GetStaticPropsResult } from "next";
import { ToastContainer, toast } from "react-toastify";
import { getMostRecentMow, getMows } from "../services/mowService";
import { useCallback, useState } from "react";

import Layout from "../components/Layout";
import { MowEvent } from "../types";

interface HomeProps {
    mostRecentMow?: MowEvent | undefined;
    mowList: MowEvent[];
}

const Home: React.FC<HomeProps> = ({ mostRecentMow, mowList }) => {
    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleOnSubmit = useCallback(async () => {
        try {
            setLoading(true);

            const position = await new Promise<GeolocationPosition>((response, reject) => {
                navigator.geolocation.getCurrentPosition(response, reject, {
                    timeout: 5000,
                    enableHighAccuracy: true,
                    maximumAge: 0
                });
            });

            const { accuracy, latitude, longitude } = position.coords;

            const item: Partial<MowEvent> = {
                geolocation: { accuracy, latitude, longitude },
                note: note || undefined
            };

            const response = await fetch("/api/create-mow", {
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast.success("Steve Knight mowing event recorded successfully!");
            setNote(undefined);
            setIsModalOpen(false);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [note]);

    return (
        <Layout>
            <ToastContainer theme="colored" />

            <Grid textAlign="center">
                <Grid.Column>
                    {mostRecentMow && (
                        <Statistic color="green">
                            <Statistic.Value>{new Date(mostRecentMow.timestamp).toLocaleString()}</Statistic.Value>
                            <Statistic.Label content="Last Reported Mow" />
                        </Statistic>
                    )}
                    {!mostRecentMow && <Header content="Um, there are no recorded mow events. That doesn't make any sense" color="red" />}
                </Grid.Column>
            </Grid>

            <Segment>
                <p>Steve Knight seems to mow his grass a lot. Like a lot a lot. </p>
                <p>
                    Sometimes it appears that he mows multiple separate times in a single day and very frequently several times in the same
                    week.
                </p>
                <p>
                    This application helps to answer the question of when he last mowed and whether Steve Knight is currently mowing the
                    grass. He likely is.
                </p>
            </Segment>

            <Button
                color="black"
                icon="calendar"
                type="button"
                content="Report a mowing event"
                fluid
                onClick={() => setIsModalOpen(true)}
            />

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeIcon>
                <Modal.Header content="Report a mowing event" />
                <Modal.Content>
                    <Form onSubmit={handleOnSubmit} loading={loading}>
                        <p>
                            To report a Steve Knight mowing event, you must have actually seen him mowing at his house. Remote reports are
                            not accepted.
                        </p>
                        <Form.TextArea
                            rows={3}
                            value={note || ""}
                            onChange={(e, { value }) => setNote(value as string)}
                            placeholder="Is he mowing? Again? Tell me about it..."
                        />
                        <Form.Button fluid icon="cut" type="submit" content="Steve is Mowing Now!" color="green" basic />
                    </Form>
                </Modal.Content>
            </Modal>
        </Layout>
    );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async (): Promise<GetStaticPropsResult<HomeProps>> => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [mostRecentMow, mowList] = await Promise.all([
        getMostRecentMow(),
        getMows({ start_date: thirtyDaysAgo.toISOString(), end_date: today.toISOString() })
    ]);

    return {
        props: {
            mostRecentMow,
            mowList
        }
    };
};
