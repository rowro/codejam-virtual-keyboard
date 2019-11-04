import Key from "./Key";

export default class Keyboard {
    constructor(keyboardTemplate) {
        this.language = 'ru';
        this.capsLock = false;
        this.keyboardTemplate = keyboardTemplate;
        this.el = null;
        this.field = null;
        this.keys = [];
    }

    init() {
        if (localStorage.getItem('language')) {
            this.language = localStorage.getItem('language');
        } else {
            localStorage.setItem('language', this.language);
        }

        this.render();

        document.addEventListener('click', (e) => {
            let key = this.keys.find(item => item.el === e.target);
            if (key) {
                this.triggerKey(key, e);
            }
        });

        document.addEventListener('keyup', (e) => {
            let key = this.keys.find(item => item.code === e.code);
            if (key) {
                this.triggerKey(key, e);
            }
        });
    }

    render() {
        this.field = document.createElement('textarea');
        this.field.className = 'field';
        this.field.disabled = 'disabled';
        document.body.append(this.field);

        this.el = document.createElement('div');
        this.el.className = 'keyboard';

        this.keyboardTemplate.forEach((row, rowIndex) => {
            row.forEach((item) => {
                let key = new Key(item, this.language, this.capsLock);
                key.el.classList.add(`key_row_${rowIndex + 1}`);

                this.el.append(key.el);
                this.keys.push(key);
            });
        });

        document.body.append(this.el);
    }

    changeLanguage() {
        this.language = (this.language === 'ru') ? 'en' : 'ru';
        localStorage.setItem('language', this.language);
        this.keys.forEach(item => item.setLanguage(this.language));
    }

    triggerKey(key, e = null) {
        this.field.blur();
        key.setActive();

        switch (key.code) {
            case 'Backspace':
                this.field.innerHTML = this.field.value.slice(0, -1);
                break;

            case 'CapsLock':
                this.capsLock = !this.capsLock;
                this.keys.forEach(item => item.toggleCapsLock());
                break;

            case 'Enter':
                this.field.value += '\n';
                break;

            case 'Space':
                this.field.value += '&#32;';
                break;

            case 'AltLeft':
            case 'AltRight':
                if (e.shiftKey) {
                    this.changeLanguage();
                }
                break;

            case 'Tab':
            case 'Delete':
            case 'MetaLeft':
            case 'MetaRight':
            case 'ShiftLeft':
            case 'ShiftRight':
            case 'ControlLeft':
            case 'ControlRight':
                break;

            default:
                if (e.shiftKey) key.toggleCapsLock();

                this.field.value += ((e.shiftKey) && key.shiftKey) ? key.shiftKeyLabel : key.el.innerText;

                if (e.shiftKey) key.toggleCapsLock();
                break;
        }
    }
}