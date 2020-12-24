/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  atag: { color: "white", textDecoration: "none" },
}));

export default function TopNavBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          <Link href="/">
            <a className={classes.atag}>CrowdsourceIt!</a>
          </Link>
        </Typography>
        <Button color="inherit">
          <Link href="/">
            <a className={classes.atag}>
              <Typography color="inherit">Show All</Typography>
            </a>
          </Link>
        </Button>

        <Button color="inherit">
          <Link href="/campaigns/new">
            <a className={classes.atag}>
              <Typography color="inherit">Create New</Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
