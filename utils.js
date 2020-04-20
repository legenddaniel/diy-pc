// e.deltaY ios
// find() includes() ie
// scrollBy options ie edge79-
// scrollBy ie 11-
// classList remove add ie10-
// setProperty ie9-
// hover: none pointer: coarse ios9-

export const carousel = document.getElementsByClassName('carousel')[0];
export const btnGet1 = document.querySelector('#national .btn-txt');
export const btnGet2 = document.querySelector('#provincial .btn-txt');
export const btnArrow = document.getElementById('arrows');
export const date = document.getElementsByClassName('date');

const config = {
    'Alberta': {
        cellRotateDeg: [0],
        jsonIndex: 9
    },
    'British Colombia': {
        cellRotateDeg: [36, -324],
        jsonIndex: 10
    }
}

const provinceConfig = [{
    name: 'Alberta',
    cellRotateDeg: [0],
    jsonIndex: 9
}, {
    name: 'British Columbia',
    cellRotateDeg: [36, -324],
    jsonIndex: 10
}, {
    name: 'Manitoba',
    cellRotateDeg: [72, -288],
    jsonIndex: 12
}, {
    name: 'New Brunswick',
    cellRotateDeg: [108, -252],
    jsonIndex: 13
}, {
    name: 'NewFoundland And Labrador',
    cellRotateDeg: [144, -216],
    jsonIndex: 14
}, {
    name: 'Nova Scotia',
    cellRotateDeg: [180, -180],
    jsonIndex: 15
}, {
    name: 'Ontario',
    cellRotateDeg: [216, -144],
    jsonIndex: 16
}, {
    name: 'Prince Edward Island',
    cellRotateDeg: [252, -108],
    jsonIndex: 17
}, {
    name: 'Quebec',
    cellRotateDeg: [288, -72],
    jsonIndex: 18
}, {
    name: 'Saskatchewan',
    cellRotateDeg: [324, -36],
    jsonIndex: 19
}];

const scrollBehavior = 'scrollBehavior' in document.documentElement.style;

const debounce = (fn, delay, immediate) => {
    let timer;
    return function () {
        const that = this;
        const args = arguments;

        clearTimeout(timer);

        if (immediate && !timer) fn.apply(that, args);

        timer = setTimeout(() => {
            timer = null;
            fn.apply(that, args);
        }, delay);
    };
};

const isSafari = () => {
    const ua = navigator.userAgent;
    const safari = (/Mac|iPhone|iPad/).test(ua);
    return safari;
}

const getValidDate = i => {
    const date = document.getElementsByClassName('date')[i].value;
    const year = date.match(/^\d{4}-/);
    const monthNDay = date.match(/\d{2}-\d{2}$/);
    const validDate =
        monthNDay >= '10-01' ? '10-01' :
            monthNDay >= '07-01' ? '07-01' :
                monthNDay >= '04-01' ? '04-01' :
                    '01-01';
    return year + validDate;
};

const getRotateDeg = () => {
    const rotate = carousel.style.transform || '0';
    const deg = +rotate.match(/-*\d+/)[0];
    return deg;
};

export const setSectionHeight = debounce(() => {
    const match = mq => matchMedia(mq).matches;
    const chrome = (/Chrome.*Mobile/).test(navigator.userAgent);
    const mobile = match("(hover: none)") || match("(pointer: coarse)") || chrome;
    if (mobile) {
        const vh = window.innerHeight / 100;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    } else {
        document.documentElement.removeAttribute('style');
    }
}, 66);

export const goTop = () => {
    window.scrollTo(0, 0);
    console.log('gotop');
    const toggleArrow = (arrows, method) => {
        const arrow = document.getElementsByClassName(arrows)[0].classList;
        if (method === 'hide') {
            arrow.add('d-none');
            console.log('hide ' + arrows);
        }
        if (method === 'show') {
            arrow.remove('d-none');
            console.log('show ' + arrows);
        }
    };
    toggleArrow('arrow-top', 'hide');
    toggleArrow('arrow-bot', 'show');
    // document.getElementsByClassName('arrow-top')[0].classList.add('d-none');
    // document.getElementsByClassName('arrow-bot')[0].classList.remove('d-none');
};

