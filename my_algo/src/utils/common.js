const crypto = require('crypto')
// let speakeasy = require("speakeasy");

const showError = ({ error, errorField }) => {
  return `Error in ${errorField}`, error
}

function get_timestemp() {
  return Math.floor(new Date().getTime() / 1000)
}

let generateOTP = Math.random().toString().substr(2, 6)

function encryption_key(type) {
  let data = {
    twofaKey: 'n90Ayh2IMP9PqhVSAf2A2uEAHeX0rZdM',
    postKey: 'rTJCBcg33q15yVUW5TsaAj2NkK1Wz5aJ',
    otpKey: 'Q9NtMb3feYqtD7kkCZRXxdNe2p12H0tG'
  }
  return data[type]
}

function enc(textToEncrypt, secret) {
  try {
    const iv = secret.substr(0, 16)
    const encryptor = crypto.createCipheriv('aes-256-ctr', secret, iv)
    return encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64')
  } catch (error) {
    console.log('Error in encryption', error)
  }
}

function dec(encryptedMessage, secret) {
  try {
    const iv = secret.substr(0, 16)
    const decryptor = crypto.createDecipheriv('aes-256-ctr', secret, iv)
    return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8')
  } catch (error) {
    console.log('Error in decryption', error)
  }
}

// function verify2FaOtp(twoFaCode, otp) {
//   let twofa = speakeasy.totp.verify({
//     secret: dec(twoFaCode, encryption_key("twofaKey")),
//     encoding: "base32",
//     token: Number(otp),
//   });

//   return twofa;
// }

function validate_string(data, prefix, type = 0) {
  if (!data) {
    throw prefix + (type == 0 ? ' is not getting' : 'Select ')
  } else if (typeof data !== 'string') {
    throw prefix + ' is not valid'
  }
}

function validate_number(data, prefix, type = 0) {
  if (!data) {
    throw prefix + (type == 0 ? ' is not getting' : 'Select ')
  } else if (typeof parseInt(data) !== 'number') {
    throw prefix + ' is not valid'
  }
}

function validate_value(data, prefix, type = 0) {
  if (!data) {
    throw prefix + (type == 0 ? ' is not getting' : 'Select ')
  } else if (!['string', 'number'].includes(typeof data)) {
    throw prefix + ' is not valid'
  }
}

function validate_email(str) {
  if (!/^[a-z_0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/.test(str)) {
    throw 'Enter valid email'
  }
}

function chk_email(str) {
  if (!/^[a-z_0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/.test(str)) {
    throw 'Invalid Email'
  }
}

function chk_confirm_email(str, str1) {
  if (str != str1) {
    throw "Email & confirm email doesn't match"
  }
}

function chk_password(str) {
  if (
    !/^\S*(?=\S{8,30})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[!\\/\\\\\"#$%&'()*+,-.\\:;<=>?@[\]^_`{|}~])\S*$/.test(
      str
    )
  ) {
    throw 'Invalid Password'
  }
}

function chk_fullName(str) {
  if (!/^[a-zA-Z ]{3,}$/.test(str)) {
    throw 'Full name contains only alphabet character'
  }
}

function chk_username(a) {
  if (!/^[a-zA-Z0-9]{5,15}$/.test(a)) {
    throw 'Username must be contains 5-15 character and number'
  }
}

function validate_option_string({ data, prefix, type = 0, allowedOptions = null }) {
  if (data === undefined || data === null || data === '') {
    // Allow empty string only if explicitly intended (optional)
    if (data === '') return // Remove this line if empty string is invalid
    throw prefix + (type === 0 ? ' is not getting' : 'Select ')
  }

  if (typeof data !== 'string') {
    throw prefix + ' is not valid'
  }

  // Validate format: digits separated by commas, no spaces
  const validFormat = /^\d+(,\d+)*$/
  if (!validFormat.test(data)) {
    throw prefix + " format is invalid (e.g., '1', '1,2,3')"
  }

  // If allowedOptions provided, check that each number in data is in allowedOptions
  if (allowedOptions !== null) {
    // Validate allowedOptions format too (basic check)
    if (typeof allowedOptions !== 'string' || !/^\d+(,\d+)*$/.test(allowedOptions)) {
      throw prefix + ' allowedOptions parameter format is invalid'
    }

    // Convert strings to arrays of numbers (as strings)
    const allowedArr = allowedOptions.split(',')
    const dataArr = data.split(',')

    // Check each element in dataArr is included in allowedArr
    const invalidOptions = dataArr.filter(opt => !allowedArr.includes(opt))
    if (invalidOptions.length > 0) {
      throw (
        prefix + ' contains invalid options: ' + invalidOptions.join(', ') + '. Allowed options are: ' + allowedOptions
      )
    }
  }
}

function passDec(encryptedMessage, secret) {
  var encryptionMethod = 'AES-256-CBC'
  var iv = secret.substr(0, 16)
  var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv)
  return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8')
}

function chk_mobile(mobile) {
  // Remove + or - to evaluate digits only
  const digitsOnly = mobile.replace(/^[+-]/, '')

  // Length check
  if (mobile.length !== 10) {
    throw 'Mobile number length must be 10'
  }

  // Ensure all remaining characters are digits
  if (!/^\d+$/.test(digitsOnly)) {
    throw 'Mobile number must contain only digits'
  }

  // Extract last 10 digits (assuming that's the actual mobile number)
  //   const mobilePart = digitsOnly.slice(-10);

  //   // Validate that mobile number starts with 6, 7, 8, or 9
  //   if (!/^[6-9]/.test(mobilePart)) {
  //     throw "Mobile number must start with 6, 7, 8, or 9";
  //   }

  return true
}

function checkCountryCode(code) {
  const regex = /^[+-]\d{1,4}$/
  if (!regex.test(code)) {
    throw "Invalid country code. It must start with '+' or '-' followed by 1 to 4 digits."
  }
  return true
}

function passEnc(textToEncrypt, secret) {
  var encryptionMethod = 'AES-256-CBC'
  var iv = secret.substr(0, 16)
  var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv)
  return encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64')
}

