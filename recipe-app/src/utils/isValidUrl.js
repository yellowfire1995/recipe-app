export const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isValidHTML = (textString) => {
  var htmlPattern = new RegExp(/^<!DOCTYPE HTML>/i); // validate fragment locator
  return !!htmlPattern.test(textString);
};
