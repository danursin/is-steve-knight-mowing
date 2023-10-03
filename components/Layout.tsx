import { Grid, Header, Menu } from "semantic-ui-react";

import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
    title?: string;
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title = "Is Steve Knight Mowing?", children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Menu fluid tabular>
                <Menu.Item content={<Header content="Is Steve Knight Mowing?" color="black" icon="chess knight" />} position="left" />
            </Menu>
            <Grid padded="horizontally" centered>
                <Grid.Column largeScreen={8} tablet={12} mobile={16}>
                    {children}
                </Grid.Column>
            </Grid>
        </>
    );
};

export default Layout;