function chk_password(str) {
  if (
    !/^\S*(?=\S{8,30})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[!\\/\\\\\"#$%&'()*+,-.\\:;<=>?@[\]^_`{|}~])\S*$/.test(
      str
    )
  ) {
    throw 'Invalid Password'
  }
}

function isSubset(superset, subset) {
  const supersetSet = new Set(superset.map(String))

  for (let item of subset) {
    if (!supersetSet.has(String(item))) {
      throw 'Subset contains value not in superset'
    }
  }

  return true
}

function req_encryption_key() {
  return 'Ka8muhoHgUhB^G5eR8qq3vgI54^Mccsn'
}

function generateNumeric(a = 6) {
  // if (process.env.TESTNET == "true") {
  //   return 123456;
  // }
  const g = '5468791302'
  let r = ''
  for (let i = 0; i < a; i++) {
    r += g.charAt(Math.floor(Math.random() * g.length))
  }
  // return '123456';
  return r
}
function chk_OTP(str, msg) {
  if (!/^[0-9]{6}$/.test(str)) {
    throw msg ? msg : 'Invalid OTP'
  }
  return true
}

function to_float(value, precision = 8) {
  return parseFloat(parseFloat(value.toString()).toFixed(precision))
}

function convert_date(date, type = 0) {
  if (!date) return '-'
  const moment = require('moment')

  // If date is in seconds, convert to ms
  const isSeconds = date.toString().length === 10
  const parsedDate = isSeconds ? date * 1000 : date

  switch (type) {
    case 1:
      return moment(parsedDate).format('MMMM DD, YYYY') // January 10, 2024
    case 2:
      return moment(parsedDate).format('DD MMM YYYY') // 10 Jan 2024
    case 3:
      return moment(parsedDate).format('DD/MM/YYYY') // 10/01/2024
    case 4:
      return moment(parsedDate).format('YYYY-MM-DD') // 2024-01-10
    case 5:
      return moment(parsedDate).fromNow() // 2 days ago, just now
    default:
      return moment(parsedDate).format('DD, MMM YYYY hh:mm A') // Default
  }
}

