import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { GET_MESSAGES } from "../graphql/queries";
import { SEND_MESSAGE } from "../graphql/mutations";
import SendIcon from "@mui/icons-material/Send";
import MessageCard from "./MessageCard";

const ChatScreen = () => {
  const { id, name } = useParams();
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { loading, data, error } = useQuery(GET_MESSAGES, {
    variables: {
      receiverId: +id,
    },
    onCompleted(data) {
      setMessages(data.messagesByUser);
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted(data) {
      setMessages((prevState) => [...prevState, data.createMessage]);
    },
  });

  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/:${name}.svg`}
            sx={{
              width: "32px",
              height: "32px",
              mr: 2,
            }}
          />
          <Typography color="black" variant="h6">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{ overflowY: "auto" }}
        padding="10px"
        backgroundColor="#f5f5f5"
        height="80vh"
      >
        {loading ? (
          <Typography variant="h3">Loading chats</Typography>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.createdAt}
              text={msg.text}
              date={msg.createdAt}
              direction={msg.receiverId == +id ? "end" : "start"}
            />
          ))
        )}
      </Box>
      <Stack direction="row">
        <TextField
          placeholder="Type a message"
          variant="standard"
          fullWidth
          multiline
          rows={2}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <SendIcon
          onClick={() => {
            if (!textMessage) return;
            sendMessage({
              variables: {
                receiverId: +id,
                text: textMessage,
              },
            });
            setTextMessage("");
          }}
          fontSize="large"
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
