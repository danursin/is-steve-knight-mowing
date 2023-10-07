import { Button, Form, Modal } from "semantic-ui-react";
import { GlobalStatistics, MowEvent } from "../types";
import React, { useCallback, useState } from "react";

import { toast } from "react-toastify";

interface SubmitMowEventProps {
    onSave: (result: { mow: MowEvent; globalStatistics: GlobalStatistics }) => void;
}

const SubmitMowEvent: React.FC<SubmitMowEventProps> = ({ onSave }) => {
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

            const result = await response.json();

            toast.success("Steve Knight mowing event recorded successfully!");
            setNote(undefined);
            setIsModalOpen(false);

            onSave(result);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [note, onSave]);

    return (
        <>
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
        </>
    );
};

export default SubmitMowEvent;
