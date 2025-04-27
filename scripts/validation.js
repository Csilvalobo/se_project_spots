const validationConfig = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error"
  };

  const showInputError = (formEl, inputEl, errorMsg, config) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(config.inputErrorClass);
    errorMsgEl.classList.add(config.errorClass); 
   };
   
   const hideInputError = (formEl, inputEl, config) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
       errorMsgEl.textContent = "";
       inputEl.classList.remove(config.inputErrorClass);
       errorMsgEl.classList.remove(config.errorClass); 
   };

   const checkInputValidity = (formEl, inputEl, config) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
        hideInputError(formEl, inputEl, config);
    }
   };

const hasInvalidInput = (inputList) => { 
    return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonEl, config) => {
    if (hasInvalidInput(inputList)) {
        buttonEl.disabled = true;
        buttonEl.classList.add(config.inactiveButtonClass);     
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(config.inactiveButtonClass);
    }
   };

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
   
    toggleButtonState(inputList, buttonElement, config);
   
    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function() {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
   };

const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    });
};

enableValidation(validationConfig);

const disableButton = (buttonElement, validationConfig) => {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
};