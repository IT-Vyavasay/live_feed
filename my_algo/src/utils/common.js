import crypto from "crypto";
import moment from 'moment';
var ethereum_address = require("ethereum-address");
const decimal = require('ascii-decimal');

export function validate_string(data, prefix, type = 0) {
  if (!data) {
    let pre = type == 0 ? 'Enter ' : ' Select'
    throw pre + prefix;
  } else if (typeof data !== "string") {
    throw prefix + " is not valid";
  }
}
export function validate_config_number(data, prefix, type = 0) {
  if (typeof parseInt(data) !== "number" || parseInt(data) < 0 || data == null) {
    let pre = type == 0 ? 'Enter ' : ' Select'
    throw pre + prefix;
  } else if (parseInt(data) > 100) {
    throw prefix + " value should be less than or equal to 100%";
  }
}

export function validate_filter_numbers(data) {
  for (let dd in data) {
    let d = data[dd]
    if (typeof parseInt(d) !== "number" || parseInt(d) < 0 || d == null) {
      return false
    }
  }
  return true
}

export function validate_numbers(data) {
  for (let dd in data) {
    let d = data[dd]
    if (typeof parseInt(d) !== "number" || parseInt(d) <= 0 || d == null) {
      return false
    }
  }
  return true
}

export function validate_filter_strings(data) {
  for (let dd in data) {
    let d = data[dd]
    if (typeof d !== "string" || d == '') {
      return false
    }
  }
  return true
}

export function chk_username(a) {
  return /^[a-zA-Z0-9]{5,15}$/.test(a);
}

export function chk_voucher_username(a) {
  return /^[a-zA-Z0-9]{3,15}$/.test(a);
}