function chk_email(str) {
  if (!/^[a-z_0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/.test(str)) {
    throw 'Invalid Email'
  }
}

function chk_confirm_password(pwd, cpwd) {
  if (pwd !== cpwd) {
    throw "Password and Confirm password doesn't match"
  }
}

function validateFilterNumbers(data) {
  if (!Array.isArray(data)) {
    return false
  }
  for (let d of data) {
    let parsed = parseInt(d, 10)
    if (!Number.isInteger(parsed) || parsed < 0 || d === null) {
      return false
    }
  }
  return true
}

function validateNumbers(data) {
  if (!Array.isArray(data)) {
    return false
  }

  for (let d of data) {
    let parsed = parseInt(d, 10)
    if (!Number.isInteger(parsed) || parsed < 0 || d === null) {
      return false
    }
  }
  return true
}

function validateRole(role, prefix = 'Role') {
  const allowedRoles = [1, 2, 3]
  const parsed = parseInt(role, 10)

  if (!Number.isInteger(parsed) || !allowedRoles.includes(parsed)) {
    throw `${prefix} must be valid`
  }

  return true
}

function validateOption(value, allowedOptions = [1, 2, 3], prefix = 'Option') {
  if (!allowedOptions.includes(value)) {
    throw `${prefix} must be valid, its value should be one of ${allowedOptions.join(', ')}`
  }

  return true
}

function validateFilterStrings(data) {
  if (!Array.isArray(data)) {
    return false
  }

  for (let d of data) {
    if (typeof d !== 'string' || d.trim() === '') {
      return false
    }
  }
  return true
}

async function recaptcha(token) {
  const secret = process.env.SECRET_KEY
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
    method: 'POST'
  })
  const data = await response.json()
  return data.success
}
function strGenerator(l = 10) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function validate_input_number_zero_or_one(data, prefix, type = 1) {
  let tag = type == 0 ? 'Enter valid' : 'Select valid'
  if (!data) {
    throw 'Select ' + prefix
  } else if (!['0', '1'].includes(`${data}`)) {
    throw tag + ' ' + prefix
  }
}

function validate_filter_numbers(data = []) {
  for (let dd in data) {
    let d = data[dd]
    if (typeof parseInt(d) !== 'number' || d == '' || parseInt(d) < -1 || d == null) {
      return false
    }
  }
  return true
}

function validate_filter_strings(data = []) {
  for (let dd in data) {
    let d = data[dd]

    if (typeof d !== 'string' || d === '') {
      return false
    }
  }
  return true
}

function getErrorMessage(error) {
  if (!error) return 'Unknown error'

  if (typeof error === 'string') return error

  if (error.message) return error.message

  if (error.response && error.response.data && error.response.data.message) return error.response.data.message

  if (error.response && error.response.statusText) return error.response.statusText

  return JSON.stringify(error)
}

function decodeReferralCode(code) {
  try {
    const jsonString = Buffer.from(code, 'base64url').toString('utf8')
    return JSON.parse(jsonString) // returns { userId, role, timestamp }
  } catch (err) {
    throw new Error('Invalid referral code')
  }
}

function generateReferralCode({ userId, role, timestamp = Date.now() }) {
  // Validate userId must be a string
  if (typeof userId !== 'string' || `${userId}`.trim() === '') {
    throw new Error('Invalid userId: must be a non-empty string')
  }

  // Validate role must be convertible to a number
  const parsedRole = parseInt(role)
  if (isNaN(parsedRole)) {
    throw new Error('Invalid role: must be a number or numeric string')
  }

  const data = JSON.stringify({
    userId,
    role: parsedRole,
    timestamp
  })

  return Buffer.from(data).toString('base64url')
}

function handleReferralCode({ data, action }) {
  const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const timestamp = Date.now()
  function base62Encode(buffer) {
    let num = BigInt('0x' + buffer.toString('hex'))
    let result = ''
    while (num > 0) {
      const rem = num % 62n
      result = base62Chars[rem] + result
      num = num / 62n
    }
    return result.padStart(8, '0')
  }

  function base62Decode(str) {
    let num = 0n
    for (let char of str) {
      num = num * 62n + BigInt(base62Chars.indexOf(char))
    }
    const hex = num.toString(16)
    return Buffer.from(hex.length % 2 ? '0' + hex : hex, 'hex')
  }

  if (action === 'encode') {
    const raw = `${data.userId}|${data.role}|${timestamp}`
    const buffer = Buffer.from(raw, 'utf8')
    return base62Encode(buffer) // returns 8-char string
  }

  if (action === 'decode') {
    const buffer = base62Decode(data) // here `data` is the code
    const [userId, role, date] = buffer.toString('utf8').split('|')
    return { userId, role, date }
  }

  throw new Error("Invalid action. Use 'encode' or 'decode'.")
}

function generateUniqPostId({ providerId, postId, timestamp = Date.now() }) {
  // Validate providerId must be a string
  if (typeof providerId !== 'string' || `${providerId}`.trim() === '') {
    throw new Error('Invalid providerId: must be a non-empty string')
  }

  // Validate postId must be convertible to a number
  const parsedPostId = parseInt(postId)
  if (isNaN(parsedPostId)) {
    throw new Error('Invalid postId: must be a number or numeric string')
  }

  const data = JSON.stringify({
    providerId,
    postId: parsedPostId,
    timestamp
  })

  return Buffer.from(data).toString('base64url')
}

