module.exports = {
    '@vuepress/pwa': {
        serviceWorker: true,
        popupComponent: 'MySWUpdatePopup',
        updatePopup: {
            message: "一大波新内容想你袭来.",
            buttonText: "🔨",
            // 自定义弹窗
        }
    },
    '@vuepress/back-to-top': true,
    '@vuepress/medium-zoom': {
        selector: '.theme-default-content:not(.custom) img',
        options: {
            margin: 16
        }
    },
    '@vuepress/google-analytics': {
        'ga': 'UA-153661144-1'
    }
};