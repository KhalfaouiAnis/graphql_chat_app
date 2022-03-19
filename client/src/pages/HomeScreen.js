import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  );
};

const HomeScreen = ({ setAuthenticated }) => {
  return (
    <Box display="flex">
      <Sidebar setAuthenticated={setAuthenticated} />
      <AllRoutes />
    </Box>
  );
};

export default HomeScreen;
