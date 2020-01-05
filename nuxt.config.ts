
import colors from 'vuetify/es5/util/colors';
import 'vee-validate'
import 'vrwebdesign-nuxt/modules/nuxt-axios'
import 'vrwebdesign-nuxt/modules/nuxt-enums'
import 'vrwebdesign-nuxt/modules/nuxt-authorization'
import 'vrwebdesign-nuxt/modules/nuxt-dialog'
import 'vrwebdesign-nuxt/modules/nuxt-toast'
import 'vrwebdesign-nuxt/modules/nuxt-loader'
import 'vrwebdesign-nuxt/modules/nuxt-scroll-to'
import './services/types/index'

export default {
  mode: 'spa',
  server: {
    //  port: process.env.PORT || 9000 // default: 3000
    //host: '0.0.0.0' // default: localhost
  },
  axios: {
    proxy: false, 
    baseURL: ''
  },
  head: {
    title: process.env.TITLE || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          process.env.DESCRIPTION ||
          'برای کار با سامانه جامع اطلاعات آزمایشگاهی مبین لطفا وارد شوید'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.ico' },
    ]
  },
  loading: { color: '#fff' },

  styleResources: {
    scss: ['@/assets/sass/variables.scss']
  },
  css: [
    'animate.css/animate.css',
    // '@/assets/sass/main.scss',
  ],
  // this vuetify setting as well as vuetify plugin are necessary to load material-desing-icons offline
  vuetify: {
    defaultAssets: false,
    rtl: true,
  },
  plugins: [
    '~/plugins/i18n.ts',
    '~/plugins/vuetify.ts',
    '~/plugins/error-handler',
    '~/plugins/meta',
    '~/plugins/token-handler',
    '~/plugins/filepond.ts',
    '~/plugins/eslintrc.js',
    '~/plugins/beautiful-chat.ts',
    '~/plugins/swiper.ts',
    
    // '~/plugins/leaflet'
  ],
  router: {
    middleware: ['i18n']
  },
  modules: [
    '@nuxtjs/style-resources',
    'vrwebdesign-nuxt/modules/nuxt-scroll-bar',
    'vrwebdesign-nuxt/modules/nuxt-client-init',
    'vrwebdesign-nuxt/modules/nuxt-axios',
    'vrwebdesign-nuxt/modules/nuxt-validate',
    'vrwebdesign-nuxt/modules/nuxt-toast',
    'vrwebdesign-nuxt/modules/nuxt-dialog',
    'vrwebdesign-nuxt/modules/nuxt-global',
    'vrwebdesign-nuxt/modules/nuxt-data-grid',
    'vrwebdesign-nuxt/modules/nuxt-form-generator',
    'vrwebdesign-nuxt/modules/nuxt-loader',
    'vrwebdesign-nuxt/modules/nuxt-date-picker',
    'vrwebdesign-nuxt/modules/nuxt-file-upload',
    'vrwebdesign-nuxt/modules/nuxt-scroll-to',
    'vrwebdesign-nuxt/modules/nuxt-currency',
    'vrwebdesign-nuxt/modules/nuxt-enums',
    'vrwebdesign-nuxt/modules/nuxt-navbar',
    'vrwebdesign-nuxt/modules/nuxt-badge',
    'vrwebdesign-nuxt/modules/nuxt-authorization',
    'vrwebdesign-nuxt/modules/nuxt-chart',
    '~/modules/nuxt-device-detect',
    '~/modules/mobayyen-form-answer-generator',

  ],
  watch: ['services', 'enums'],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  },
  buildModules: ['@nuxtjs/vuetify', '@nuxt/typescript-build'],
  build: {
    typescript: {
      typeCheck: {
        memoryLimit: 4096
      }
    },
    watch: ['services', 'enums'],
    transpile: ['lodash-es'],
    standalone: true,
    loaders: {
      vue: {
        prettify: true
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      const svgRule = config.module.rules.find(rule =>
        rule.test.test('.svg')
      );

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.node = {
        fs: 'empty'
      }

      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[hash:8].[ext]'
            }
          },
          {
            loader: 'vue-svg-loader',
            options: {
              // Optional svgo options
              svgo: {
                plugins: [{ removeViewBox: false }]
              }
            }
          }
        ]
      });

    }
  },
}
