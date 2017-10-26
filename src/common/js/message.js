import {getUserId, formatAvatar, isUnDefined} from 'common/js/util';

export function addMsg(msg, selToID, photo = '') {
  var sess = msg.sess;
  if (!webim.MsgStore.sessMap[sess._impl.id]) {
    webim.MsgStore.sessMap[sess._impl.id] = sess;
  }
  let {fromAccount, fromAccountNick, time, uniqueId, random, seq, isSend, elems} = msg;
  let _elems = elems.map((item) => {
    let obj = {
      type: item.type
    };
    if (item.type === 'TIMImageElem') {
      let imgInfoArray = item.content.ImageInfoArray.map((image) => {
        return {
          url: image.url
        };
      });
      obj.content = {
        ImageInfoArray: imgInfoArray
      };
    } else if (item.type === 'TIMFaceElem') {
      obj.content = {
        data: item.content.data,
        index: item.content.index
      };
    } else if (item.type === 'TIMTextElem') {
      obj.content = {
        text: item.content.text
      };
    }
    return obj;
  });
  let _msg = {
    fromAccount,
    fromAccountNick,
    seq,
    time,
    uniqueId,
    random,
    isSend,
    icon: formatAvatar(msg.getSession().icon()),
    elems: _elems
  };
  var toUser = selToID;
  var fromUser = getUserId();
  if (photo) {
    _msg.photo = photo;
  } else if (fromUser !== fromAccount) {
    _msg.photo = _msg.icon;
  }
  return {
    msg: _msg,
    toUser,
    fromUser
  };
}

const GENDER = {
  '0': 'Gender_Type_Female',
  '1': 'Gender_Type_Male'
};

export function setProfilePortrait ({gender, nickname, photo}) {
  var profileItem = [{
    'Tag': 'Tag_Profile_IM_Nick',
    'Value': nickname
  }, {
    'Tag': 'Tag_Profile_IM_AllowType',
    'Value': 'AllowType_Type_AllowAny'
  }];
  photo && profileItem.push({
    'Tag': 'Tag_Profile_IM_Image',
    'Value': photo
  });
  !isUnDefined(gender) && profileItem.push({
    'Tag': 'Tag_Profile_IM_Gender',
    'Value': GENDER[gender]
  });
  var options = {
    'ProfileItem': profileItem
  };
  webim.setProfilePortrait(options);
}