export const scrollCell = e => {
    const dY = e.deltaY;
    const deg = getRotateDeg();
    const newDeg = dY < 0 ? deg - 36 : deg + 36;

    carousel.style.transform = `rotateX(${newDeg}deg)`;

    // e.preventDefault();
    // e.stopPropagation();
};

export const scrollCellMobile = (() => {
    let touchStart;
    const setTouchStart = e => {
        touchStart = e.changedTouches[0];
    };
    const getTouchEnd = e => {
        const deg = getRotateDeg();
        const touchEnd = e.changedTouches[0];
        const newDeg = touchEnd.pageY > touchStart.pageY ? deg - 36 : deg + 36;

        carousel.style.transform = `rotateX(${newDeg}deg)`;
        // e.stopPropagation();
    };
    return { setTouchStart, getTouchEnd };
})();

export const getProvince = () => {
    const deg = getRotateDeg() % 360;
    const province = (() => {
        for (let province of provinceConfig) {
            if (province.cellRotateDeg.includes(deg)) {
                return province.name;
            }
        }
    })();
    // let province;
    // switch (deg % 360) {
    //     case 36:
    //     case -324:
    //         province = "British Columbia";
    //         break;
    //     case 72:
    //     case -288:
    //         province = "Manitoba";
    //         break;
    //     case 108:
    //     case -252:
    //         province = "New Brunswick";
    //         break;
    //     case 144:
    //     case -216:
    //         province = "Newfoundland And Labrador";
    //         break;
    //     case 180:
    //     case -180:
    //         province = "Nova Scotia";
    //         break;
    //     case 216:
    //     case -144:
    //         province = "Ontario";
    //         break;
    //     case 252:
    //     case -108:
    //         province = "Prince Edward Island";
    //         break;
    //     case 288:
    //     case -72:
    //         province = "Quebec";
    //         break;
    //     case 324:
    //     case -36:
    //         province = "Saskatchewan";
    //         break;
    //     default:
    //         province = "Alberta";
    //         break;
    // }
    return province;
};

const ajaxConfig = {
    method: 'GET',
    url: 'data.json',
    async: true,
    callback: ''
};

const ajax = option => {
    const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open(option.method, option.url, option.async);
    xhr.send();
    xhr.onload = callback;
};

export const showResult1 = () => {
    const date = getValidDate(0);
    const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", 'data.json', true);
    xhr.send();
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText).data;
        const population = data.find(i => i[8].includes(date)) || '';
        const result = population[11] || 'Select a date';
        btnGet1.textContent = result;
    };
};

export const showResult2 = () => {
    const date = getValidDate(1);
    const province = getProvince();
    const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", 'data.json', true);
    xhr.send();
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText).data;
        const population = data.find(i => i[8].includes(date)) || '';
        const provinceData = {
            'Alberta': 9,
            'British Columbia': 10,
            'Manitoba': 12,
            'New Brunswick': 13,
            'Newfoundland And Labrador': 14,
            'Nova Scotia': 15,
            'Ontario': 16,
            'Prince Edward Island': 17,
            'Quebec': 18,
            'Saskatchewan': 19,
        };
        const getResult = () => {
            const index = provinceData[province];
            const populationData = population[index] || 'Select a date';
            return populationData;
        };
        const result = getResult();
        btnGet2.textContent = result;
    };
};

