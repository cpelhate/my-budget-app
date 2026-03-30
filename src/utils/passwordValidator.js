// src/utils/passwordValidator.js
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  if (password.length < minLength) errors.push(`Minimum ${minLength} caractères`);
  if (!hasUpper) errors.push('1 majuscule');
  if (!hasLower) errors.push('1 minuscule');
  if (!hasNumber) errors.push('1 chiffre');
  if (!hasSpecial) errors.push('1 caractère spécial (!@#$%^&*)');
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: password.length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial ? 'fort' :
              password.length >= 8 ? 'moyen' : 'faible'
  };
};
