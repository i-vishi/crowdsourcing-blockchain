/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  AppBar,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React from "react";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
  },
  navDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
  },
  linkText: {
    textDecoration: "none",
    textTransform: "uppercase",
    color: "white",
  },
});

export default function TopNavBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Container maxWidth="lg" className={classes.navbarDisplayFlex}>
          <Link href="/">
            <IconButton edge="start" color="inherit">
              <Typography variant="h6">CrowdsourceIt!</Typography>
            </IconButton>
          </Link>
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={classes.navDisplayFlex}
          >
            <Link href="/">
              <ListItem button className={classes.linkText}>
                <ListItemText primary="campaigns" />
              </ListItem>
            </Link>
            <Link href="/campaigns/new">
              <ListItem button className={classes.linkText}>
                <AddIcon />
              </ListItem>
            </Link>
          </List>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