const filterValidFields = data => {
  try {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined && value !== null))
  } catch (error) {
    throw error
  }
}

const encPostKey = finalPostId => enc(`${finalPostId}`, encryption_key('postKey'))

const decPostKey = encryptedMessage => dec(encryptedMessage, encryption_key('postKey'))

function sanitizePostData(data) {
  const requiredFields = {
    postId: null,
    uniqId: null,
    providerId: null,
    description: '',
    fileUrlList: null,
    orientation: null,
    likes: 0,
    comments: 0,
    postPrice: 0,
    type: 2,
    revenue: 0,
    provider: null,
    createdOn: 0,
    updatedOn: 0
  }

  // Fields that should be parsed as integers
  const intFields = [
    'postId',
    'providerId',
    'likes',
    'comments',
    'isLiked',
    'isSaved',
    'isPurchased',
    'postPrice',
    'type',
    'revenue',
    'postStatus',
    'createdOn',
    'updatedOn',
    'orientation'
  ]

  const sanitizedData = {}
  for (const field in requiredFields) {
    const value = data[field] !== undefined ? data[field] : requiredFields[field]

    // Parse as integer if the field is in the list of integer fields
    if (intFields.includes(field)) {
      sanitizedData[field] = parseInt(value, 10)

      // if (field == "createdOn") {
      //   sanitizedData[field] = convert_date(value);
      // }
    } else {
      sanitizedData[field] = value
    }
  }

  return sanitizedData
}

function sanitizeProfileData(data, role = 3) {
  const baseFields = {
    userId: null,
    name: null,
    email: null,
    mobile: null,
    role: null,
    createdOn: null,
    updatedOn: null,
    countryCode: null,
    profileImg: null,
    referralCode: null,
    fcmToken: null,
    category: [],
    isLive: 2,
    isSoftDeleted: 2,
    isBlocked: 2
  }

  // Additional fields for role === 2
  const role2ExtraFields = {
    userName: null,
    businessDetail: null,
    description: null,
    language: null,
    servicePrice: {
      chatPrice: null,
      videoPrice: null,
      liveCallPrice: null,
      voiceCallPrice: null,
      videoCallPrice: null,
      post: null
    },
    referralPoint: 0,
    totalPurchase: 0,
    totalMinute: 0,
    totalPost: 0,
    totalFollower: 0
  }

  // Merge base with extra if role is 2
  const requiredFields = role == 2 ? { ...baseFields, ...role2ExtraFields } : baseFields

  // Fields that should be parsed as integers
  const intFields = [
    'userId',
    'mobile',
    'role',
    'createdOn',
    'updatedOn',
    'chatPrice',
    'videoPrice',
    'liveCallPrice',
    'voiceCall',
    'videoCallPrice',
    'post',
    'referralPoint',
    'totalPurchase',
    'totalMinute',
    'totalPost',
    'totalFollower'
  ]

  // Build sanitized result and handle renaming 'userId' to 'id'
  const sanitizedData = {}
  for (const field in requiredFields) {
    // Check if the field is 'userId' and rename it to 'id'
    const value = data[field] !== undefined ? data[field] : requiredFields[field]

    // Parse as integer if the field is in the list of integer fields
    if (intFields.includes(field)) {
      sanitizedData[field === 'userId' ? 'id' : field] = parseInt(value, 10)
    } else {
      sanitizedData[field === 'userId' ? 'id' : field] = value
    }
  }

  return sanitizedData
}

function generateOrderId() {
  return `order_${Date.now()}`
}

function getRoleTable(roleId) {
  switch (roleId) {
    case 1:
      return {
        tableName: 'tbladmin',
        primaryField: 'adminId'
      }
    case 2:
      return {
        tableName: 'tblprovider',
        primaryField: 'providerId'
      }
    case 3:
      return {
        tableName: 'tbluser',
        primaryField: 'userId'
      }
    default:
      return null // Invalid role
  }
}

function checkIsBlockedOrDeleted(user) {
  if (!user) {
    throw 'User data not provided'
  }

  const isBlocked = user.isBlocked || 0
  const isSoftDeleted = user.isSoftDeleted || 0

  if (isBlocked == 1) {
    throw user.role == 3
      ? 'Your account has been blocked. Please contact support.'
      : 'Your provider account has been blocked. Please contact support.'
  }

  if (isSoftDeleted == 1) {
    throw user.role == 3 ? 'Your account has been deleted.' : 'Your provider account has been deleted.'
  }
}

