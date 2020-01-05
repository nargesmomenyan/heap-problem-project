<style lang="scss" scoped>
.btn-add {
  color: #717897;
}
</style>
<template>
  <div ref="wrapperSearch" class="form-group">
    <v-text-field
      filled
      type="text"
      :label="$t('individualUser.role.treatingPhysicianInfo.search-name-medicalNumber')"
      v-bind="$attrs"
      v-model="name_medicalSystemCode"
      single-line
      outlined
      append-icon="search"
      @click:append="search"
    ></v-text-field>
    <v-btn depressed text :ripple="false" icon v-if="withAdd" class="btn-add" tabindex="-1">
      <v-icon @click="add">add_circle_outline</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import newTreatingPhysician from '~/components/treatingPhysician/new-treatingPhysician.vue'
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'

export default Vue.extend({
  props: {
    withAdd: { type: Boolean, default: true }
  },
  data() {
    return {
      name_medicalSystemCode: '',
      treatingPhysician: <ITreatingPhysician>{}
    }
  },
  mounted() {},
  methods: {
    async search() {
      if (!this.name_medicalSystemCode) return

      let loader = this.$loader.show(this.$refs.wrapperSearch)
      this.$service.treatingPhysician
        .search(this.name_medicalSystemCode)
        .then(res => {
          this.treatingPhysician = res[0]
          this.$emit('selectedItem', this.treatingPhysician)
        })
        .catch(error => {
          this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
        })
      loader.hide()
    },
    add() {
      this.$dialog
        .show({
          title: '',
          component: newTreatingPhysician
        })
        .then(data => {
          if (data && <ITreatingPhysician>data) {
            this.treatingPhysician = <ITreatingPhysician>data
            this.$emit('selectedItem', this.treatingPhysician)
          }
        })
    },
  }
})
</script>


