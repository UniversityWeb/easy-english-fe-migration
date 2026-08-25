const LOGIN_RESPONSE_KEY = 'loginResponseData';

export const isLoggedIn = () => {
  let data = localStorage.getItem(LOGIN_RESPONSE_KEY);
  // console.log(`isLoggedIn() method: ${data}`);
  return data !== null;
};

export const saveLoginResponse = (loginResponse) => {
  localStorage.setItem(LOGIN_RESPONSE_KEY, JSON.stringify(loginResponse));
};

export const removeLoginResponse = () => {
  localStorage.removeItem(LOGIN_RESPONSE_KEY);
};

export const getToken = () => {
  if (!isLoggedIn()) {
    return null;
  }

  return JSON.parse(localStorage.getItem(LOGIN_RESPONSE_KEY)).tokenStr;
};

export const getUsername = () => {
  if (!isLoggedIn()) {
    return null;
  }
  return JSON.parse(localStorage.getItem(LOGIN_RESPONSE_KEY)).user?.username;
};

export const getCurrentUserRole = () => {
  if (!isLoggedIn()) {
    return null;
  }
  return JSON.parse(localStorage.getItem(LOGIN_RESPONSE_KEY)).user?.role;
};
