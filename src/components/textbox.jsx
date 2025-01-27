import React from "react";
import "./textbox.css";

const TextBox = ({ comment, setNewComment }) => {
  return (
    <div className="textbox-container">
      <label htmlFor="textbox" className="textbox-label">
        Comment:
      </label>
      <input
        type="text"
        id="textbox"
        value={comment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Tell us the story (if you want)."
        className="textbox-input"
      />
      <p className="textbox-preview">Comment: {comment}</p>
    </div>
  );
};

export default TextBox;