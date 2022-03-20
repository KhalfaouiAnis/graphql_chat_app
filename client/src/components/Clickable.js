import { Box } from "@mui/material";

const Clickable = ({ children, color }) => {
  return (
    <Box
      color={color ? color : "inherit"}
      className="d-flex-row clickable-item"
    >
      {children}
    </Box>
  );
};

export default Clickable;
