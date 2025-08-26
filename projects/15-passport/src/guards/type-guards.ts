import { LocalUserData, GithubUserData } from '../types/auth.types';

export function isGithubUser(user: unknown): user is GithubUserData {
  return (
    user !== null &&
    typeof user === 'object' &&
    'id' in user &&
    'displayName' in user &&
    typeof (user as GithubUserData).id === 'string' &&
    typeof (user as GithubUserData).displayName === 'string'
  );
}

export function isLocalUser(user: unknown): user is LocalUserData {
  return (
    user !== null &&
    typeof user === 'object' &&
    'userId' in user &&
    'username' in user &&
    typeof (user as LocalUserData).userId === 'number' &&
    typeof (user as LocalUserData).username === 'string' &&
    !('displayName' in user)
  );
}
