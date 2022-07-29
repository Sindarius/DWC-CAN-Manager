'use strict'

import Vue from 'vue'
import { registerRoute } from '../../routes'
import CanList from './CanList.vue'

Vue.component('can-list', CanList)

registerRoute(CanList, {
    Plugins: {
        CanList: {
            icon: 'mdi-chart-bell-curve-cumulative',
            caption: 'CAN Manager',
            path: '/Plugins/CanList'
        }
    }
})
