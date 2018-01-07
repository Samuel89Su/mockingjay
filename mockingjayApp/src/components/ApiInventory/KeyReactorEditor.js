module.exports = {
  name: 'KeyReactorEditor',
  opts: {
    props: ['keyDesc', 'baseId'],
    computed: {
      id_ipt_key: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_key'
      },
      id_ipt_optional: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_optional'
      },
      id_reactor_type: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_reactor_type'
      },
      id_reactor_val: function () {
        return 'ipt_' + this.baseId + '_' + this.keyDesc.key + '_reactor_value'
      }
    },
    template:
      `<div class="div-key">
        <label :for="id_ipt_key">Key: </label>
        <input :id="id_ipt_key" v-model="keyDesc.key" />
        <input :id="id_ipt_optional" type="checkbox" v-model="keyDesc.optional" />
        <label :for="id_ipt_optional">Optional</label><br/>
        <h4>Reactor</h4>
        <div>
          <input :id="id_reactor_type" v-model="keyDesc.reactor.type" /><br/>
          <textarea :id="id_reactor_val" v-model="keyDesc.reactor.value" />
        </div>
      </div>`
  }
}
