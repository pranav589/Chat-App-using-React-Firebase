import React from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./MessageForm.css";

function MessageForm({ handleSend, text, setText, setImg }) {
  return (
    <form className="message_form" onSubmit={handleSend}>
      <label htmlFor="img">
        <UploadIcon style={{ cursor: "pointer" }} />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => setImg(e.target.files[0])}
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

        <SendIcon style={{ color: "#1bbd7e" }} className="mob" />
      </div>
    </form>
  );
}

export default MessageForm;
