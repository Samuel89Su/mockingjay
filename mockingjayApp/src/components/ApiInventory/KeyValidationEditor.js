module.exports = {
  name: 'KeyValidationEditor',
  opts: {
    props: ['keyDesc'],
    computed: {
      id_ipt_key: function () {
        return 'ipt_' + this.keyDesc.key
      },
      id_ipt_required: function () {
        return 'ipt_' + this.keyDesc.key + '_required'
      },
      id_txtArea_validator: function () {
        return 'ipt_' + this.keyDesc.key + '_validator'
      }
    },
    template:
      `<div>
        <label :for="id_ipt_key">Key: </label>
        <input :id="id_ipt_key" v-model="keyDesc.key" />
        <input :id="id_ipt_required" type="checkbox" v-model="keyDesc.required" />
        <label :for="id_ipt_required">Required</label><br/>
        <h4>Validator</h4>
        <div>
          <input v-model="keyDesc.validator.type" /><br/>
          <textarea :id="id_txtArea_validator" :value="keyDesc.validator.value" />
        </div>
      </div>`
  }
}
