import { checkAdminSignupForm, checkAdminSigninForm, checkAdminForgetForm } from "./forms.js";
import { postAdmin, postAdminConnect, postAdminForget } from "./api.js";

window.onload = function (e) {
  const backlink = document.getElementById("go-back");
  const adminSignupForm = document.getElementById("admin-signup-form");
  const adminSigninForm = document.getElementById("admin-signin-form");
  const adminForgetForm = document.getElementById("admin-forget-form");
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
          location = "/admin";
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

  if (adminSigninForm) {
    adminSigninForm.addEventListener("click", async function (e) {
      if (e.target.id === "connect" && checkAdminSigninForm(this, 2)) {
        let datas = {
          email: this[0].value,
          password: this[1].value,
        };
        let result = await postAdminConnect(datas);
        loader.classList.remove("hidden");
        if (result.status === 200) {
          location = "/admin";
        }
      }
    });

    adminSigninForm.addEventListener("input", function (e) {
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

  if (adminForgetForm) {
    adminForgetForm.addEventListener("click", async function (e) {
      if (e.target.id === "send_email" && checkAdminForgetForm(this, 1)) {
        let datas = {
          email: this[0].value,
        };
        let result = await postAdminForget(datas);
        loader.classList.remove("hidden");
        if (result.status === 200) {
          setTimeout(() => {
            location = "/admin";
          }, 100);
          return;
        }
        setTimeout(function () {
          loader.classList.add("hidden");
        }, 100);
        location = "/admin/auth/forget";
      }
    });

    adminForgetForm.addEventListener("input", function (e) {
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
