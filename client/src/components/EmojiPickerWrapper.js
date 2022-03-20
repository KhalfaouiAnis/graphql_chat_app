import Picker from "emoji-picker-react";

const EmojiPickerWrapper = ({ onEmojiClick, shown }) => {
  return (
    <div className={`emoji-picker ${!shown ? "hidden" : ""}`}>
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPickerWrapper;
