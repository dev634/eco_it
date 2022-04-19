import { checkAdminSignupForm } from "./forms.js";
import { postAdmin } from "./api.js";

window.onload = function (e) {
  let backlink = document.getElementById("go-back");
  const adminSignupForm = document.getElementById("admin-signup-form");
  const loader = document.getElementById("loader");

  if (backlink) {
    backlink.addEventListener("click", function (e) {
      e.preventDefault();
      history.back();
    });
  }

  if (adminSignupForm) {
    adminSignupForm.addEventListener("click", async function (e) {
      if (e.target.id === "subscribe" && checkAdminSignupForm(this, 4)) {
        let datas = {
          username: this[0].value,
          email: this[1].value,
          password: this[2].value,
        };
        let result = await postAdmin(datas);
        loader.classList.remove("hidden");
        if (result.status === 201) {
          history.go("/admin");
        }
      }
    });

    adminSignupForm.addEventListener("input", function (e) {
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
};
