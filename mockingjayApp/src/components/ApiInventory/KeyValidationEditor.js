module.exports = {
  name: 'KeyValidationEditor',
  opts: {
    props: ['keyDesc', 'baseId'],
    computed: {
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
    template:
      `<div class="div-key">
        <label :for="id_ipt_key">Key: </label>
        <input :id="id_ipt_key" v-model="keyDesc.key" />
        <input :id="id_ipt_required" type="checkbox" v-model="keyDesc.required" />
        <label :for="id_ipt_required">Required</label><br/>
        <h4>Validator</h4>
        <div>
          <input :id="id_validator_type" v-model="keyDesc.validator.type" /><br/>
          <textarea :id="id_validator_val" :value="keyDesc.validator.value" />
        </div>
      </div>`
  }
}
