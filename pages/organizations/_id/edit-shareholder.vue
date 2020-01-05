<template>
  <section ref="wrapperRole">
    <div class="form-section">
      <div class="head-title">
        <h4>{{$t('organization.edit-shareholder')}}</h4>
      </div>
      <div class="form-group">
        <v-text-field
          single-line
          :label="$t('shareholder.sharevalue')"
          placeholder="fdgdsf"
          name="ShaveValue"
          v-model="organizationShareholder.ShareValue"
          :data-vv-as="this.$t('shareholder.sharevalue')"
          :error-messages="errors.collect('shareholder.sharevalue')"
        ></v-text-field>
        <span>{{ errors.first('ShaveValue') }}</span>
      </div>
      <div>
        <v-btn class="v-btn" @click="save">ذخیره</v-btn>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import searchUsername from '~/components/users/search-username.vue'
import { IExpertise } from '~/models/IExpertise'
import { IUserRoles } from '~/models/UserRole'
import { IOrganizationShareholder } from '~/models/IOrganizationShareholder'
export default Vue.extend({
    beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/EditShareholderMember'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: { searchUsername },
  props: {
    organizationShareholder: {
      required: true,
      type: Object as ()=> IOrganizationShareholder
    }
  },
  data() {
    return {
    }
  },
  async mounted() {
  },
  methods: {
    async save() {
        
      let loader = this.$loader.show(this.$refs.wrapperRole)
      try {
        let organizationShareholder = await this.$service.organization.editShareholder(this.organizationShareholder)

        loader.hide()        
          this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success-save').toString(),
                top: true})

        this.$emit('hide', 'success')
      } catch (error) {
        loader.hide()        
        this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
      }
    }
  }
})
</script>