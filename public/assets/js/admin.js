import { checkAdminSignupForm, checkAdminSigninForm, checkAdminForgetForm } from "./forms.js";
import { postForm, logout, updateProfile } from "./api.js";

function makeDatasFromForm(form) {
  const datas = {};
  Array.from(form).map((elmt, i) => {
    if (elmt.type === "button" && elmt.id === "delete") {
      return;
    }
    if (elmt.type !== "submit") {
      datas[elmt.id] = elmt.value;
    }
  });

  return { ...datas };
}

function makeListInstructors(listElement, template, datas) {
  return datas.map((elmt) => {
    let clone = template.content.cloneNode(true);
    const img = clone.querySelector(".image");
    const firstname = clone.querySelector(".firstname");
    const lastname = clone.querySelector(".lastname");
    const approuved = clone.querySelector(".approuved");
    const instructorLink = clone.querySelector(".instructor-link");

    img.src = elmt.photo;
    firstname.textContent = elmt.firstname;
    lastname.textContent = elmt.lastname;
    approuved.textContent = `${elmt.isapprouved ? "Approuvé" : "Non approuvé"}`;
    approuved.classList = `${elmt.isapprouved ? "text-green-500 text-xs" : "text-red-500 text-xs"}`;
    instructorLink.href = `/admin/instructors/${elmt.id}`;

    listElement.appendChild(clone);
  });
}

async function handleSearchBar(e) {
  e.preventDefault();

  const list = document.getElementById("instructors__list");
  const template = document.getElementById("instructor");
  let response = null;
  const match = /^[a-zA-Z]*$/;
  const match2 = /^[\s].*/;
  const firstnameMatch = /^[a-zA-Z]{1,10}[\s-]?[a-zA-Z]{1,10}$/;

  if (e.target.value.match(match2)) {
    return;
  }

  if (e.target.value.length > 10) {
    e.target.value = e.target.value.slice(0, 10);
    return;
  }

  e.target.parentElement.nextElementSibling.classList.remove("opacity-0");
  list.innerHTML = "";

  if (e.target.value.length === 0 && e.key === "Backspace") {
    response = await updateProfile("GET", "/admin/instructors/all");
    console.log(response);
    e.target.parentElement.nextElementSibling.classList.add("opacity-0");
    makeListInstructors(list, template, response);
    e.target.blur();
    return;
  }

  response = await updateProfile("POST", "/admin/instructors", {
    firstname: e.target.value.trim(),
    lastname: e.target.value.trim(),
  });
  makeListInstructors(list, template, response);

  e.target.parentElement.nextElementSibling.classList.add("opacity-0");
}

window.onload = function (e) {
  const backlink = document.getElementById("go-back");
  const logoutBtn = document.getElementById("logout");
  const loader = document.getElementById("loader");
  const flashMessage = document.getElementById("flash__message");
  const form = document.getElementsByTagName("form")[0];
  const button = document.getElementById("submit");
  const deleteBtn = document.getElementById("delete");
  const searchBar = document.getElementById("search");
  const filter = document.getElementById("filter");
  const pen = document.getElementById("icon-pen");

  if (searchBar) {
    searchBar.value = "";
  }

  if (logout) {
    logoutBtn.addEventListener("click", async function (e) {
      let result = await logout();
    });
  }

  if (searchBar) {
    searchBar.addEventListener("keyup", handleSearchBar);
  }

  if (backlink) {
    backlink.addEventListener("click", function (e) {
      e.preventDefault();
      history.back();
    });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      let max = form.length - 1;

      if (form.id === "profile") {
        max = form.length - 2;
      }

      if (!checkAdminSignupForm(this, max)) {
        return;
      }

      button.setAttribute("disabled", "");
      let datas = makeDatasFromForm(form);
      let result = null;
      if (["forget", "connect", "register"].includes(form.id)) {
        result = await postForm(datas, "/admin/auth/" + form.id);
      }

      if (form.id === "profile") {
        result = await updateProfile("PATCH", "/admin/profile", datas);
      }

      loader.classList.remove("hidden");

      if (result && result.status >= 200 && result.status < 400) {
        flashMessage.classList.add("bg-green-400");
        flashMessage.classList.remove("hidden");
        flashMessage.textContent = result.message;
        setTimeout(() => {
          flashMessage.classList.add("hidden");
          flashMessage.classList.remove("bg-green-400");
          loader.classList.add("hidden");
          button.removeAttribute("disabled");
          flashMessage.textContent = "";
          if (form.id !== "profile") {
            location = "/admin";
          }
        }, 800);
        return;
      }

      if (result && result.status >= 400) {
        flashMessage.classList.add("bg-red-400");
        flashMessage.classList.remove("hidden");
        flashMessage.textContent = result.message;
        setTimeout(() => {
          flashMessage.classList.remove("bg-red-400");
          loader.classList.add("hidden");
          flashMessage.classList.add("hidden");
          flashMessage.textContent = "";
          button.removeAttribute("disabled");
        }, 800);

        return;
      }
    });

    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("border-green-500")) {
        e.target.classList.remove("border-green-500");
      }

      if (e.target.classList.contains("border-red-500")) {
        e.target.classList.remove("border-red-500");
        if (!e.target.nextSibling.nextSibling.classList.contains("invisible")) {
          e.target.nextSibling.nextSibling.classList.add("invisible");
        }
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      if (e.target.id === "delete") {
        let result = await updateProfile("DELETE", "/admin/profile");
        let deleteLoader = document.querySelector("#delete #loader");

        deleteLoader.classList.remove("hidden");
        if (result && result.status >= 200 && result.status < 400) {
          setTimeout(() => {
            deleteLoader.classList.add("hidden");
            deleteBtn.removeAttribute("disabled");
            location = "/admin";
          }, 800);
          return;
        }

        if (result && result.status >= 400) {
          flashMessage.classList.add("bg-red-400");
          flashMessage.textContent = result.message;
          flashMessage.classList.remove("hidden");

          setTimeout(() => {
            flashMessage.classList.add("hidden");
            flashMessage.textContent = "";
            flashMessage.classList.remove("bg-red-400");
            deleteBtn.removeAttribute("disabled");
            deleteLoader.classList.add("hidden");
          }, 800);
          return;
        }
      }
    });
  }
};
