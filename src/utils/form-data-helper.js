export function objectToFormData(
  obj,
  formData = new FormData(),
  parentKey = ""
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        // Handle File objects
        formData.append(formKey, value, value.name);
      } else if (value instanceof FileList) {
        // Handle FileList objects
        for (let i = 0; i < value.length; i++) {
          formData.append(`${formKey}[${i}]`, value[i], value[i].name);
        }
      } else if (
        value &&
        typeof value === "object" &&
        !(value instanceof Date)
      ) {
        // Recursively handle nested objects and arrays
        objectToFormData(value, formData, formKey);
      } else {
        // Handle primitive values (including Date objects)
        formData.append(formKey, value);
      }
    }
  }
  return formData;
}
