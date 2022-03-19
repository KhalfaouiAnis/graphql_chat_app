import { Box, Typography } from "@mui/material";
import React from "react";

const MessageCard = ({ text, date, direction }) => {
  return (
    <Box display="flex" justifyContent={direction}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={direction === "end" ? "start" : "end"}
      >
        <Typography variant="subtitle2" backgroundColor="white" padding="5px">
          {text}
        </Typography>
        <Typography variant="caption">
          {new Date(date).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageCard;