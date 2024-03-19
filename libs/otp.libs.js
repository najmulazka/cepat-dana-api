const otpGenerator = require('otp-generator');

const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

module.exports = otp;
