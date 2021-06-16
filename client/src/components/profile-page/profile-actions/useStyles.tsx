import React from "react";
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    button: {
      width: "100%",
    },
  })
);

export const CustomButton = withStyles({
  root: {
    textTransform: "none",
    width: "100%",
  },
})(Button);
