import { DarkMode, Description, GitHub, LightMode, Twitter } from '@mui/icons-material';
import { Container, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/system';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useContext } from 'react';
import { DarkModeContext } from './DarkModeContext';
import { SupportedChains } from '@components/tracer/Chains';
import Button from '@mui/material/Button';
import { MenuItem, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { grey } from '@mui/material/colors';

export type NavbarLink = {
    name: string;
    url: string;
};

export type NavbarProps = {
    title: string;
    description: string;
    icon: string;
    url: string;
    content: React.ReactNode;
    links?: NavbarLink[];
};

function Navbar(props: NavbarProps) {
    const [usingDarkMode, setUsingDarkMode] = useContext(DarkModeContext);

    const router = useRouter();
    const { chain, txhash } = router.query;

    const [searchChain, setChain] = React.useState('ethereum');
    const [searchTxhash, setTxhash] = React.useState('');

    React.useEffect(() => {
        if (!chain || Array.isArray(chain)) return;
        if (!txhash || Array.isArray(txhash)) return;

        setChain(chain);
        setTxhash(txhash);
    }, [chain, txhash]);

    const doSearch = () => {
        if (/0x[0-9a-fA-F]{64}/g.test(searchTxhash)) {
            router.push(`/${searchChain}/${searchTxhash}`);
        }
    };
    
    return (
        <div>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={props.description} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={props.title} />
                <meta property="og:description" content={props.description} />
                <meta property="og:image" content={props.icon} />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={props.title} />
                <meta property="twitter:description" content={props.description} />
                <meta property="twitter:url" content={'https://openchain.xyz' + props.url} />
                <meta property="twitter:image" content={props.icon} />
                <meta property="twitter:site" content="@samczsun" />
                <link rel="icon" href={props.icon} />
            </Head>

            <Container maxWidth={false}>
                <Grid2 container justifyContent="center" alignContent="center" p={2} spacing={1}>
                    <Grid2 justifyContent="center" alignContent="center"  style={{ cursor: 'pointer' }}>
                        <Link href={props.url}>
                            <Box justifyContent="center" alignContent="center" >
                                <Image src={props.icon} width="24" height="24" alt="logo" />
                            </Box>
                        </Link>
                    </Grid2>
                    <Grid2 justifyContent="center" alignContent="center"  sx={{ display: { xs: 'none', md: 'initial' }, marginRight: 2 }}>
                        <Link href={props.url}>
                            <Typography fontFamily="NBInter">{props.title}</Typography>
                        </Link>
                    </Grid2>
                    <Grid2 justifyContent="center" alignContent="center" >
                        <TextField
                            onChange={(event) => setChain(event.target.value)}
                            value={searchChain}
                            variant="standard"
                            select
                            fullWidth
                            SelectProps={{
                                style: {
                                    fontFamily: 'RiformaLL',
                                },
                                disableUnderline: true,
                            }}
                        >
                            {SupportedChains.map((v) => {
                                return (
                                    <MenuItem key={v.id} value={v.id} style={{ fontFamily: 'RiformaLL' }}>
                                        {v.displayName}
                                    </MenuItem>
                                );
                            })}
                            {!SupportedChains.find((sChain) => sChain.id === searchChain) ? (
                                <MenuItem key={searchChain} value={searchChain} style={{ fontFamily: 'RiformaLL' }}>
                                    {searchChain}
                                </MenuItem>
                            ) : null}
                        </TextField>
                    </Grid2>
                    <Grid2 justifyContent="center" alignContent="center"  xs>
                        <TextField
                            variant="standard"
                            placeholder="Enter txhash..."
                            style={{ width: `78ch` }}
                            onChange={(event) => setTxhash(event.target.value)}
                            value={searchTxhash}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    doSearch();
                                }
                            }}
                            inputProps={{
                                style: {
                                    fontFamily: 'RiformaLL',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => doSearch()}
                                        style={{
                                            fontFamily: 'RiformaLL',
                                            color: "#fff",
                                            borderColor: "#fff",
                                        }}
                                    >
                                        View
                                    </Button>
                                ),
                                disableUnderline: true,
                            }}
                        ></TextField>
                    </Grid2>
                    <Grid2>
                        <a
                            href="https://github.com/openchainxyz/openchain-monorepo"
                            target={'_blank'}
                            rel={'noreferrer noopener'}
                        >
                            <GitHub />
                        </a>
                    </Grid2>
                    <Grid2 onClick={() => setUsingDarkMode(!usingDarkMode)}>
                        {usingDarkMode ? <LightMode /> : <DarkMode />}
                    </Grid2>
                </Grid2>

                <Divider></Divider>
            </Container>
        </div>
    );
}

export default Navbar;
