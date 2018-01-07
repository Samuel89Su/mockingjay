module.exports = {
  name: 'KeyReactorEditor',
  opts: {
    props: ['keyDesc'],
    computed: {
      id_ipt_key: function () {
        return 'ipt_res_headerKey_' + this.keyDesc.key
      },
      id_ipt_optional: function () {
        return 'ipt_res_headerKey_optional_' + this.keyDesc.key
      },
      id_txtArea_reactor: function () {
        return 'ipt_res_headerKey_vali_' + this.keyDesc.key
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
          <input v-model="keyDesc.reactor.type" /><br/>
          <textarea :id="id_txtArea_reactor" :value="keyDesc.reactor.value" />
        </div>
      </div>`
  }
}
