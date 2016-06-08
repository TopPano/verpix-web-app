import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

export function parseUsername(user) {
  return user.identities.length > 0 ?
      user.identities[0].profile.displayName :
      user.username;
}

export function parseProfilePhotoUrl(user) {
  /*
  let profilePhotoUrl =
      user.identities.length > 0 ?
      user.identities[0].profile.photos[0].value :
      user.profilePhotoUrl;
  return profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL;
  */
  return user.profilePhotoUrl ? user.profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL;
}
