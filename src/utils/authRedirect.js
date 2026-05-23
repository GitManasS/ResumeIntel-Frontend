import { getHomePath, isCandidate } from './roles';

/** Safe internal redirect after login/register */
export function getPostAuthPath(user, redirect) {
  const home = getHomePath(user);
  if (!redirect || typeof redirect !== 'string') return home;
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return home;
  if (!isCandidate(user)) return home;
  return redirect;
}

export function loginUrl(redirectPath) {
  if (!redirectPath) return '/login';
  return `/login?redirect=${encodeURIComponent(redirectPath)}`;
}

export function registerUrl(redirectPath) {
  if (!redirectPath) return '/register?role=candidate';
  return `/register?role=candidate&redirect=${encodeURIComponent(redirectPath)}`;
}
