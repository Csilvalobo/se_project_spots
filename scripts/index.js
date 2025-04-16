const ENTER_KEY_CODE = "Enter";

const initialCards = [
    {
        name: "Val Thorens",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    },
    {
        name: "Restaurant terrace",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    },
    {
        name: "An outdoor cafe",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    },
    {
        name: "A very long bridge, over the forest and through the trees",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    },
    {
        name: "Tunnel with morning light",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    },
    {
        name: "Mountain house",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    },
    {
        name: "Landscape view",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
    },
];

const MODAL_TRANSITION_DURATION = 300;

const CSS_CLASSES = {
    MODAL_OPENED: "modal_opened",
    CARD_LIKED: "card__like-button_liked",
};

const SELECTORS = {
    CARD_TEMPLATE: "#card-template",
    CARDS_LIST: ".cards__list",
    MODAL_CLOSE: ".modal__close-btn",
    CARD_IMAGE: ".card__image",
    CARD_TITLE: ".card__title",
};

const profileElements = {
    editButton: document.querySelector(".profile__edit-btn"),
    addButton: document.querySelector(".profile__add-btn"),
    name: document.querySelector(".profile__name"),
    description: document.querySelector(".profile__description"),
};

const modalElements = {
    edit: {
        container: document.querySelector("#edit-modal"),
        form: document.querySelector(".modal__form"),
        closeButton: document.querySelector("#edit-modal .modal__close-btn"),
        nameInput: document.querySelector("#profile-name-input"),
        descriptionInput: document.querySelector("#profile-description-input"),
    },
    card: {
        container: document.querySelector("#add-card-modal"),
        form: document.querySelector("#add-card-form"),
        closeButton: document.querySelector("#add-card-modal .modal__close-btn"),
        nameInput: document.querySelector("#add-card-name-input"),
        linkInput: document.querySelector("#add-card-link-input"),
    },
    preview: {
        container: document.querySelector("#preview-modal"),
        closeButton: document.querySelector("#preview-modal .modal__close-btn"),
        image: document.querySelector(".modal__image"),
        caption: document.querySelector(".modal__caption"),
    },
};

const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
    const cardTitleElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeElement = cardElement.querySelector(".card__like-button");
    const cardDeleteElement = cardElement.querySelector(".card__delete-btn");

    cardTitleElement.textContent = data.name;
    cardImageElement.src = data.link;
    cardImageElement.alt = data.name;

    function handleLikeButton(likeButton) {
        likeButton.classList.toggle("card__like-button_liked");
    }

    cardLikeElement.addEventListener("click", () => handleLikeButton(cardLikeElement));
    cardDeleteElement.addEventListener("click", () => handleDeleteCard(cardElement));
    cardImageElement.addEventListener("click", () => handlePreviewImage(data));

    return cardElement;
}

function openModal(modal) {
    modal.classList.add(CSS_CLASSES.MODAL_OPENED);
    document.addEventListener("keydown", handleEscClose);
    modal.addEventListener("mousedown", handleOverlayClose);
}

function closeModal(modal) {
    modal.classList.remove(CSS_CLASSES.MODAL_OPENED);
    document.removeEventListener("keydown", handleEscClose);
    modal.removeEventListener("mousedown", handleOverlayClose);
    
    // Get the form inside the modal if it exists
    const form = modal.querySelector('.modal__form');
    if (form) {
        form.reset();
        resetFormValidation(form, validationConfig);
        const inputs = [...form.querySelectorAll('.modal__input')];
        const submitButton = form.querySelector('.modal__submit-btn');
        
        inputs.forEach((input) => {
            const errorElement = document.querySelector(`#${input.id}-error`);
            input.classList.remove('modal__input_type_error');
            errorElement.classList.remove('modal__error');
            errorElement.textContent = '';
        });
        
        if (submitButton) {
            submitButton.classList.add('modal__submit-btn_disabled');
            submitButton.disabled = true;
        }
    }
}

function handleEscClose(evt) {
    if (evt.key === "Escape") {
        const openedModal = document.querySelector(`.${CSS_CLASSES.MODAL_OPENED}`);
        closeModal(openedModal);
    }
}

function handleOverlayClose(evt) {
    if (evt.target.classList.contains("modal")) {
        closeModal(evt.target);
    }
}

function handlePreviewImage(data) {
    modalElements.preview.image.src = data.link;
    modalElements.preview.image.alt = data.name;
    modalElements.preview.caption.textContent = data.name;
    openModal(modalElements.preview.container);
}

function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    profileElements.name.textContent = modalElements.edit.nameInput.value;
    profileElements.description.textContent = modalElements.edit.descriptionInput.value;
    closeModal(modalElements.edit.container);
}

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
        name: modalElements.card.nameInput.value,
        link: modalElements.card.linkInput.value,
    };
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    modalElements.card.form.reset();
    closeModal(modalElements.card.container);
}

profileElements.editButton.addEventListener("click", () => {
    modalElements.edit.nameInput.value = profileElements.name.textContent;
    modalElements.edit.descriptionInput.value = profileElements.description.textContent;
    openModal(modalElements.edit.container);
});

modalElements.edit.closeButton.addEventListener("click", () => {
    closeModal(modalElements.edit.container);
});

profileElements.addButton.addEventListener("click", () => {
    openModal(modalElements.card.container);
});

modalElements.card.closeButton.addEventListener("click", () => {
    closeModal(modalElements.card.container);
});

modalElements.preview.closeButton.addEventListener("click", () => {
    closeModal(modalElements.preview.container);
});

modalElements.edit.form.addEventListener("submit", handleEditProfileSubmit);

modalElements.card.form.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
    const cardEl = getCardElement(item);
    cardsList.prepend(cardEl);
});

function handleFormKeydown(evt) {
    if (evt.key === ENTER_KEY_CODE) {
        evt.preventDefault();
        const form = evt.target.closest(".modal__form");
        const isValid = form.checkValidity();

        if (isValid) {
            form.dispatchEvent(new Event("submit"));
        }
    }
}

modalElements.edit.form.addEventListener("keydown", handleFormKeydown);
modalElements.card.form.addEventListener("keydown", handleFormKeydown);

function handleDeleteCard(cardElement) {
    const isConfirmed = window.confirm("Are you sure you want to delete this card?");

    if (isConfirmed) {
        cardElement.remove();
    }
}
