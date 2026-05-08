const getCookieAttributes = (expDays) => {
  const attributes = ['path=/', 'SameSite=Lax'];

  if (Number.isFinite(expDays)) {
    const date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    attributes.push(`expires=${date.toUTCString()}`);
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    attributes.push('Secure');
  }

  return attributes.join('; ');
};

export function storeDataInCookie(cName, cValue, expDays) {
  if (typeof window !== 'undefined' && cName && cValue != null) {
    window.document.cookie = `${cName}=${encodeURIComponent(cValue)}; ${getCookieAttributes(expDays)}`;
  }
}

export function getDataInCookie(cName) {
  if (typeof window !== 'undefined') {
    const name = cName + '=';
    const cArr = window.document.cookie.split('; ');
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) {
        res = decodeURIComponent(val.substring(name.length));
      }
    });
    return res;
  }
}

export function deleteDataInCookie(cName) {
  if (typeof window !== 'undefined') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
  }
}

export function deleteAllCookie() {
  deleteDataInCookie('_id');
  deleteDataInCookie('access_token__admin');
  deleteDataInCookie('refresh_token__admin');
}
