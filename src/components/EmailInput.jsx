import React, { useState, useRef, useEffect } from "react";
import { retrieveEmails } from "../services/retrieveEmails";
import { validateEmail } from "../utility/validateEmail";

const EmailInput = () => {
  const [oInput, setInput] = useState("");
  const [sEmails, setEmails] = useState([]);
  const [isShowingDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const [oSuggestions, setMailSuggests] = useState([]);
  const [oAllEmails, setAllEmails] = useState([]);

  useEffect(() => {
    retrieveEmails().then(setAllEmails);
  }, []);

  useEffect(() => {
  if (!oInput.trim()) {
    setMailSuggests([]);
    setShowDropdown(false);
    return;
  }
  
  const filtered = oAllEmails
      .filter(
        (e) =>
          e.toLowerCase().startsWith(oInput.toLowerCase()) &&
          !sEmails.some((em) => em.value === e)
      )
      .slice(0, 5);
      setMailSuggests(filtered);
      setShowDropdown(filtered.length > 0);
  }, [oInput, oAllEmails, sEmails]);

  const addThisEmail = (value) => {
    if (!value.trim()) return;
    setEmails((prev) => [
      ...prev,
      { value: value.trim(), valid: validateEmail(value.trim()) },
    ]);
    setInput("");
    setMailSuggests([]);
    setShowDropdown(false);
  };

  const handleInput = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addThisEmail(oInput);
    } else if (e.key === "Backspace" && !oInput && sEmails.length) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handleSuggestionClick = (email) => {
    addThisEmail(email);
    inputRef.current.focus();
  };

  const removeEmail = (idx) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="email-input-container">
      <div className="email-input-box" onClick={() => inputRef.current.focus()}>
        {sEmails.map((em, idx) => (
          <span
            key={em.value + idx}
            className={`email-chip${em.valid ? "" : " invalid"}`}
          >
            {em.value}
            {!em.valid && (
              <span className="invalid-icon">!</span>
            )}
            <button
              className="remove-btn"
              onClick={() => removeEmail(idx)}
              aria-label="Remove"
              type="button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={oInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Enter recipients..."
          className="email-input"
          aria-label="Email input"
        />
      </div>
      {isShowingDropdown && (
        <ul className="email-suggestions">
          {oSuggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => handleSuggestionClick(s)}
              className="suggested-email"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailInput;