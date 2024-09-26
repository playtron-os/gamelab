export const DEFAULT_COOKIE_DURATION = 1;

export const setCookie = (
  cname: string,
  cvalue: string,
  exdays: number = DEFAULT_COOKIE_DURATION
) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  const domain = getDomain();
  const cookieString = `${cname}=${cvalue};${expires};path=/${domain}`;
  document.cookie = cookieString;
};

export const getCookie = (cname: string) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const deleteCookie = (cname: string) => {
  const domain = getDomain();
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domain};`;
};

function getDomain() {
  return window.location.host.includes("localhost")
    ? ""
    : `;domain=${window.location.host.split(".").slice(-2).join(".").split(":")[0]}`;
}
