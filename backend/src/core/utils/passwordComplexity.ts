import consts from '@config/consts';

const verifyPasswordComplexity = (password) => {
  // Check minimum length
  const minLength = parseInt(consts.PASSWORD_MIN_LENGTH) || 8;
  const isLengthValid = password.length >= minLength;

  // Check for uppercase if required
  const hasUppercase = consts.PASSWORD_REQUIRE_UPPERCASE
    ? /[A-Z]/.test(password)
    : true;

  // Check for lowercase if required
  const hasLowercase = consts.PASSWORD_REQUIRE_LOWERCASE
    ? /[a-z]/.test(password)
    : true;

  // Check for digit if required
  const hasDigit = consts.PASSWORD_REQUIRE_DIGIT ? /\d/.test(password) : true;

  // Check for special character if required
  const hasSpecialChar = consts.PASSWORD_REQUIRE_SPECIAL_CHAR
    ? /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    : true;

  let message =
    'Password complexity is not good. Please ensure that your password ';

  if (!isLengthValid) message += `is at least ${minLength} characters long. `;
  if (!hasUppercase) message += 'contains at least one uppercase letter. ';
  if (!hasLowercase) message += 'contains at least one lowercase letter. ';
  if (!hasDigit) message += 'contains at least one digit. ';
  if (!hasSpecialChar) message += 'contains at least one special character. ';

  // If all criteria are met, return null (indicating success)
  if ( isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecialChar) {
    return null;
  }
  // If any criteria are not met, return an error message
  return message.trim();
};

export default verifyPasswordComplexity;
