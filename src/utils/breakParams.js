/**
 * @name breakParams
 * @description This function breaks the phone number or email address and replaces some of the characters with ***
 * @param {string} param
 * @param {boolean} isEmail
 * @returns string
 */

export const breakParams = (param, isEmail) => {
  // replace some of the characters in the string with ***
  let str = param
  let newStr = ""
  if (isEmail) {
    const splitEmail = str.split("@")
    str = splitEmail[0]
    let strArray = str ? str.split("") : []
    for (let i = 0; i < strArray?.length; i++) {
      if (i < 3) {
        newStr += strArray[i]
      } else {
        newStr += "*"
      }
    }
    return `${newStr}@${splitEmail[1]}`
  }
  // This is in case of phone number
  let strArray = str.split("")
  for (let i = 0; i < strArray.length; i++) {
    if (i < 4 || i > strArray.length - 4) {
      newStr += strArray[i]
    } else {
      newStr += "*"
    }
  }

  return newStr
}
