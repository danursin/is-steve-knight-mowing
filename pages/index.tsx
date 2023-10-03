import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { useCallback, useState } from "react";

import { Form } from "semantic-ui-react";
import Layout from "../components/Layout";
import { MowEvent } from "../types";

const Home: React.FC = () => {
    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

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
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [note]);

    return (
        <Layout>
            <ToastContainer theme="colored" />
            <Form onSubmit={handleOnSubmit} loading={loading}>
                <Form.TextArea
                    rows={3}
                    value={note || ""}
                    onChange={(e, { value }) => setNote(value as string)}
                    placeholder="Is he mowing? Again? Tell me about it..."
                />
                <Form.Button fluid icon="cut" type="submit" content="Bob is Mowing Now!" color="green" basic />
            </Form>
        </Layout>
    );
};

export default Home;
