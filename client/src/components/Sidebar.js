import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useQuery } from "@apollo/client";
import {
  Box,
  Typography,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { GET_ALL_USERS } from "../graphql/queries";

import UserCard from "./UserCard";

const Sidebar = ({ setAuthenticated }) => {
  const { loading, data, error } = useQuery(GET_ALL_USERS);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6">Please whait !</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    console.log(error);
  }

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="10px">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          className="auth-links"
          textAlign="center"
          color="blue"
          variant="h6"
          onClick={() => navigate("/")}
        >
          Chat
        </Typography>
        <LogoutIcon
          className="auth-links"
          onClick={() => {
            localStorage.removeItem("jwt");
            setAuthenticated(false);
          }}
        />
      </Stack>
      <Divider />
      {data.users.map((item) => (
        <UserCard key={item.id} item={item} />
      ))}
    </Box>
  );
};

export default Sidebar;
