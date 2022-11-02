import { APP_URL, APP_SCHEME, APP_PORT } from "./constantes.js";

function createFormData(datas) {
  let form = new FormData();
  Object.keys(datas).map((elmt) => {
    form.append(elmt, datas[elmt]);
  });
  return form;
}

export async function postForm(datas, url) {
  try {
    const form = createFormData(datas);
    let fullUrl = `${APP_SCHEME}://${APP_URL}:${APP_PORT}${url}`;

    let result = await fetch(`${fullUrl}`, {
      method: "POST",
      body: form,
    });

    if (result.ok) {
      let response = await result.json();
      return response;
    }
  } catch (error) {
    return error;
  }
}

export async function postAdmin(datas) {
  const form = createFormData(datas);
  try {
    let result = await fetch(`${APP_SCHEME}://${APP_URL}:${APP_PORT}/admin/auth/register`, {
      method: "POST",
      body: form,
    });

    if (result.ok) {
      let response = await result.json();
      return response;
    }
  } catch (error) {
    return error;
  }
}

export async function postAdminConnect(datas) {
  const form = createFormData(datas);
  try {
    let result = await fetch(`${APP_SCHEME}://${APP_URL}:${APP_PORT}/admin/auth/connect`, {
      method: "POST",
      body: form,
    });

    if (result.ok) {
      let response = await result.json();
      return response;
    }

    throw result;
  } catch (error) {
    return error;
  }
}

export async function postAdminForget(datas) {
  const form = createFormData(datas);
  try {
    let result = await fetch(`${APP_SCHEME}://${APP_URL}:${APP_PORT}/admin/auth/forget`, {
      method: "POST",
      body: form,
    });
    let response = await result.json();
    return response;
  } catch (error) {
    return error;
  }
}

export async function logout() {
  try {
    let result = await fetch(`${APP_SCHEME}://${APP_URL}:${APP_PORT}/admin/auth/logout`, {
      method: "GET",
    });
    location.reload();
  } catch (error) {
    return error;
  }
}

export async function updateProfile(verb = "GET", url, datas = null, action = null) {
  let form = null;
  let payload = {};
  try {
    payload.method = verb;
    if (form) {
      form = createFormData(datas);
      payload.body = form;
    }
    let result = await fetch(`${APP_SCHEME}://${APP_URL}:${APP_PORT}${url}`, { ...payload });
    let response = await result.json();
    if (action) {
      return action();
    }
    return response;
  } catch (error) {
    return error;
  }
}
