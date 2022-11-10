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

window.onload = function (e) {
  const backlink = document.getElementById("go-back");
  const logoutBtn = document.getElementById("logout");
  const loader = document.getElementById("loader");
  const flashMessage = document.getElementById("flash__message");
  const form = document.getElementsByTagName("form")[0];
  const button = document.getElementById("submit");
  const deleteBtn = document.getElementById("delete");

  if (logout) {
    logoutBtn.addEventListener("click", async function (e) {
      let result = await logout();
    });
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
        setTimeout(() => {
          loader.classList.add("hidden");
          button.removeAttribute("disabled");
          if (form.id !== "profile") {
            location = "/admin";
          }
        }, 800);
        return;
      }

      if (result && result.status >= 400) {
        flashMessage.classList.remove("hidden");
        setTimeout(() => {
          flashMessage.classList.add("hidden");
          button.removeAttribute("disabled");
          loader.classList.add("hidden");
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
        if (result && result.status >= 200 && result.status < 400) {
          setTimeout(() => {
            loader.classList.add("hidden");
            deleteBtn.removeAttribute("disabled");
            if (form.id !== "profile") {
              location = "/admin";
            }
          }, 800);
          return;
        }

        if (result && result.status >= 400) {
          flashMessage.classList.remove("hidden");
          setTimeout(() => {
            flashMessage.classList.add("hidden");
            deleteBtn.removeAttribute("disabled");
            loader.classList.add("hidden");
          }, 800);
          return;
        }
      }
    });
  }
};
