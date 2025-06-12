import Api from './Api.js';
import '../pages/index.css';

const cardsList = document.querySelector('.cards__list');

// === Initialize API ===
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2aa7c51f-b9a1-4889-a781-e5abd2e65849",
    "Content-Type": "application/json"
  }
});

// === Utility: Toggle button loading text ===
function toggleButtonLoading(button, isLoading, loadingText = "Saving...") {
  if (!button) return;
  if (isLoading) {
    button.originalText = button.textContent || 'Save';
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.originalText || "Save";
    button.disabled = false;
  }
}

// === State ===
let selectedCard = null;
let selectedCardId = null;

// === Render a single card ===
function renderCard(card) {
  const cardElement = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-btn');

  cardImage.src = card.link || '';
  cardImage.alt = card.name || 'Card image';
  cardTitle.textContent = card.name;

  if (card.isLiked) {
    likeButton.classList.add('card__like-button_liked');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_liked');
    const action = isLiked ? api.dislikeCard : api.likeCard;

    action.call(api, card._id)
      .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_liked', updatedCard.isLiked);
      })
      .catch(err => {
        console.error('❌ Failed to toggle like:', err);
        alert('Could not update like status.');
      });
  });

  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement, card);
  });

  return cardElement;
}

// === Load user info and cards ===
api.getAppData()
  .then(([user, cards]) => {
    document.querySelector('.profile__name').textContent = user.name;
    document.querySelector('.profile__description').textContent = user.about;
    document.querySelector('.profile__avatar').src = user.avatar;
 
    cards.forEach(card => {
      const cardElement = renderCard(card);
      cardsList.appendChild(cardElement);
    });
  })
  .catch(error => {
    console.error('❌ Failed to load app data:', error);
    alert('Could not load profile or cards.');
  });

// === Edit Profile ===
const profileForm = document.forms['edit-profile'];
const nameInput = profileForm.querySelector('#profile-name-input');
const aboutInput = profileForm.querySelector('#profile-description-input');
const editModal = document.querySelector('#edit-modal');
const editProfileButton = profileForm.querySelector('.modal__submit-btn');

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toggleButtonLoading(editProfileButton, true, "Saving...");

  const name = nameInput.value;
  const about = aboutInput.value;

  api.updateUserInfo({ name, about })
    .then(updatedUser => {
      document.querySelector('.profile__name').textContent = updatedUser.name;
      document.querySelector('.profile__description').textContent = updatedUser.about;
      editModal.classList.remove('modal_opened');
    })
    .catch(err => {
      console.error('❌ Failed to update profile:', err);
      alert('Could not update profile.');
    })
    .finally(() => {
      toggleButtonLoading(editProfileButton, false);
    });
});

document.querySelector('.profile__edit-btn').addEventListener('click', () => {
  nameInput.value = document.querySelector('.profile__name').textContent;
  aboutInput.value = document.querySelector('.profile__description').textContent;
  editModal.classList.add('modal_opened');
});

// === Add Card ===
const addCardForm = document.querySelector('#add-card-form');
const cardNameInput = document.querySelector('#add-card-name-input');
const cardLinkInput = document.querySelector('#add-card-link-input');
const addCardModal = document.querySelector('#add-card-modal');
const addCardButton = addCardForm.querySelector('.modal__submit-btn');
const addCardBtn = document.querySelector('.profile__add-btn');
addCardBtn.addEventListener('click', () => {
  addCardModal.classList.add('modal_opened');
});

addCardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toggleButtonLoading(addCardButton, true, "Saving...");

  const name = cardNameInput.value.trim();
  const link = cardLinkInput.value.trim();

  if (!name || !link) {
    alert('Card name and image link are required.');
    toggleButtonLoading(addCardButton, false);
    return;
  }

  api.createCard({ name, link })
    .then(newCard => {
      const cardElement = renderCard(newCard);
      document.querySelector('.cards__list').prepend(cardElement);
      addCardModal.classList.remove('modal_opened');
      addCardForm.reset();
    })
    .catch(error => {
      console.error('❌ Failed to add card:', error);
      alert('Could not add card.');
    })
    .finally(() => {
      toggleButtonLoading(addCardButton, false);
    });
});

// === Delete Card ===
const deleteCardModal = document.querySelector('#delete-card-modal');
const deleteCardForm = document.querySelector('#delete-card-form');
const deleteButton = deleteCardForm.querySelector('.modal__submit-btn');

function handleDeleteCard(cardElement, cardData) {
  selectedCard = cardElement;
  selectedCardId = cardData._id;
  deleteCardModal.classList.add('modal_opened');
}

function handleDeleteSubmit(e) {
  e.preventDefault();
  toggleButtonLoading(deleteButton, true, "Deleting...");

  if (!selectedCardId) return;

  api.deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      deleteCardModal.classList.remove('modal_opened');
    })
    .catch(err => {
      console.error('❌ Failed to delete card:', err);
      alert('Could not delete card.');
    })
    .finally(() => {
      toggleButtonLoading(deleteButton, false);
    });
}

deleteCardForm.addEventListener('submit', handleDeleteSubmit);

// === Update Avatar ===
const updateAvatarModal = document.querySelector('#update-avatar-modal');
const updateAvatarForm = document.querySelector('#update-avatar-form');
const avatarInput = document.querySelector('#avatar-link-input');
const avatarImage = document.querySelector('.profile__avatar');
const avatarEditBtn = document.querySelector('.profile__avatar-edit-btn');
const avatarButton = updateAvatarForm.querySelector('.modal__submit-btn');

avatarEditBtn.addEventListener('click', () => {
  updateAvatarModal.classList.add('modal_opened');
});

updateAvatarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toggleButtonLoading(avatarButton, true, "Saving...");

  const avatar = avatarInput.value.trim();

  if (!avatar) {
    alert("Please enter a valid image link.");
    toggleButtonLoading(avatarButton, false);
    return;
  }

  api.updateUserAvatar({ avatar })
    .then(updatedUser => {
      avatarImage.src = updatedUser.avatar;
      updateAvatarModal.classList.remove('modal_opened');
      updateAvatarForm.reset();
    })
    .catch(err => {
      console.error('❌ Failed to update avatar:', err);
      alert('Could not update profile picture.');
    })
    .finally(() => {
      toggleButtonLoading(avatarButton, false);
    });
});

// === Modal UX: Close via ESC, outside click, or close button ===
document.querySelectorAll('.modal__close-btn').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    modal.classList.remove('modal_opened');
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('mousedown', (e) => {
    if (e.target === modal) {
      modal.classList.remove('modal_opened');
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.modal_opened').forEach(modal => {
      modal.classList.remove('modal_opened');
    });
  }
});

