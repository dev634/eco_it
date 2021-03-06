import { APP_URL, APP_SCHEME, APP_PORT } from "./constantes.js";

function createFormData(datas) {
  let form = new FormData();
  Object.keys(datas).map((elmt) => {
    form.append(elmt, datas[elmt]);
  });
  return form;
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
    if (result.status === 200 || result.status === 401) {
      let response = await result.json();
      return response;
    }
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
