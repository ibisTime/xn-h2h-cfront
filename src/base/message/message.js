import './message.scss';

export default class Message {
  constructor() {
    let elem = document.createElement('div');
    elem.className = 'message-module-cont';
    let span = document.createElement('span');
    span.className = 'message-module-text';
    elem.appendChild(span);
    this.elem = elem;
    this.span = span;
    this.append = false;
  }
  show(text, delay = 1500) {
    this.span.innerText = text;
    this.elem.style.display = 'block';
    if (!this.append) {
      this.append = true;
      document.body.appendChild(this.elem);
    }
    setTimeout(() => {
      this.destory();
    }, delay);
  }
  hide() {
    this.elem.style.display = 'none';
  }
  destory() {
    this.elem.remove();
    this.append = false;
  }
}
