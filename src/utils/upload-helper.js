const acceptedImageFormats = ["jpg", "jpeg", "png"];

export const isValidImageFile = (filename) => {
  let parts = filename.split(".");

  if (acceptedImageFormats.includes(parts[parts.length - 1])) {
    return true;
  }
  return false;
};