export function chk_email(str) {
  if (!(/^[a-z_0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/.test(str))) {
    throw "Invalid Email";
  }
}

export function chk_URL(str, prefix) {
  const urlRegex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
  if (!str) {
    throw `Enter ${prefix}`
  } else if (!urlRegex.test(str)) {
    throw "Invalid " + prefix;
  }

  return true;
}

export function chk_password(str) {
  if (!(/^\S*(?=\S{8,30})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[!\\/\\\\\"#$%&'()*+,-.\\:;<=>?@[\]^_`{|}~])\S*$/.test(str))) {
    throw "Invalid Password"
  }
}

export function chk_OTP(str) {
  return /^[0-9]{6}$/.test(str);
}

/* END : Input validation function */

export function convert_date(date) {
  return moment(date * 1000).format("DD, MMM YYYY hh:mm A");
}

export function convert_date_only(date) {
  return moment(date * 1000).format("DD, MMM YYYY");
}

export function convert_gmt_date_only(date) {
  return moment.utc(new Date(date * 1000)).format("DD, MMM YYYY");
}

export function convert_gmt_time(date) {
  return moment.utc(new Date(date * 1000)).format("DD, MMM YYYY hh:mm A");
}

export function getGMTtime() {
  const localDate = new Date();
  const offsetMinutes = localDate.getTimezoneOffset();
  const gmtDate = new Date(localDate.getTime() - offsetMinutes * 60000);
  const gmtTimestamp = Math.floor(gmtDate.getTime() / 1000);
  return gmtTimestamp;
}

export function enc(textToEncrypt, secret) {
  const iv = secret.substr(0, 16);
  const encryptor = crypto.createCipheriv('aes-256-ctr', secret, iv);
  return encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64');
}

export function dec(encryptedMessage, secret) {
  const iv = secret.substr(0, 16);
  const decryptor = crypto.createDecipheriv('aes-256-ctr', secret, iv);
  return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
}

export function get_timestemp() {
  return Math.floor(new Date().getTime() / 1000)
}



function hasUnicode(str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) return true;
  }
  return false;
}

export function strGenerator(l = 10) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function to_float(value, precision = 8) {
  return parseFloat(parseFloat(value.toString()).toFixed(precision))
}

export function encryption_key(type) {
  let data = {
    ids: "d8sDuFrtSIWDS23fSDEtaG6BjHfjtcmG",
    passwordKey: "Ka8muhoHgUhB^G5eR8qq3vgI54^Mccsn",
    userPasswordKey: "rTJCBcg33q15yVUW5TsaAj2NkK1Wz5aJ",
    twofaKey: "HNdYduYLzoHB3AT3A6NvZf9DRTq9wQXu",
    stakeUserId: "KGVkfq62Lc31ShC5nqTQHeCMtNcmDZc5",
    transactionId: "vZfrwBcJzmbippU1UhKkSp3mwNckzdT3",
    userNftId: "WtAqO0jTZYuEZ1T3fJ7cX9aBwjGwikhM",
    userId: "d8sDuFrtSIWDS23fSDEtaG6BjHfjtcmG",
    voucherId: "iznU5QNTrRG3fiUSPzbSy8jitVqyPzG7",
    serialId: "AKpYwDkLt99dDzMDziEhYm2LHrLq6THB"
  }
  return data[type]
}

export function chk_otp(str) {
  if (!str) {
    throw "Enter google authenticator OTP"
  } else if (!/^[0-9]{6}$/.test(str)) {
    throw "Enter valid 6 digits google authenticator OTP"
  }
}

export function chk_confirm_password(pwd, cpwd, errorMsg) {
  if (pwd !== cpwd) {
    throw errorMsg
  }
}

export function chk_valid_title(str, prefix) {
  if (!/^[0-9A-Za-z .,]+$/.test(str)) {
    throw "Enter valid " + prefix
  }
}

export function validate_selected_string(data, prefix) {
  if (!data) {
    throw "Select " + prefix;
  } else if (typeof data !== "string") {
    throw prefix + " is not valid";
  }
}
export function validate_input_number_zero_or_one(data, prefix, type = 1) {
  let tag = type == 0 ? 'Enter valid' : 'Select valid'
  if (!data) {
    throw "Select " + prefix;
  }
  else if (!["0", "1"].includes(`${data}`)) {
    throw tag + " " + prefix
  }
}
export function generateNumeric(a = 6) {
  const g = "5468791302";
  let r = "";
  for (let i = 0; i < a; i++) {
    r += g.charAt(Math.floor(Math.random() * g.length));
  }
  return r;
}

export function validateFile(file, type) {
  if (!file) {
    throw `Select ${type == "images" ? "image" : type == "docs" ? "file" : type == "_docs" ? "file" : 'video'}.`;
  }
  const file_type = [["image/png", "image/jpg", "image/jpeg", "image/gif"], ["pdf", "ppt", "pptx"], ["video/mp4"]]

  if ((type == "images" && file_type[0].indexOf(file.type) < 0) || ((type == "docs" || type == "_docs") && file_type[1].indexOf(file.type.split("/")[1]) < 0) || (type == "videos" && file_type[2].indexOf(file.type) < 0)) {
    if (type == "images") throw "Only PNG, JPG, JPEG, and GIF files are allowed"
    if (type == "docs" || type == "_docs") throw "Only PPT and PDF files are allowed"
    if (type == "videos") throw "Only mp4 videos are allowed"
  }
  let max_file_size = 2 * 1024 * 1024;
  if (type == "images" || type == "docs") {
    const max_file_size = type == "images" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > max_file_size) {
      throw `File size must not exceed ${type == "images" ? "2" : "5"} MB.`;
    }
  }
  max_file_size = 10 * 1024 * 1024
  if (type == "videos" && file.size > max_file_size) {
    throw "Video size must not exceed 10 MB."
  }
}

export function validate_input_number(data, prefix, prefix1 = prefix, type = 0) {
  if (!data) {
    throw `${type == 0 ? "Enter " : "Select "}` + prefix
  }
  if (Number(data) <= 0) {
    throw prefix1 + " must be greater than 0"
  }
}

export function validate_input_number_zero(data, prefix, type = 0) {
  let tag = type == 0 ? 'Enter' : 'Select'
  if (data == "" && data != "0") {
    throw tag + " " + prefix
  } else if (data < 0) {
    throw tag + " " + prefix
  }
}

