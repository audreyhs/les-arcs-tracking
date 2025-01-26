import React, { useState } from "react";
import "./textbox.css";

const TextBox = ({ setNewComment }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    setNewComment(e.target.value);
  };

  return (
    <div className="textbox-container">
      <label htmlFor="textbox" className="textbox-label">
        Comment:
      </label>
      <textarea type="text"
        id="textbox"
        value={text}
        onChange={handleChange}
        placeholder="Type here..."
        className="textbox-input"
      />
    </div>
  );
};

export default TextBox;