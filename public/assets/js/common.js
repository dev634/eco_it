import { checkAdminSignupForm } from "./helpers.js";

window.onload = function (e) {
  let backlink = document.getElementById("go-back");
  const adminSignupForm = document.getElementById("admin-signup-form");

  if (backlink) {
    backlink.addEventListener("click", function (e) {
      e.preventDefault();
      history.back();
    });
  }

  if (adminSignupForm) {
    adminSignupForm.addEventListener("click", function (e) {
      if (e.target.id === "subscribe") {
        checkAdminSignupForm(this, 4);
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
