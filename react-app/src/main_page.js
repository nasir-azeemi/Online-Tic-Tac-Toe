import React from 'react';

import {
  Button,
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';

import background from "./bkg.png";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    verticalAlign: 'middle'
  },
  btn: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Page()
{
  const classes = useStyles();

  return (
      <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
      style={{backgroundImage: `url(${background})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: "center",
      backgroundSize: "contain",
      position: 'absolute', 
      left: '50%', 
      top: '50%',
      transform: 'translate(-50%, -50%)'}}
      >

      <Container>
        <Typography variant="h5" align="center">
        TIC TAC TOE ONLINE
        </Typography>
        
        <div className={classes.paper}>
              <Button
              fullWidth
              type="submit"
                variant="contained"
                color="primary"
                className={classes.btn}
                href="/game"
              >
                Play Offline
              </Button>

              <Button
              type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.btn}
                href="/game_online"
              >
                Play Online
              </Button>

              <Button
              type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.btn}
                href="/login"
              >
                Log In
              </Button>

        </div>
      </Container>
      </Box>
  );
}
