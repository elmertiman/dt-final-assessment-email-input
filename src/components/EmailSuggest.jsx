import React, { useState, useRef, useEffect } from "react";
import { retrieveEmails } from "../services/retrieveEmails";
import { validateEmail } from "../utility/validateEmail";

const EmailSuggest = () => {
  const [objInput, setThisInput] = useState("");
  const [strEmails, setThisEmails] = useState([]);
  const [isShowingDropdown, setIsShowDropdown] = useState(false);
  const objInputRef = useRef(null);
  const [oEmailSuggestions, setThisMailSuggestions] = useState([]);
  const [objAllEmails, setOjbAllEmails] = useState([]);

  useEffect(() => {
    retrieveEmails().then(setOjbAllEmails);
  }, []);

  useEffect(() => {
    if (!objInput.trim()) {
      setThisMailSuggestions([]);
      setIsShowDropdown(false);
      return;
    }
    const filtered = objAllEmails
      .filter(
        (e) =>
          e.toLowerCase().startsWith(objInput.toLowerCase()) &&
          !strEmails.some((thisEmail) => thisEmail.value === e)
      )
      .slice(0, 5);
    setThisMailSuggestions(filtered);
    setIsShowDropdown(filtered.length > 0);
  }, [objInput, objAllEmails, strEmails]);

  const addThisEmail = (value) => {
    if (!value.trim()) return;
    setThisEmails((previousState) => [
      ...previousState,
      { value: value.trim(), valid: validateEmail(value.trim()) },
    ]);
    setThisInput("");
    setThisMailSuggestions([]);
    setIsShowDropdown(false);
  };

  const handleThisInput = (e) => setThisInput(e.target.value);

  const handleThisKeyPresses = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
        e.preventDefault();
        addThisEmail(objInput);
    } else if (e.key === "Backspace" && !objInput && strEmails.length) {
        setThisEmails((previousState) => previousState.slice(0, -1));
    }
  };

  const handleThisSuggestions = (email) => {
      addThisEmail(email);
      objInputRef.current.focus();
  };

  const removeThisEmail = (index) => {
      setThisEmails((previousState) => previousState.filter((_, i) => i !== index));
  };

  return (
    <div className="email-input-container">
      <div className="email-input-box" onClick={() => objInputRef.current.focus()}>
        {strEmails.map((thisEmail, index) => (
          <span
            key={thisEmail.value + index}
            className={`email-chip${thisEmail.valid ? "" : " invalid"}`}
          >
            {thisEmail.value}
            {!thisEmail.valid && (
              <span className="icon alerto" onClick={() => removeThisEmail(index)}></span>
            )}
            {thisEmail.valid && (
              <button
                className="remove-btn"
                onClick={() => removeThisEmail(index)}
                type="button"
              >
                ×
              </button>
            )}
          </span>
        ))}
        <input
          ref={objInputRef}
          value={objInput}
          onChange={handleThisInput}
          onKeyDown={handleThisKeyPresses}
          placeholder="Enter recipients..."
          className="email-input"
          aria-label="Email input"
        />
      </div>
      {isShowingDropdown && (
        <ul className="email-suggestions">
          {oEmailSuggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => handleThisSuggestions(s)}
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

export default EmailSuggest;