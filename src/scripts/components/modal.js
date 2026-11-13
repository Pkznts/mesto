const handleEscUp = (event) => {
  if (event.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    if (activePopup) closeModalWindow(activePopup);
  }
};

export const openModalWindow = (modalWindow) => {
  const activePopup = document.querySelector(".popup_is-opened");
  if (activePopup) closeModalWindow(activePopup);
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscUp);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", handleEscUp);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButtonElement = modalWindow.querySelector(".popup__close");
  closeButtonElement.addEventListener("click", () => closeModalWindow(modalWindow));
  modalWindow.addEventListener("mousedown", (event) => {
    if (event.target === modalWindow) closeModalWindow(modalWindow);
  });
};