export function chk_per(num, prefix) {
  if (!num) {
    throw `Enter ${prefix}`
  } else if (num <= 0 || num > 100) {
    throw `Enter ${prefix} between 0% to 100%`;
  }
}
export function chk_voucher_per(num, prefix) {
  if (num == "" && num != "0") {
    throw `Enter ${prefix}`
  } else if (num < 0 || num > 100) {
    throw `Enter ${prefix} between 0% to 100%`;
  }
}

export function validate_url(data, prefix) {
  if (!data) {
    throw "Enter " + prefix
  } else if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(data)) {
    throw "Enter valid " + prefix
  }
}

export function validate_youtube_url(data, prefix) {
  if (!data) {
    throw "Enter " + prefix
  } else if (!/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/.test(data)) {
    throw "Enter valid " + prefix
  }
}

export function trunc(string, st = 5, ed = 5) {
  return string.substr(0, st) + '...' + string.substr(-ed);
}

export function current_day(date) {
  return new Date(parseFloat(date) * 1000).getDay()
}

export function firstdate_currmonth() {
  let currentDate = new Date()
  let firstDayOfCurrentMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1, 0, 0, 0, 0))
  let timestamp = firstDayOfCurrentMonth.getTime() / 1000
  return timestamp
}

export function lastdate_currmonth() {
  let currentDate = new Date()
  let firstDayOfNextMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1, 0, 0, 0, 0))
  let lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1)
  let timestamp = Math.floor(lastDayOfCurrentMonth.getTime() / 1000)
  return timestamp
}

export function validate_address(address) {
  if (ethereum_address.isAddress(address)) {
    return true
  } else {
    return false
  }
}

export function getDecimalDivison(amount, decimal, type) {
  if (decimal == 18) {
    return type == 0 ? Math.floor(amount * 100000000) + ((1e10).toString().substr(1, 10)) : amount / Number("1e" + 18)
  } else {
    return type == 0 ? amount * Number("1e" + decimal) : amount / Number("1e" + decimal)
  }
}

export function current_ascidecimal(str) {
  let datas = str.split("").map((c) => {
    return decimal(c)
  })
  return datas.join("")
}



export function passDec(encryptedMessage, secret) {
  var encryptionMethod = 'AES-256-CBC';
  var iv = secret.substr(0, 16);
  var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
  return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
}


export function passEnc(textToEncrypt, secret) {
  var encryptionMethod = 'AES-256-CBC';
  var iv = secret.substr(0, 16);
  var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
  return encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64');
}


export function validateURL(url, msg) {
  if (!url)
    throw 'Enter ' + msg
  const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+)(\/[a-zA-Z0-9-_@:%\+.~#?&//=]*)?$/
  if (!pattern.test(url))
    throw 'Enter valid ' + msg
}
export function getOrdinalSuffix(n, isLast) {
  const j = n % 10,
    k = n % 100;
  let suffix;
  if (j === 1 && k !== 11) {
    suffix = "st";
  } else if (j === 2 && k !== 12) {
    suffix = "nd";
  } else if (j === 3 && k !== 13) {
    suffix = "rd";
  } else {
    suffix = "th";
  }
  return `${n}<sup>${suffix}</sup>${isLast ? '' : ', '}`;
}


export function compareArrays(arr1, arr2, errorMsg) { 
  if (arr1.length !== arr2.length) {
    return true; // Arrays have different lengths
  }

  // Check each element
  for (let i = 0; i < arr1.length; i++) {
    // Parse both elements as floats for comparison
    if (parseFloat(arr1[i]) !== parseFloat(arr2[i])) {
      return true; // Arrays are not the same
    }
  }

  // If all elements are equal, throw error
  throw errorMsg;
}
export function compareValue(arr1, arr2, errorMsg) { 
  if (arr1.length !== arr2.length) {
    return true; // Arrays have different lengths
  }

  // Check each element
  for (let i = 0; i < arr1.length; i++) {
    // Parse both elements as floats for comparison
    if (arr1[i] !== arr2[i]) {
      return true; // Arrays are not the same
    }
  }

  // If all elements are equal, throw error
  throw errorMsg;
}

