var viewport = document.documentElement;
var viewport_height = viewport.clientHeight;
var font_size = 100 * viewport_height / 1080;
viewport.style.fontSize = font_size.toFixed(1) + 'px';


function XHR() {
    // XHR构造函数，用于创建本机ajax请求
    this.URL_ROOT = 'http://127.0.0.1:8000/';
    this.request = null;
    this.response = null;
    let createRequest = () => {
        if (window.XMLHttpRequest) {
            this.request = new XMLHttpRequest();
        } else {
            this.request = new ActiveXObject('Microsoft.XMLHTTP');
        }
    };
    this.post = (url, object, callback, err = () => {}) => {
        createRequest();
        this.request.open('post', `${this.URL_ROOT}${url}`);
        this.request.onreadystatechange = () => {
            if (this.request.readyState === 4 && this.request.status === 200) {
                this.response = this.request.responseText;
                callback();
            } else if (this.request.readyState === 4 && this.request.status !== 200) {
                err();
            }
        };
        let req = '';
        for (let attr in object) {
            if (req === '') {
                req = `${attr}=${object[attr]}`;
            } else {
                req += `&${attr}=${object[attr]}`;
            }
        }
        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.request.send(req);
    };
    this.get = (url, object, callback, err = () => {}) => {
        createRequest();
        let req = '';
        for (let attr in object) {
            if (req === '') {
                req = `${attr}=${object[attr]}`;
            } else {
                req += `&${attr}=${object[attr]}`;
            }
        }
        this.request.open('get', `${this.URL_ROOT}${url}?${req}`);
        this.request.onreadystatechange = () => {
            if (this.request.readyState === 4 && this.request.status === 200) {
                this.response = this.request.responseText;
                callback();
            } else if (this.request.readyState === 4 && this.request.status !== 200) {
                err();
            }
        };
        this.request.send();
    }
}

function AnimationSequence(querySelectorSequence, options, animationEndHandler = () => {this.fallthrough = true}, clear = false) {
    this.fallthrough = false;
    this.callback = () => {};
    this.initializer = () => {};
    function activate(element) {
        if (typeof options.animationClass === 'object') {
            for (let i = 0; i < options.animationClass.length; i++) {
                element.classList.add(options.animationClass[i])
            }
        } else {
            element.classList.add(options.animationClass);
        }
    }

    function inactivate(element) {
        element.classList.remove(options.animationClass);
    }

    function addInitialClassName(element) {
        if (typeof options.initialClass === 'object') {
            for (let i = 0; i < options.initialClass.length; i++) {
                element.classList.add(options.initialClass[i])
            }
        } else {
            element.classList.add(options.initialClass);
        }
    }

    function removeInitialClassName(element) {
        if (typeof options.initialClass === 'object') {
            for (let i = 0; i < options.initialClass.length; i++) {
                element.classList.remove(options.initialClass[i])
            }
        } else {
            element.classList.remove(options.initialClass);
        }
    }

    function addFinalClassName(element) {
        if (typeof options.finalClass === 'object') {
            for (let i = 0; i < options.finalClass.length; i++) {
                element.classList.add(options.finalClass[i])
            }
        } else {
            element.classList.add(options.finalClass);
        }
    }

    function addAnimationEndEventListener(scope, listener) {
        scope.addEventListener('animationend', listener);
        return () => {
            scope.removeEventListener('animationend', listener);
        }
    }
    sequence = [];
    if (typeof querySelectorSequence === 'string') {
        sequence[0] = document.querySelector(querySelectorSequence);
    } else {
        for (let i = 0; i < querySelectorSequence.length; i++) {
            sequence[i] = document.querySelector(querySelectorSequence[i]);
        }
    }
    let listenerArr = [];
    this.animate = () => {
        this.initializer(sequence[0]);
        addInitialClassName(sequence[0]);
        activate(sequence[0]);
        for (let i = 0; i < sequence.length; i++) {
            let element = sequence[i];
            listenerArr.push(addAnimationEndEventListener(element, (e) => {
                removeInitialClassName(element);
                addFinalClassName(element);
                if (clear) inactivate(e.target);
                if (i === sequence.length - 1) {
                    listenerArr.forEach((fn) => {
                        fn();
                    });
                    listenerArr = [];
                    this.callback();
                    return;
                }
                animationEndHandler(i, element);
                let interval = setInterval(() => {
                    if (!this.fallthrough) return;
                    clearInterval(interval);
                    this.initializer(sequence[i + 1]);
                    addInitialClassName(sequence[i + 1]);
                    activate(sequence[i + 1]);
                    this.fallthrough = false;
                }, 10);
            }));
        }
    }
}

