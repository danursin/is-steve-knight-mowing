import { Button, Header, Icon, List, Segment } from "semantic-ui-react";
import React, { useCallback, useEffect, useState } from "react";

import { MowEvent } from "../types";
import { toast } from "react-toastify";

const MowList: React.FC = () => {
    const [mows, setMows] = useState<MowEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastKey, setLastKey] = useState<string | undefined>(undefined);

    const getMows = useCallback(async (lastKey: string | undefined) => {
        try {
            const take = 3;
            const query = new URLSearchParams({ take: take.toString() });
            if (lastKey) {
                query.set("last_key", lastKey);
            }
            const response = await fetch(`/api/list-mows?${query.toString()}`);
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const json = (await response.json()) as { items: MowEvent[]; last_evaluated_key: string | undefined };
            setMows((prev) => [...prev, ...json.items]);
            setLoading(false);
            setLastKey(json.last_evaluated_key);
        } catch (err) {
            toast.error(`Error fetching mow list. Please try again later`);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await getMows(undefined);
        })();
    }, [getMows]);

    return (
        <Segment>
            <Header content="Mow History" />
            {loading && !mows.length && <Icon name="spinner" loading />}
            <List>
                {mows.map((mow) => (
                    <List.Item key={mow.SK}>
                        <List.Content>
                            <List.Header>
                                {new Date(mow.SK).toLocaleDateString()}{" "}
                                {new Date(mow.SK).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </List.Header>
                            <List.Description>
                                {mow.note || (
                                    <>
                                        <Icon name="frown" />
                                        <i style={{ color: "grey" }}>Sadly, no note entered</i>
                                    </>
                                )}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                ))}
                {lastKey && (
                    <List.Item>
                        <List.Content>
                            <List.Header>
                                <Button
                                    icon="plus"
                                    size="small"
                                    loading={loading}
                                    type="button"
                                    onClick={() => getMows(lastKey)}
                                    content="Load more"
                                />
                            </List.Header>
                        </List.Content>
                    </List.Item>
                )}
            </List>
        </Segment>
    );
};

export default MowList;
