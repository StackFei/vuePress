module.exports = {
    '@vuepress/pwa': {
        serviceWorker: true,
        popupComponent: 'MySWUpdatePopup',
        updatePopup: {
            message: "一大波新内容向你袭来.",
            buttonText: "⌛",
            // 自定义弹窗
        }
    },
    '@vuepress/back-to-top': true,
    '@vuepress/medium-zoom': {
        selector: '.content__default:not(.custom) img ',
        options: {
            margin: 16
        }
    },
    '@vuepress/google-analytics': {
        'ga': 'UA-153661144-1'
    }
};