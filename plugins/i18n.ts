import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

export default ({ app, store }) => {
    app.i18n = new VueI18n({
        locale: 'store.store.locale',
        fallbackLocale: 'fa',
        silentTranslationWarn: true,
        dateTimeFormats,
        messages: {
            'en': require('~/locales/en.json'),
            'fa': require('~/locales/fa.json')
        }
    })

    app.i18n.path = (link) => {
        if (app.i18n.locale === app.i18n.fallbackLocale) {
            return `/${link}`;
        }

        return `/${app.i18n.locale}/${link}`;
    }
}

const dateTimeFormats = {
    'en-US': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            year: 'numeric', month: 'short', day: 'numeric',
            weekday: 'short', hour: 'numeric', minute: 'numeric'
        }
    },
    'fa-IR': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            year: 'numeric', month: 'short', day: 'numeric',
            weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
        }
    }
}
