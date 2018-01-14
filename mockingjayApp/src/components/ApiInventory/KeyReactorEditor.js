const $ = require('jquery')

module.exports = {
  name: 'KeyReactorEditor',
  opts: {
    data: function () {
      return {
        keyDesc: {
          key: 'key',
          optional: true,
          reactor: null
        }
      }
    },
    props: ['keyPostfix', 'id'],
    computed: {
      id_ipt_key: function () {
        return this.id + '_key'
      },
      id_ipt_optional: function () {
        return this.id + '_optional'
      },
      id_reactor_type: function () {
        return this.id + '_reactor_type'
      },
      id_reactor_val: function () {
        return this.id + '_reactor_value'
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
      `<div class="div-key">
        <label :for="id_ipt_key">Key: </label>
        <input :id="id_ipt_key" v-model="keyDesc.key" />
        <input :id="id_ipt_optional" type="checkbox" v-model="keyDesc.optional" />
        <label :for="id_ipt_optional">Optional</label><br/>
        <h4>Reactor</h4>
        <div v-if="keyDesc.reactor !== undefined && keyDesc.reactor !== null">
          <input :id="id_reactor_type" v-model="keyDesc.reactor.type" /><br/>
          <textarea :id="id_reactor_val" v-model="keyDesc.reactor.value" />
        </div>
      </div>`
  }
}
