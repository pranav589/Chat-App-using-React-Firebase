import React, { useEffect } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./MessageForm.css";

function MessageForm({ handleSend, text, setText, setImg, img }) {
  return (
    <form className="message_form" onSubmit={handleSend}>
      <label htmlFor="img">
        <UploadIcon style={{ cursor: "pointer" }} />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        onChange={(e) => {
          alert(
            "Image Selected. Please type a caption for it or directly click send button!"
          );
          setImg(e.target.files[0]);
        }}
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#1bbd7e",
            marginTop: 8,
          }}
          className="btn"
        >
          Send
        </Button>

        <SendIcon
          style={{ color: "#1bbd7e", cursor: "pointer" }}
          className="mob"
          onClick={handleSend}
        />
      </div>
    </form>
  );
}

export default MessageForm;
