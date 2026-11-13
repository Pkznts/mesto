const cardTemplate = document.querySelector("#card-template").content;

export const updateCardLikes = (cardElement, likes, userId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const isLiked = likes.some((user) => user._id === userId);
  likeCount.textContent = likes.length;
  likeButton.classList.toggle("card__like-button_is-active", isLiked);
  likeButton.setAttribute("aria-pressed", String(isLiked));
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return cardTemplate.querySelector(".card").cloneNode(true);
};

export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  updateCardLikes(cardElement, data.likes, userId);

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_is-active");
    onLikeIcon(data._id, isLiked, cardElement, likeButton);
  });
  if (data.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(data._id, cardElement, deleteButton);
    });
  } else {
    deleteButton.remove();
  }
  infoButton.addEventListener("click", () => onInfoClick(data._id, infoButton));
  cardImage.addEventListener("click", () => {
    onPreviewPicture({ name: data.name, link: data.link });
  });
  return cardElement;
};
