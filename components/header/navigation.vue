<style lang="scss" >
#navigation {
  display: flex;
  flex-direction: row;
  .icon-wrapper {
    display: none;
    @include respond-to(md) {
      display: block;
    }
  }
  @include respond-to(md) {
    flex-direction: column;
  }
  .v-list {
    display: flex;
    flex-direction: row;
    @include respond-to(md) {
      flex-direction: column;
    }

    padding: 0;
  }

  .v-list-item--active {
    border-bottom: 4px solid $primary-color;
    @include respond-to(md) {
      border-bottom: 0;
    }
    background-color: transparent;
  }

  .theme--light.v-list-item--active:hover::before,
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }

  .v-list-item__action {
    min-width: 30px;
  }
}
</style>
<template>
  <div id="navigation">
    <v-list>
      <template v-for="(item, index) in navItems">
        <v-list-item
          :to="item.to"
          router
          exact
          :prepend-icon="item.icon"
          v-if="!item.subItems"
          :key="index"
        >
          <v-list-item-action class="icon-wrapper">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>

        <v-list-group v-else :prepend-icon="item.icon" :key="index" value="true">
          <template v-slot:activator="{ on }">
            <v-list-item>
              <v-list-item-title>test</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(subItem, subIndex) in item.subItems"
            :to="subItem.to"
            :key="subIndex"
            router
            exact
            :prepend-icon="item.icon"
          >
            <v-list-item-action>
              <v-tooltip v-if="miniVariant" open-delay="0" transition="animated fadeIn" left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">{{ subItem.icon }}</v-icon>
                </template>
                {{subItem.title}}
              </v-tooltip>
              <v-icon v-else>{{ subItem.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VListGroup } from 'vuetify/lib'
import { VListItem } from 'vuetify/lib'
import { INav } from '~/models/INav'

export default Vue.extend({
  props: {
    miniVariant: {}
  },
  mounted() {
    ;(<any>this).loadItems()
  },
  created() {},
  computed: {
    navItems() {
      let list = (<any>this).$store.state.navigation.navItems
      return list
    }
  },
  methods: {
    loadItems() {
      ;(<any>this).$store.dispatch('navigation/set_navItems')
    }
  }
})
</script>
