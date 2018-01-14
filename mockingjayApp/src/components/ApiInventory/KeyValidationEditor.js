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
    props: ['keyPostfix', 'id'],
    computed: {
      id_ipt_key: function () {
        return this.id + '_key'
      },
      id_ipt_required: function () {
        return this.id + '_required'
      },
      id_validator_type: function () {
        return this.id + '_validator_type'
      },
      id_validator_val: function () {
        return this.id + '_validator_value'
      }
    },
    mounted: function () {
      let config = this.$store.state.ApiConfig

      let index = $(this.$el).index()
      let paths = this.id.replace('_' + this.keyPostfix, '').split('_')
      let keyData = config
      for (let i = 0; i < paths.length; i++) {
        let dummy = keyData[paths[i]]
        if (dummy) {
          keyData = dummy
        } else {
          break
        }
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
          <textarea :id="id_validator_val" v-model="keyDesc.validator.value" />
        </div>
      </li>`
  }
}
