export function compose(...funcs) {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function currentYear() {
  const year = new Date().getFullYear();
  const startYear = 2021;
  return year === startYear ? year : `${startYear} - ${year}`;
}

export function emailToUsername(email) {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.split('@')
    // return name
    return `${name}_${domain}_fio.dapp`
  }
}
