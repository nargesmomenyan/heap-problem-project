<style lang="scss">
.backdrop-search {
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
.wrapper-control {
  background: #fff;
  padding: 0;
  width: 100%;
  border-radius: 4px;
  position: relative;
  display: block;
  overflow: auto;
}
</style>
<template>
  <div>
    <div v-if="showBackdrop" class="backdrop-search" @click="closeBackdrop" />
    <div class="reception-form wrapper-control" :style="{'z-index':zIndex}">
      <v-autocomplete
        :items="show_items"
        :disabled="disabled"
        v-bind="$attrs"
        item-text="text"
        item-value="Id"
        v-model="model"
        :search-input.sync="search"
        :loading="loading"
        outlined
        chips
        single-line
        @change="selectedItem_changed"
        :hide-no-data="!minimumCharactersSatisfied"
        no-data-text
        append-icon="la-search"
        @focus="focusCtrl()"
        hide-details
        autocomplete="off"
      >
        <template v-if="!loading" v-slot:selection="data">
          <slot name="selectedData" :props="data" :item="data.item">
            <div>{{data.item.text}}</div>
          </slot>
        </template>
        <template v-if="!loading" v-slot:item="data">
          <v-list-item-content>
            <slot name="data" :props="data" :item="data.item">
              <div>{{data.item.text}}</div>
            </slot>
          </v-list-item-content>
        </template>
        <template v-if="minimumCharactersSatisfied && !loading" v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                نتیحه ای برای "
                <strong>{{ search }}</strong>" یافت نشد
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-autocomplete>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: [
    'async',
    'items',
    'queryService',
    'disabled'
  ],
  data() {
    return {
      loading: false,
      search: null,
      minimumCharactersSatisfied: false,
      show_items: this.items,
      model: {},
      showBackdrop: false,
      zIndex: 1
    }
  },
  watch: {
    search(val, old) {
      if (this.async) {
        if (val && val.length > 2) {
          this.get_lists(val)
          this.minimumCharactersSatisfied = true
        } else {
          this.minimumCharactersSatisfied = false
        }
      }
    },
    disabled: {
      handler(val) {},
      deep: true
    },
    items: {
      handler(val, old) {
        this.show_items = val
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    clearInfo() {
      this.show_items = []
      this.model = {}
    },
    get_lists(val) {
      this.loading = true
      this.queryService(val).then(items => {
        this.$emit('foundItems', items)
        this.show_items = items
        this.loading = false
      })
    },
    selectedItem_changed($event) {
      let item = this.show_items.find(x => x.Id === $event)
      this.closeBackdrop()
      this.$emit('selectedItem', item)
    },
    focusCtrl() {
      
      this.zIndex = 100
      this.showBackdrop = true
    },
    closeBackdrop() {
      this.zIndex = 1
      this.showBackdrop = false
    }
  }
})
</script>
