<template>
  <div class="form-group">

    <v-autocomplete
      cache-items
      :items="items"
      v-model="model"
      v-bind="Object.assign($attrs,field)"
      :search-input.sync="search"
      :loading="loading"
      :error-messages="errorMessages"
    >
      <template v-slot:selection="data">
        <v-chip
          v-if="field.chips"
          close
          :selected="data.selected"
          class="chip--select-multi"
          @input="remove(data.item)"
        >{{ data.item.text }}</v-chip>
        <span v-else>{{ data.item.text }}</span>
      </template>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title v-html="data.item.text"></v-list-item-title>
        </v-list-item-content>
      </template>
      <template v-slot:no-data>
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
</template>
<script lang="ts">
import Vue from 'vue'
import mixins from './mixins'
export default Vue.extend({
  mixins: [mixins],
  data() {
    return {
      loading: false,
      search: null,
      items: (<any>this).field.async ? [] : (<any>this).field.items
    }
  },
  watch: {
    search(val, old) {
      (<any>this).isLoading = true
      if ((<any>this).field.async) {
        this.get_lists(val)
      }
    }
  },
  mounted() {
    if ((<any>this).field.async) {
      this.get_lists('')
    }
  },

  methods: {
    get_lists(val) {
      (<any>this).field.queryService(val).then(items => {
        this.items = items
        this.loading = false
      })
    },
    remove(item) {
      const index = (<any>this).model.findIndex(model => item.value == model.value)
      if (index >= 0) (<any>this).model.splice(index, 1)
    }
  }
})
</script>
