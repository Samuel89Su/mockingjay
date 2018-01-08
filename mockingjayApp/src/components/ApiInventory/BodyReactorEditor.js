module.exports = {
  name: 'BodyReactorEditor',
  opts: {
    props: ['bodyDesc', 'baseId'],
    computed: {
      id_body_optional: function () {
        return 'ipt_' + this.baseId + '_body_optional'
      },
      id_body_type: function () {
        return 'ipt_' + this.baseId + '_body_reactor_type'
      },
      id_body_val: function () {
        return 'ipt_' + this.baseId + '_body_reactor_value'
      }
    },
    template:
      `<div v-if="bodyDesc !== undefined && bodyDesc !== null" class="div-key">
        <label :for="id_body_optional">Optional</label>
        <input :id="id_body_optional" type="checkbox" v-model="bodyDesc.optional" />
        <h4>Validator</h4>
        <div>
          <input :id="id_body_type" v-model="bodyDesc.reactor.type" /><br/>
          <textarea :id="id_body_val" v-model="bodyDesc.reactor.value" />
        </div>
      </div>`
  }
}
  