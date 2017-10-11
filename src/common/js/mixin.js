import {formatDate, formatAmount, formatImg, formatAvatar} from 'common/js/util';

export const commonMixin = {
  filters: {
    formatImg(img, suffix = '?imageMogr2/auto-orient') {
      return formatImg(img, suffix);
    },
    formatAvatar(img, suffix = '?imageMogr2/auto-orient') {
      return formatAvatar(img, suffix);
    },
    formatDate(date, format = 'yyyy-MM-dd') {
      if (!date) {
        return '--';
      }
      return formatDate(date, format);
    },
    formatAmount(price) {
      return formatAmount(price);
    }
  }
};

export const directiveMixin = {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
};
