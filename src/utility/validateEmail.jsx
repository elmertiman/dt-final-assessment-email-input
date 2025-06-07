export function validateEmail(this_email) {
  const _regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return _regex.test(this_email);
}