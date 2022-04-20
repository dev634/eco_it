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

function checkAll(field, controls) {
  return controls.every((elmt) => elmt === true);
}

function isEmail(value) {
  const email =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return email.test(value);
}

function isSameValue(source, target) {
  return source === target;
}

function requiredFields(form) {
  for (let i = 0; i < form.length; i++) {
    return changeFieldToInvalid(form[i], `${form[i].id} is required`);
  }
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
  let map = [];

  //init map
  for (let i = 0; i < max; i++) {
    map.push(null);
  }

  for (let i = 0; i < max; i++) {
    if (form[i].value.length === 0) {
      changeFieldToInvalid(form[i], `${form[i].id} is required`);
    }

    if (form[i].id === "username") {
      if (form[i].value.length > 0 && !checkLength(form[i].value, 3, 32)) {
        changeFieldToInvalid(form[i], `Should contain between 3 and 32 letters`);
        continue;
      }

      if (form[i].value.length > 0 && !isValid(form[i].value, username)) {
        changeFieldToInvalid(form[i], "Should contain a-z or A-Z or -_ or Spaces");
        continue;
      }

      if (
        checkAll(form[i].value, [
          checkLength(form[i].value, 3, 32),
          isValid(form[i].value, username),
        ])
      ) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }

    if (form[i].id === "email") {
      if (form[i].value.length > 0 && !isEmail(form[i].value)) {
        changeFieldToInvalid(form[i], `${form[i].id} not valid`);
        continue;
      }

      if (isEmail(form[i].value)) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }

    if (form[i].id === "password") {
      if (form[i].value.length > 0 && !checkLength(form[i].value, 6, 16)) {
        changeFieldToInvalid(form[i], `Should contain between 6 and 16 letters`);
        continue;
      }

      if (form[i].value.length > 0 && !isValid(form[i].value, password)) {
        changeFieldToInvalid(form[i], "Should contain letters or numbers");
        continue;
      }

      if (
        checkAll(form[i].value, [
          checkLength(form[i].value, 6, 16),
          isValid(form[i].value, password),
        ])
      ) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }

    if (form[i].id === "password-confirm") {
      const password = document.getElementById("password");
      if (password.value.length === 0 && form[i].value.length > 0) {
        changeFieldToInvalid(form[i], "Fill password first");
        continue;
      }

      if (
        password.value.length > 0 &&
        form[i].value.length > 0 &&
        !isSameValue(password.value, form[i].value)
      ) {
        changeFieldToInvalid(form[i], `should be equal to password`);
        continue;
      }

      if (isSameValue(password.value, form[i].value)) {
        map[i] = true;
        changeToValid(form[i]);
      }
    }
  }
  return map.every((elmt) => elmt === true);
}

export function checkAdminSigninForm(form, max) {
  let map = [];

  //init map
  for (let i = 0; i < max; i++) {
    map.push(null);
  }

  for (let i = 0; i < max; i++) {
    if (form[i].value.length === 0) {
      changeFieldToInvalid(form[i], `${form[i].id} is required`);
    }

    if (form[i].id === "email") {
      if (form[i].value.length > 0 && !isEmail(form[i].value)) {
        changeFieldToInvalid(form[i], `${form[i].id} not valid`);
        continue;
      }

      if (isEmail(form[i].value)) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }

    if (form[i].id === "password") {
      if (form[i].value.length > 0 && !checkLength(form[i].value, 6, 16)) {
        changeFieldToInvalid(form[i], `Should contain between 6 and 16 letters`);
        continue;
      }
      if (form[i].value.length > 0 && !isValid(form[i].value, password)) {
        changeFieldToInvalid(form[i], "Should contain letters or numbers");
        continue;
      }

      if (
        checkAll(form[i].value, [
          checkLength(form[i].value, 6, 16),
          isValid(form[i].value, password),
        ])
      ) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }
  }

  return map.every((elmt) => elmt === true);
}

export function checkAdminForgetForm(form, max) {
  let map = [];

  //init map
  for (let i = 0; i < max; i++) {
    map.push(null);
  }

  for (let i = 0; i < max; i++) {
    if (form[i].value.length === 0) {
      changeFieldToInvalid(form[i], `${form[i].id} is required`);
    }

    if (form[i].id === "email") {
      if (form[i].value.length > 0 && !isEmail(form[i].value)) {
        changeFieldToInvalid(form[i], `${form[i].id} not valid`);
        continue;
      }

      if (isEmail(form[i].value)) {
        map[i] = true;
        changeToValid(form[i]);
        continue;
      }
    }
  }

  return map.every((elmt) => elmt === true);
}
