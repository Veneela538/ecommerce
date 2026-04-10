// import { redirect } from "next/navigation"
// import { logout } from "@/actions/logout"
// import { signOut } from "@/auth"

import { env } from "@/lib/env";

import { redirect } from "next/navigation";
import { getClientHeader } from "./get-headers";

export const fetchWrapper = {
  get,
  post,
  put,
  patch,
  delete: _delete,
};

type FetchWithoutBodyType = {
  url: string;
  accessToken: string | undefined;
  options?: object;
};

type FetchWithBodyType = {
  url: string;
  accessToken: string | undefined;
  body: object;
  options?: object;
};

async function get({ url, accessToken, options }: FetchWithoutBodyType) {
  const clientHeaders = await getClientHeader();
  const requestOptions = {
    method: "GET",
    headers: {
      ...clientHeaders,
      // "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "Bearer-",
    },
    ...options,
  };
  return fetch(`${env.NEXT_PUBLIC_BACKEND_APP_URL}${url}`, requestOptions).then(
    handleResponse,
  );
}

async function post({ url, accessToken, body, options }: FetchWithBodyType) {
  const clientHeaders = await getClientHeader();
  const requestOptions = {
    method: "POST",
    headers: {
      ...clientHeaders,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
    ...options,
  };
  return fetch(`${env.NEXT_PUBLIC_BACKEND_APP_URL}${url}`, requestOptions).then(
    handleResponse,
  );
}

async function put({ url, accessToken, body, options }: FetchWithBodyType) {
  const clientHeaders = await getClientHeader();
  const requestOptions = {
    method: "PUT",
    headers: {
      ...clientHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    ...options,
  };
  return fetch(`${env.NEXT_PUBLIC_BACKEND_APP_URL}${url}`, requestOptions).then(
    handleResponse,
  );
}

async function patch({ url, accessToken, body, options }: FetchWithBodyType) {
  const clientHeaders = await getClientHeader();
  const requestOptions = {
    method: "PATCH",
    headers: {
      ...clientHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    ...options,
  };
  return fetch(`${env.NEXT_PUBLIC_BACKEND_APP_URL}${url}`, requestOptions).then(
    handleResponse,
  );
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete({ url, accessToken, options }: FetchWithoutBodyType) {
  const clientHeaders = await getClientHeader();
  const requestOptions = {
    method: "DELETE",
    headers: {
      ...clientHeaders,
      // "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  };
  return fetch(`${env.NEXT_PUBLIC_BACKEND_APP_URL}${url}`, requestOptions).then(
    handleResponse,
  );
}

// Helper Functions
function handleResponse(response: Response) {
  return response.text().then((text) => {
    // ! Not Working
    // if (response.status == 401) {
    //     redirect('/')
    //     logout()
    //     signOut().then(() => console.log("Logout"))
    // }
    const data = text && JSON.parse(text);
    // ? Debug Logs
    if (env.DEBUG == "DEBUG") {
      console.log(
        `${"-".repeat(34)}[${new Date().toUTCString()}]${"-".repeat(34)}`,
      );
      console.log({
        statusCode: response.status ?? "",
        url: response.url,
        data: data,
        // formattedData: JSON.stringify(data, null, 4) // ? Print formatted JSON
      });
      console.log(`${"-".repeat(48)}END${"-".repeat(48)}`);
    }
    if (!response.ok) {
      const error = data ?? response.statusText;

      // 🔥 Detect expired JWT from backend message
      if (error?.message && error.message.includes("expired")) {
        redirect("/auth/login?expired=true");
      }

      throw new Error(error?.message ?? error);
    }
    return data;
  });
}
