import React, { Fragment } from "react";

import { Sheet, Stack, Box, Link, Divider } from '@mui/joy';
import crc_logo from "@images/CRC_LOGO.jpg";
import nuu_logo from "@images/NCU_LOGO.jpg";
import twi_logo from "@images/TWI_LOGO.jpg";
import uga_logo from "@images/UGA_LOGO.jpg";
import renci_logo from "@images/renci-logo.png";

export const Acknowledgements = () => {

    return(
        <Fragment>
            <Sheet
                variant="soft"
                        sx={{
                          position: 'absolute',
                          bottom: 0, left: 75,
                          height: '50vh',
                          zIndex: 900,
                          maxHeight: '25px',
                          overflow: 'hidden',
                          p: 0,
                          transition: 'max-height 250ms, filter 250ms, background-color 1000ms 500ms',
                          display: 'flex',
                          flexDirection: 'row',
                          background: 'white',
                        }}>
                <Stack alignItems="left" spacing={2} direction="row">
                    <Link href="https://www.coastalresiliencecenter.org/" underline="none">
                        <Box
                            component="img"
                            height="18px"
                            sx={{ pb: .25, pl: .25 }}
                            alt="Coastal Resilience Center"
                            src={ crc_logo }>
                        </Box>
                    </Link>
                    <Divider />
                    <Link href="https://renci.org/research/earth-data-science-research/" underline="none">
                        <Box
                            component="img"
                            height="18px"
                            alt="Renaissance Computing Institute"
                            src={ renci_logo }
                        />
                    </Link>
                    <Divider />
                    <Link href="https://thewaterinstitute.org/" underline="none">
                        <Box
                            component="img"
                            height="18px"
                            alt="The Water Institute"
                            src={ twi_logo }
                        />
                    </Link>
                    <Divider />
                    <Link href="https://ccee.ncsu.edu/research/ewc/" underline="none">
                        <Box
                            component="img"
                            height="18px"
                            alt="North Carolina State University"
                            src={ nuu_logo }
                        />
                    </Link>
                    <Divider />
                    <Link href="https://engineering.uga.edu/team_member/matthew-v-bilskie/" underline="none">
                        <Box
                            component="img"
                            height="18px"
                            sx={{ pr: .5 }}
                            alt="University of Georgia"
                            src={ uga_logo }
                        />
                    </Link>
                </Stack>
           </Sheet>
        </Fragment>
    );
};