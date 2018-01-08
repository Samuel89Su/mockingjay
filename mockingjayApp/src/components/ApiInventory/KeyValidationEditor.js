const $ = require('jquery')

module.exports = {
  name: 'KeyValidationEditor',
  opts: {
    data: function () {
      return {
        keyDesc: {
          key: 'key',
          required: false,
          validator: null
        }
      }
    },
    props: ['baseId'],
    computed: {
      // gg: function () {
      //   let details = this.$store.state.apiDetails

      //   return details
      // },
      id_ipt_key: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_key'
      },
      id_ipt_required: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_required'
      },
      id_validator_type: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_reactor_type'
      },
      id_validator_val: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_reactor_value'
      }
    },
    mounted: function () {
      let details = this.$store.state.apiDetails

      let index = $(this.$el).index()
      let paths = this.baseId.split('_')
      let keyData = details
      for (let i = 0; i < paths.length; i++) {
        keyData = keyData[paths[i]]
      }
      keyData = keyData[index]

      this.$data.keyDesc = keyData
    },
    template:
      `<li class="div-key">
        <label :for="id_ipt_key">Key: </label>
        <input :id="id_ipt_key" v-model="keyDesc.key" />
        <input :id="id_ipt_required" type="checkbox" v-model="keyDesc.required" />
        <label :for="id_ipt_required">Required</label><br/>
        <h4>Validator</h4>
        <div v-if="keyDesc.validator !== undefined && keyDesc.validator !== null">
          <input :id="id_validator_type" v-model="keyDesc.validator.type" /><br/>
          <textarea :id="id_validator_val" :value="keyDesc.validator.value" />
        </div>
      </li>`
  }
}
