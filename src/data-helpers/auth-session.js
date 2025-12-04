// Created by: Aremu Olayinka Abayomi
// Helper site: https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/

export function storeDataInCookie(cName, cValue, expDays) {
  if (typeof window !== "undefined") {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    window.document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }
}

export function getDataInCookie(cName) {
  if (typeof window !== "undefined") {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(window.document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }
}

export function deleteDataInCookie(cName) {
  if (typeof window !== "undefined") {
    document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}

export function deleteAllCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  }
}