export const scrollPage = e => {
    const direction = e.target === btnArrow.firstElementChild ? '-' : '+';
    const innerHeight = window.innerHeight;
    const ua = navigator.userAgent;
    const isMFirefox = (/Android/).test(ua) && (/Firefox/).test(ua);
    if (scrollBehavior && !isMFirefox) {
        window.scrollBy({
            top: +`${direction}${innerHeight}`,
            behavior: 'smooth'
        });
    } else {
        window.scrollBy(0, +`${direction}${innerHeight}`);
    };
    e.currentTarget.removeEventListener('click', scrollPage);
};

export const scrollEnd = debounce(() => {
    position.updatePageNum();
    btnArrow.addEventListener('click', scrollPage);
    console.log('scrollend');
}, 66);

export const touchmoveMobile = debounce(scrollCellMobile.getTouchEnd, 66);

export const position = (() => {
    let pageNum = 0;
    const updatePageNum = () => {
        pageNum = Math.round(window.pageYOffset / window.innerHeight);
        console.log('pageNum=' + pageNum + 'window.scrollY=' + window.scrollY);
    };
    const restorePage = () => {
        const scrollY = pageNum * window.innerHeight;
        console.log(window.scrollY + '!=' + scrollY + '=' + pageNum + '*' + window.innerHeight);
        window.scrollTo(0, scrollY);
    };
    const toggleArrow = e => {
        const toggle = arrowAct => {
            const topOrBot = document.getElementsByClassName(arrowAct)[0].classList;
            const showArrow = () => {
                topOrBot.remove('d-none');
            };
            const hideArrow = () => {
                topOrBot.add('d-none');
            };
            return { showArrow, hideArrow };
        };

        const toggleTop = toggle('arrow-top');
        const toggleBot = toggle('arrow-bot');

        const target = arrowPas => document.getElementsByClassName(arrowPas)[0];
        const pageArrowMap = [
            { 'arrow-bot': toggleTop.showArrow }, // showtop: page0, click bot
            { 'arrow-top': toggleTop.hideArrow }, // hidetop: page1, click top
            { 'arrow-bot': toggleBot.hideArrow }, // hidebot: page2, click bot
            { 'arrow-top': toggleBot.showArrow }  // showbot: page3, click top
        ];
        const arrow = pageArrowMap[pageNum];

        pageNum in pageArrowMap && e.target === target(Object.keys(arrow)[0]) && Object.values(arrow)[0]();
    };
    return { updatePageNum, restorePage, toggleArrow };
})();

export const restorePage = debounce(position.restorePage, 66);

const changeImg = () => {
    const provinceImgMap = {
        'Alberta': 'img-ab',
        'British Columbia': 'img-bc',
        'Manitoba': 'img-mn',
        'New Brunswick': 'img-nb',
        'Newfoundland And Labrador': 'img-nl',
        'Nova Scotia': 'img-ns',
        'Ontario': 'img-on',
        'Prince Edward Island': 'img-pe',
        'Quebec': 'img-qc',
        'Saskatchewan': 'img-sk',
    };
    const province = getProvince();
    const img = provinceImgMap[province];
    const aside = document.getElementById('province-img');

    aside.className = img;
};

export const msCellDisplayBugFix = (setOverflowX = true) => {
    const ms = (/Edge/).test(navigator.userAgent);
    if (ms && setOverflowX) {
        document.body.style.overflowX = 'visible';
        return;
    }
    document.body.removeAttribute('style');
};

export const wheelEnd = debounce(() => {
    changeImg();
    msCellDisplayBugFix(false);
}, 500);

export const preloadImg = (...urls) => {
    const toolDiv = document.createElement('div');
    toolDiv.className = 'd-none';
    toolDiv.setAttribute('title', '<div> for img preload as rel=preload && data-* not working well');

    urls.forEach(url => {
        const img = new Image();
        img.src = url;
        toolDiv.appendChild(img);
    })

    document.body.appendChild(toolDiv);
    console.log('img preloaded');
};

export const safariRestorePage = () => {
    if (isSafari()) restorePage();
};

export const preventDefault = e => {
    e.preventDefault();
};