function fetchError({ error, defaultMessage = null }) {
  // If a default message is explicitly provided, show only that
  if (defaultMessage) {
    return defaultMessage
  }

  // Axios error format
  if (error.response && error.response.data) {
    const message = error.response.data.message || error.response.data.error || 'Unknown error'
    return message
  }
  // Fetch error format
  else if (error.json) {
    error
      .json()
      .then(err => {
        return err.message || 'Unknown error'
      })
      .catch(() => {
        return `Error parsing JSON from response.`
      })
  }
  // General JavaScript error
  else {
    return error.message || error.toString()
  }
}

function isValidUrl(url) {
  const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i
  return urlRegex.test(url)
}

function getPrioritizedStatus({ isVerify, isSoftDeleted, isBlocked, isApproved }) {
  if ([0, 2].includes(isApproved)) return 'notAprooved'
  if (isSoftDeleted == 1) return 'softDeleted'
  if (isBlocked == 1) return 'blocked'
  if ([0, 2].includes(isVerify)) return 'notVerified'
  if (isVerify == 1) return 'verified'
  return 'unknown' // If no status matches
}

const userStatusObj = {
  softDeleted: { color: 'error', label: 'Soft Deleted' },
  blocked: { color: 'warning', label: 'Blocked' },
  notVerified: { color: 'secondary', label: 'Unverified' },
  verified: { color: 'success', label: 'Active' },
  notAprooved: { color: 'info', label: 'Not Aprooved' },
  unknown: { color: 'default', label: 'Unknown' }
}

function refineLanguageString(input) {
  if (!input) return ''

  return input
    .split(',')
    .map(lang => lang.trim())
    .filter(Boolean)
    .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase())
    .join(', ')
}

function sumArray(arr) {
  try {
    return arr.reduce((total, num) => parseInt(total) + parseInt(num), 0)
  } catch (error) {
    console.error(showError({ error, errorField: 'sumArray' }))
    return 0
  }
}

function getValuesInSequence({ obj, sequence }) {
  try {
    return sequence.map(key => (obj[key] !== undefined ? obj[key] : null))
  } catch (error) {
    console.error(showError({ error, errorField: 'getValuesInSequence' }))
    return []
  }
}

function getPercentage({ part, baseValue }) {
  try {
    if (baseValue === 0) return 0 // avoid division by zero
    const percentage = (part / baseValue) * 100
    return Math.round(percentage * 100) / 100 // round to 2 decimals
  } catch (error) {
    console.error(showError({ error, errorField: 'getPercentage' }))
    return 0
  }
}

function excludeKeys({ obj, keysToRemove }) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToRemove.includes(key)))
}

function convertDates(dates) {
  // Convert date strings to milliseconds
  const millis = dates.map(date => new Date(date).getTime())

  // Convert milliseconds back to the same date format (ISO in your case)
  const backToDates = millis.map(ms => new Date(ms).toISOString())

  return { millis, backToDates }
}

function timeAgo({ timestamp }) {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`
}

module.exports = {
  get_timestemp,
  encryption_key,
  enc,
  dec,
  // verify2FaOtp,
  validate_string,
  validate_email,
  validate_number,
  passDec,
  passEnc,
  chk_password,
  req_encryption_key,
  generateNumeric,
  chk_OTP,
  chk_email,
  chk_confirm_password,
  to_float,
  convert_date,
  validateFilterNumbers,
  validateNumbers,
  validateFilterStrings,
  recaptcha,
  chk_confirm_email,
  chk_fullName,
  chk_username,
  chk_confirm_password,
  strGenerator,
  validate_input_number_zero_or_one,
  chk_mobile,
  validateRole,
  isSubset,
  checkCountryCode,
  validate_value,
  validateOption,
  validate_filter_numbers,
  validate_filter_strings,
  getErrorMessage,
  validate_option_string,
  decodeReferralCode,
  generateReferralCode,
  filterValidFields,
  encPostKey,
  decPostKey,
  sanitizePostData,
  sanitizeProfileData,
  generateUniqPostId,
  generateOrderId,
  handleReferralCode,
  getRoleTable,
  checkIsBlockedOrDeleted,
  fetchError,
  isValidUrl,
  getPrioritizedStatus,
  userStatusObj,
  refineLanguageString,
  sumArray,
  getValuesInSequence,
  showError,
  getPercentage,
  excludeKeys,
  convertDates,
  timeAgo
}
