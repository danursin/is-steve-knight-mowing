import { Placeholder } from "semantic-ui-react";
import React from "react";

const SimpleLoader: React.FC = () => {
    return (
        <Placeholder fluid>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>
    );
};

export default SimpleLoader;
