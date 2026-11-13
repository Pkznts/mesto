const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${import.meta.env.VITE_MESTO_COHORT}`,
  headers: {
    authorization: import.meta.env.VITE_MESTO_TOKEN,
    "Content-Type": "application/json",
  },
};

const getResponseData = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(new Error(`Ошибка: ${response.status}`));
};

const request = (path, options = {}) => {
  return fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: config.headers,
  }).then(getResponseData);
};

export const getUserInfo = () => request("/users/me");
export const getCardList = () => request("/cards");

export const setUserInfo = ({ name, about }) => {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
};

export const setUserAvatar = (avatar) => {
  return request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
};

export const addCard = ({ name, link }) => {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
};

export const removeCard = (cardId) => {
  return request(`/cards/${cardId}`, { method: "DELETE" });
};

export const changeLikeCardStatus = (cardId, isLiked) => {
  return request(`/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
  });
};
