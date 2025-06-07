import React from "react";
import EmailSuggest from "./components/EmailSuggest";

const App = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <EmailSuggest />
      </div>
    </div>
  );
};

export default App;