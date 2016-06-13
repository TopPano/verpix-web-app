import { parseUsername, parseProfilePhotoUrl } from './profileParser';

export default function genLikelist(list) {
  const { users, userIds } = list;
  let _list = [];
  userIds.map((id) => {
    const user = users[id].user;
    const username = parseUsername(user);
    const profilePhotoUrl = parseProfilePhotoUrl(user);
    const isFollowing = users[id].isFollowing;
    _list.push({
      username,
      profilePhotoUrl,
      id: user.sid,
      isFollowing
    })
  });
  return _list;
}
