import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

const Welcome = () => {
  return (
    <Stack className="d-flex-col">
      {/* <Typography variant="h3">Welcome To TalkiWalki</Typography> */}
      <Avatar
        src="https://www.designbombs.com/wp-content/uploads/2017/01/live-chat-apps-1280x720.jpg"
        sx={{
          width: "500px",
          height: "500px",
        }}
      />
    </Stack>
  );
};

export default Welcome;
