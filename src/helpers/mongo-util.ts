const ObjectId = require("mongoose").Types.ObjectId;

// Validator function
export const isValidObjectId = (id: string) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
