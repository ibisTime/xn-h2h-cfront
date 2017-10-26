import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 50;

const MESSAGE_KEY = '__message__';

const USER_KEY = '__usermap__';

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function saveChatData(msg, toUser, fromUser, isTalking) {
  let chatData = storage.get(MESSAGE_KEY, {});
  if (!chatData[fromUser]) {
    chatData[fromUser] = {
      unRead: 0,
      users: []
    };
  }
  if (!chatData[fromUser][toUser]) {
    chatData[fromUser][toUser] = {
      unRead: 0,
      list: []
    };
  }
  let before = chatData[fromUser][toUser].unRead;
  if (isTalking) {
    chatData[fromUser][toUser].unRead = 0;
    chatData[fromUser].unRead -= before;
  } else {
    chatData[fromUser][toUser].unRead++;
    chatData[fromUser].unRead++;
  }
  chatData[fromUser][toUser].list.push(msg);
  insertArray(chatData[fromUser].users, toUser, (item) => {
    return item === toUser;
  });
  storage.set(MESSAGE_KEY, chatData);
  return chatData;
}

export function updateChatData (sender, receiver) {
  let chatData = storage.get(MESSAGE_KEY, {});
  if (chatData[sender.userId] && chatData[sender.userId][receiver.userId]) {
    let list = chatData[sender.userId][receiver.userId].list;
    let newList = list.map((item) => {
      if (item.fromAccount === sender.userId) {
        return {
          ...item,
          icon: sender.photo,
          photo: receiver.photo,
          fromAccountNick: sender.nickname
        };
      } else {
        return {
          ...item,
          icon: receiver.photo,
          photo: receiver.photo,
          fromAccountNick: receiver.nickname
        };
      }
    });
    chatData[sender.userId][receiver.userId].list = newList;
    let _item = chatData[sender.userId][receiver.userId];
    chatData[sender.userId].unRead -= _item.unRead;
    _item.unRead = 0;
  }
  storage.set(MESSAGE_KEY, chatData);
  return chatData;
}

export function loadChatData () {
  return storage.get(MESSAGE_KEY, {});
}

export function saveUserMap(user) {
  let userMap = storage.get(USER_KEY, {});
  userMap[user.userId] = {
    nickname: user.nickname,
    photo: user.photo
  };
  storage.set(USER_KEY, userMap);
  return userMap;
}

export function loadUserMap () {
  return storage.get(USER_KEY, {});
}
