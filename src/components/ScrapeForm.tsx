import React from "react";

// clear input field

function clearInputField(event: React.MouseEvent) {
  const target = event.target as HTMLInputElement;
  target.placeholder = "";
}

function fillPlaceholderInputField(event: React.MouseEvent) {
  const target = event.target as HTMLInputElement;
  target.placeholder = "enter url";
}

function ScrapeForm() {
  return (
    <form id="scrapeForm">
      <input
        type="text"
        id="url"
        name="url"
        placeholder="enter url"
        required
        onClick={clearInputField}
        onMouseOut={fillPlaceholderInputField}
      />
      <button type="submit">send</button>
    </form>
  );
}

export default ScrapeForm;
