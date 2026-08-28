import { apiRequest } from "./client";

export async function loginUser(login, password) {
  return apiRequest("/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export async function registerUser(login, email, password) {
  return apiRequest("/user/register", {
    method: "POST",
    body: JSON.stringify({
      login,
      email,
      password,
    }),
  });
}



// Pobranie danych zalogowanego użytkownika
export async function getMe() {
  return apiRequest("/user/me", {
    method: "GET",
  });
}

// Usunięcie konta
export async function deleteAccount() {
  return apiRequest("/user/account", {
    method: "DELETE",
  });
}
// import { apiRequest } from "./client";

// export async function loginUser(login, password) {
//   return apiRequest("/user/login", {
//     method: "POST",
//     body: JSON.stringify({
//       login,
//       password,
//     }),
//   });
// }