export const isDate = (value: string) => {
  const regexExp =
    /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/;

  if (!value) {
    return false;
  }

  if (regexExp.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isAfter = (value: string) => {
  if (!value) {
    return false;
  }

  if (!isDate(value)) {
    return false;
  }

  const currentDate = new Date();
  const targetDate = new Date(value);

  if (targetDate <= currentDate) {
    return false;
  }

  return true;
};
