export const convertParamsToObject = url => {
  if (url.length === 0) return {};
  const arr = url.slice(1).split(/&|=/);
  const params = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    params[key] = value;
  }
  return params;
};

export const addLocationQuery = history => {
  history.location = Object.assign(history.location, {
    query: convertParamsToObject(history.location.search),
  });
};