function DialogSequence(drama, animationEndHandler, options={}) {
    this.triggers = [];
    this.skipNextHandler = false;
    this.lock = false;
    this.callback = () => {};

    function changeText(textObj) {
        clearText();
        let titleString = textObj.title,
            textString = textObj.text;
        for (let i = 0; i < titleString.length; i++) {
            setTimeout(() => {
                vm_storyboard.title += titleString[i];
            }, 100 * i)
        }
        for (let i = 0; i < textString.length; i++) {
            setTimeout(() => {
                vm_storyboard.text += textString[i];
            }, 100 * (i + titleString.length));
        }
    }

    function clearText() {
        vm_storyboard.title = '';
        vm_storyboard.text = '';
    }

    function activateOptionBefore(before) {
        if (typeof options[`before_${before}`] !== 'function') return () => {};
        else return options[`before_${before}`];
    }

    function activateOptionAfter(after) {
        if (typeof options[`after_${after}`] !== 'function') return () => {};
        else return options[`after_${after}`];
    }

    function textAnimationEndWatcher(self, watch) {
        let interval = setInterval(() => {
            if (vm_storyboard.text === drama[watch].text) {
                clearInterval(interval);
                setTimeout(() => {
                    if (watch === drama.length - 1) {
                        setTimeout(() => {
                            self.callback();
                        }, 2000);
                        return;
                    }
                    activateOptionAfter(watch)();
                    setTimeout(() => {
                        if (self.skipNextHandler) return;
                        animationEndHandler(watch + 1);
                    }, 400);
                }, 100)
            }
        }, 10);
    }

    for (let i = 0; i < drama.length; i++) {
        this.triggers.push(false)
    }

    this.activate = () => {
        changeText(drama[0]);
        textAnimationEndWatcher(this, 0);
        for (let i = 1; i < drama.length; i++) {
            let interval = setInterval(() => {
                if (this.lock) return;
                if (this.fallthrough) this.triggers[i] = true;
                if (!this.triggers[i]) return;
                this.skipNextHandler = false;
                this.fallthrough = false;
                clearInterval(interval);
                activateOptionBefore(i)();
                changeText(drama[i]);
                textAnimationEndWatcher(this, i);
            }, 10)
        }
    }
}

function addRemovableEventListener(scope, type, listener) {
    scope.addEventListener(type, listener);
    return () => {
        scope.removeEventListener(type, listener)
    }
}

function setCookie(name, value) {
    document.cookie = `${name}=${value}`;
}

function getCookie(name) {
    let arr = document.cookie.split('; '),
        regExp = eval(`/^${name}=/`),
        ret = '';

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].match(regExp) === null) continue;
        ret = arr[i].split('=')[1];
        break;
    }
    return ret;
}

function delCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = `${name}=''; expires=${exp.toGMTString()}`;
}

function stopBackGroundMusic(audio) {
    let count = 100;
    let interval = setInterval(() => {
        count--;
        if (count <= 10) {
            count = 0;
            audio.pause();
            clearInterval(interval);
        }
        audio.volume = count / 100;
    }, 20);
}

function changeBackGroundMusic(audio, src) {
    let count = 0;
    audio.src = src;
    audio.play();
    audio.volume = 0;
    let interval = setInterval(() => {
        count++;
        if (count >= 90) {
            audio.volume = 1;
            clearInterval(interval);
        }
        audio.volume = count / 100;
    }, 50);
}
