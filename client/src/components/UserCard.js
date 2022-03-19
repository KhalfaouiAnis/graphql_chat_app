import React from "react";
import { Stack, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserCard = ({ item: { id, firstName, lastName } }) => {
  const navigate = useNavigate();
  return (
    <Stack
      className="user-card"
      direction="row"
      spacing={2}
      sx={{
        py: 1,
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => navigate(`/${id}/${firstName} ${lastName}`)}
    >
      <Avatar
        src={`https://avatars.dicebear.com/api/initials/:${firstName} ${lastName}.svg`}
        sx={{
          width: "32px",
          height: "32px",
        }}
      />
      <Typography variant="subtitle2">
        {firstName} {lastName}
      </Typography>
    </Stack>
  );
};

export default UserCard;
