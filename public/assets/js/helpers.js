const username = /^[a-zA-Z-_\s]+$/;
const password = /^[a-zA-Z0-9]+$/;
function checkLength(value, min, max) {
  return value.length <= max && value.length >= min;
}

function isValid(value, regex) {
  return regex.test(value);
}

function isEmpty(value) {
  return value.trim() === "";
}

function isEmail(value) {
  const email =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return email.test(value);
}

function isSameValue(source, target) {
  return source === target;
}

function changeFieldToInvalid(field, sentence) {
  if (field.classList.contains("border-green-500")) {
    field.classList.remove("border-green-500");
  }
  field.classList.add("border-red-500");
  field.nextSibling.nextSibling.classList.remove("invisible");
  field.nextSibling.nextSibling.textContent = sentence;
}

function changeToValid(field) {
  if (!field.nextSibling.nextSibling.classList.contains("invisible")) {
    field.nextSibling.nextSibling.classList.add("invisible");
  }
  field.classList.add("border-green-500");
}

export function checkAdminSignupForm(form, max) {
  const map = [null, null, null, null];

  for (let i = 0; i < max; i++) {
    if (form[i].id === "username") {
      if (isEmpty(form[i].value)) {
        return changeFieldToInvalid(form[i], `${form[i].id} is required`);
      }

      if (!checkLength(form[i].value, 3, 32)) {
        return changeFieldToInvalid(form[i], `Should contain between 3 and 32 letters`);
      }

      if (!isValid(form[i].value, username)) {
        return changeFieldToInvalid(form[i], "Should contain a-z or A-Z or -_ or Spaces");
      }

      changeToValid(form[i]);
    }

    if (form[i].id === "email") {
      if (isEmpty(form[i].value)) {
        return changeFieldToInvalid(form[i], `${form[i].id} is required`);
      }

      if (!isEmail(form[i].value)) {
        return changeFieldToInvalid(form[i], `${form[i].id} not valid`);
      }

      changeToValid(form[i]);
    }

    if (form[i].id === "password") {
      if (isEmpty(form[i].value)) {
        return changeFieldToInvalid(form[i], `${form[i].id} is required`);
      }

      if (!checkLength(form[i].value, 6, 16)) {
        return changeFieldToInvalid(form[i], `Should contain between 6 and 16 letters`);
      }

      if (!isValid(form[i].value, password)) {
        return changeFieldToInvalid(form[i], "Should contain letters or numbers");
      }
      changeToValid(form[i]);
    }

    if (form[i].id === "password-confirm") {
      const password = document.getElementById("password");
      if (isEmpty(form[i].value)) {
        return changeFieldToInvalid(form[i], `${form[i].id} is required`);
      }

      if (!isSameValue(password.value, form[i].value)) {
        return changeFieldToInvalid(form[i], `should be equal to password`);
      }
      changeToValid(form[i]);
    }
  }
}
