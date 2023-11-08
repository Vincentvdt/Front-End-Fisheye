const displayModal = (modal) => {
  const focusableElements = getFocusableElements();
  modal.style.display = "flex";
  focusableElements.forEach((elem) => {
    if (!modal.contains(elem)) {
      elem.setAttribute("tabindex", "-1");
    }
  });
  for (const element of body.children) {
    if (!modal.contains(element) && element.tagName !== "SCRIPT") {
      element.setAttribute("aria-hidden", "true");
    }
  }
};

const closeModal = (modal) => {
  const focusableElements = getFocusableElements();
  modal.style.display = "none";
  focusableElements.forEach((elem) => {
    if (!modal.contains(elem)) {
      elem.removeAttribute("tabindex");
    }
  });
  for (const element of body.children) {
    if (!modal.contains(element) && element.tagName !== "SCRIPT") {
      element.setAttribute("aria-hidden", "false");
    }
  }
};

const getFocusableElements = () => {
  const focusableElementsString =
    "video, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex=\"0\"], [contenteditable]";
  return document.querySelectorAll(focusableElementsString);
};
