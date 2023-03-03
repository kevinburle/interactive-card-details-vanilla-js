// check holder name
const holderNameCheck = /^([A-Za-z]{3,})\s([A-Za-z]{3,})$/;

//  check card number
const cardNumberCheck = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;

// check exp date
const expMonthCheck = /^([0-9]|0[1-9]|1[0-2])$/;
const expYearCheck = /^(0[0-9]|[0-9]|[1-9][0-9])$/;

// check CVC
const cvcCheck = /^[0-9]{3,4}$/;

// not a digit
const notADigit = /\D+/;

// only used for formulaire validation
const expMonthValidation = /^(0[1-9]|1[0-2])$/;
const expYearValidation = /^(0[0-9]|[1-9][0-9])$/;

// target element
const form = document.querySelector(".form");
const formInput = [...document.querySelectorAll(".form-input")];
const formContainer = document.querySelector(".form-container");
const holderNameDOM = document.querySelector(".card-name");
const cardExpMonthDOM = document.querySelector(".month");
const cardExpYearDOM = document.querySelector(".year");
const cardNumberDOM = document.querySelector(".card-number");
const cardCVCDOM = document.querySelector(".card-cvc");

// get input value on change
formInput.forEach((input) => {
  // on  input
  input.addEventListener("input", () => {
    // card holder name
    if (input.name === "name") {
      holderNameDOM.textContent = input.value.toUpperCase();
    }

    // card number
    if (input.name === "number") {
      input.value = formatCardNumber(input.value.replaceAll(" ", ""));
      cardNumberDOM.textContent = input.value;
    }

    // exp month
    if (input.name === "expiration-month") {
      if (input.value > 12) {
        input.value = 12;
      }
      input.value = allowedCaract(expMonthCheck, input, 2);
      cardExpMonthDOM.textContent = input.value;
    }

    // exp year
    if (input.name === "expiration-year") {
      input.value = allowedCaract(expYearCheck, input, 2);
      cardExpYearDOM.textContent = input.value;
    }

    // cvc
    if (input.name === "cvc") {
      input.value = allowedCaract(cvcCheck, input, 3);
      cardCVCDOM.textContent = input.value;
    }
  });

  const allowedCaract = (regex, element, max_length) => {
    const result = regex.test(element.value);
    const allNonDigit = notADigit.test(element.value);

    if (
      (element.value.length - 1 < max_length && allNonDigit) ||
      (element.value.length - 1 >= max_length && !result)
    ) {
      element.value = element.value.replaceAll(element.value, "");
    }

    return element.value;
  };

  const formatCardNumber = (number) =>
    number.split("").reduce((seed, next, index) => {
      if (index !== 0 && !(index % 4)) seed += " ";
      return seed + next;
    }, "");
});

// add event listener on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // check if formualire is valid
  if (isValid()) {
    // display status completed
    formContainer.classList.add("completed");
  }
});

const isValid = () => {
  // flag to check formulaire validity
  const validityFlag = [false, false, false, false, false];

  // check if blank input
  formInput.forEach((input) => {
    const checkRegex = (reg) => {
      return reg.test(input.value);
    };

    const removeError = (element) => {
      element.parentElement.classList.remove("show-error");
      element.classList.remove("error");
      if (
        element.parentElement.classList.contains("input-flex") &&
        (input.parentElement.children[0].classList.contains("error") ||
          input.parentElement.children[1].classList.contains("error"))
      ) {
        element.parentElement.classList.add("show-error");
      }
    };

    const displayError = (element) => {
      // display error on element
      element.parentElement.classList.add("show-error");
      element.classList.add("error");
      if (element.value.length > 0) {
        if (
          !element.parentElement.classList.contains("input-flex") &&
          element.nextElementSibling.classList.contains("error-text")
        ) {
          element.nextElementSibling.textContent = "Wrong format";
        } else {
          element.parentElement.nextElementSibling.textContent = "Wrong format";
        }
      }
    };

    if (input.name === "name") {
      if (checkRegex(holderNameCheck)) {
        removeError(input);
        validityFlag[0] = true;
      } else {
        displayError(input);
        validityFlag[0] = false;
      }
    }
    if (input.name === "number") {
      if (checkRegex(cardNumberCheck)) {
        removeError(input);
        validityFlag[1] = true;
      } else {
        displayError(input);
        validityFlag[1] = false;
      }
    }
    if (input.name === "expiration-month") {
      if (checkRegex(expMonthValidation)) {
        removeError(input);
        validityFlag[2] = true;
      } else {
        displayError(input);
        validityFlag[2] = false;
      }
    }
    if (input.name === "expiration-year") {
      if (checkRegex(expYearValidation)) {
        removeError(input);
        validityFlag[3] = true;
      } else {
        displayError(input);
        validityFlag[3] = false;
      }
    }
    if (input.name === "cvc") {
      if (checkRegex(cvcCheck)) {
        removeError(input);
        validityFlag[4] = true;
      } else {
        displayError(input);
        validityFlag[4] = false;
      }
    }
  });

  // if all fied are ok return true
  if (validityFlag.indexOf(false) === -1) {
    return true;
  }
};
