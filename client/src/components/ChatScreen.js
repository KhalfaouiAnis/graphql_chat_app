import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import EmojiPicker from "./EmojiPickerWrapper";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  TextField,
} from "@mui/material";

import { GET_MESSAGES } from "../graphql/queries";
import { SEND_MESSAGE } from "../graphql/mutations";
import { MESSAGE_SUBSCRIPTION } from "../graphql/subscriptions";

import MessageCard from "./MessageCard";
import Clickable from "./Clickable";

const ChatScreen = () => {
  const { id, name } = useParams();
  const [textMessage, setTextMessage] = useState("");
  const textInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [messages, setMessages] = useState([]);

  const { loading } = useQuery(GET_MESSAGES, {
    variables: {
      receiverId: +id,
    },
    onCompleted(data) {
      setMessages(data.messagesByUser);
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const {} = useSubscription(MESSAGE_SUBSCRIPTION, {
    onSubscriptionData({ subscriptionData: { data } }) {
      setMessages((prevState) => [...prevState, data.messageAdded]);
    },
  });

  const onEmojiClick = (event, { emoji }) => {
    const ref = textInputRef.current;
    ref.focus();
    const start = textMessage.substring(0, ref.selectionStart);
    const end = textMessage.substring(ref.selectionStart);
    const text = start + emoji + end;
    setTextMessage(text);
    setCursorPosition(start.length + emoji.length);
  };

  const handleShowEmojiPicker = () => {
    textInputRef.current.focus();
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    textInputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

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
        height="78vh"
      >
        {loading ? (
          <Typography variant="h3">Loading chats</Typography>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.createdAt}
              text={msg.text}
              date={msg.createdAt}
              direction={msg.receiverId === +id ? "end" : "start"}
            />
          ))
        )}
        <EmojiPicker shown={showEmojiPicker} onEmojiClick={onEmojiClick} />
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Clickable color="blue">
          <div className="emoji-icon">
            <EmojiEmotionsIcon onClick={handleShowEmojiPicker} />
          </div>
        </Clickable>
        <TextField
          ref={textInputRef}
          sx={{ paddingLeft: "4px" }}
          placeholder="Type a message..."
          variant="standard"
          fullWidth
          multiline
          rows={2}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <Clickable color="blue">
          <SendIcon
            onClick={() => {
              if (!textMessage) return;
              setShowEmojiPicker(false);
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
        </Clickable>
      </Stack>
    </Box>
  );
};

export default ChatScreen;
