import { createCardElement, deleteCard, updateCardLikes } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, getCardList, setUserInfo, setUserAvatar, addCard, removeCard, changeLikeCardStatus } from "./components/api.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalUsersTitle = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalUsersList = cardInfoModalWindow.querySelector(".popup__list");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const userPreviewTemplate = document.querySelector("#popup-info-user-preview-template").content;
const allPopups = document.querySelectorAll(".popup");
let currentUserId;

const showError = (error) => {
  console.error(error);
};

const updateProfile = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url("${userData.avatar}")`;
};

const setFormLoading = (formElement, isLoading, loadingText, defaultText) => {
  const buttonElement = formElement.querySelector(".popup__button");
  const inputElements = formElement.querySelectorAll(".popup__input");
  formElement.dataset.isSubmitting = String(isLoading);
  inputElements.forEach((inputElement) => {
    inputElement.disabled = isLoading;
  });
  buttonElement.textContent = isLoading ? loadingText : defaultText;
  buttonElement.disabled = isLoading || !formElement.checkValidity();
  buttonElement.classList.toggle("popup__button_disabled", buttonElement.disabled);
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (event) => {
  event.preventDefault();
  if (profileForm.dataset.isSubmitting === "true") return;
  setFormLoading(profileForm, true, "Сохранение...", "Сохранить");
  setUserInfo({ name: profileTitleInput.value, about: profileDescriptionInput.value })
    .then((userData) => {
      updateProfile(userData);
      closeModalWindow(profileFormModalWindow);
    })
    .catch(showError)
    .finally(() => setFormLoading(profileForm, false, "Сохранение...", "Сохранить"));
};

const handleAvatarFormSubmit = (event) => {
  event.preventDefault();
  if (avatarForm.dataset.isSubmitting === "true") return;
  setFormLoading(avatarForm, true, "Сохранение...", "Сохранить");
  setUserAvatar(avatarInput.value)
    .then((userData) => {
      updateProfile(userData);
      avatarForm.reset();
      closeModalWindow(avatarFormModalWindow);
    })
    .catch(showError)
    .finally(() => setFormLoading(avatarForm, false, "Сохранение...", "Сохранить"));
};

const handleLikeClick = (cardId, isLiked, cardElement, likeButton) => {
  likeButton.disabled = true;
  changeLikeCardStatus(cardId, isLiked)
    .then((cardData) => updateCardLikes(cardElement, cardData.likes, currentUserId))
    .catch(showError)
    .finally(() => {
      likeButton.disabled = false;
    });
};

const handleDeleteClick = (cardId, cardElement, deleteButton) => {
  deleteButton.disabled = true;
  removeCard(cardId)
    .then(() => deleteCard(cardElement))
    .catch(showError)
    .finally(() => {
      deleteButton.disabled = false;
    });
};

const createInfoString = (term, description) => {
  const infoElement = infoDefinitionTemplate.querySelector(".popup__info-item").cloneNode(true);
  const termElement = infoElement.querySelector(".popup__info-term");
  const descriptionElement = infoElement.querySelector(".popup__info-description");
  termElement.textContent = term;
  descriptionElement.textContent = description;
  descriptionElement.title = description;
  return infoElement;
};

const createUserPreview = (userData) => {
  const userElement = userPreviewTemplate.querySelector(".popup__list-item").cloneNode(true);
  userElement.textContent = userData.name;
  userElement.title = userData.name;
  return userElement;
};

const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleInfoClick = (cardId, infoButton) => {
  infoButton.disabled = true;
  getCardList()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);
      if (!cardData) throw new Error("Карточка уже удалена с сервера.");
      cardInfoModalTitle.textContent = "Информация о карточке";
      cardInfoModalInfoList.replaceChildren(
        createInfoString("Описание:", cardData.name),
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt))),
        createInfoString("Владелец:", cardData.owner.name),
        createInfoString("Количество лайков:", cardData.likes.length)
      );
      cardInfoModalUsersTitle.textContent = cardData.likes.length ? "Лайкнули:" : "Лайков пока нет";
      cardInfoModalUsersList.replaceChildren();
      cardData.likes.forEach((userData) => {
        cardInfoModalUsersList.append(createUserPreview(userData));
      });
      openModalWindow(cardInfoModalWindow);
    })
    .catch(showError)
    .finally(() => {
      infoButton.disabled = false;
    });
};

const createCard = (cardData) => {
  return createCardElement(cardData, currentUserId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeIcon: handleLikeClick,
    onDeleteCard: handleDeleteClick,
    onInfoClick: handleInfoClick,
  });
};

const handleCardFormSubmit = (event) => {
  event.preventDefault();
  if (cardForm.dataset.isSubmitting === "true") return;
  setFormLoading(cardForm, true, "Создание...", "Создать");
  addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      placesWrap.prepend(createCard(cardData));
      cardForm.reset();
      closeModalWindow(cardFormModalWindow);
    })
    .catch(showError)
    .finally(() => setFormLoading(cardForm, false, "Создание...", "Создать"));
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  if (profileForm.dataset.isSubmitting === "true") return;
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  if (avatarForm.dataset.isSubmitting === "true") return;
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  if (cardForm.dataset.isSubmitting === "true") return;
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

enableValidation(validationSettings);
allPopups.forEach(setCloseModalWindowEventListeners);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    updateProfile(userData);
    cards.forEach((cardData) => placesWrap.append(createCard(cardData)));
    openProfileFormButton.disabled = false;
    openCardFormButton.disabled = false;
    profileAvatar.disabled = false;
  })
  .catch(showError);
