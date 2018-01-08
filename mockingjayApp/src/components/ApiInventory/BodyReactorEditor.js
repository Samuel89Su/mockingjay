module.exports = {
  name: 'BodyReactorEditor',
  opts: {
    props: ['keyPostfix', 'id'],
    data: function () {
      return {
        body: {
          optional: true,
          reactor: null
        }
      }
    },
    computed: {
      id_body_optional: function () {
        return 'ipt_' + this.id
      },
      id_body_type: function () {
        return 'ipt_' + this.id + '_reactor_type'
      },
      id_body_val: function () {
        return 'ipt_' + this.id + '_reactor_value'
      }
    },
    mounted: function () {
      let details = this.$store.state.apiDetails
      let paths = this.id.replace('_' + this.keyPostfix, '').split('_')
      let keyData = details
      for (let i = 0; i < paths.length; i++) {
        let dummy = keyData[paths[i]]
        if (dummy) {
          keyData = dummy
        } else {
          break
        }
      }

      this.$data.body = keyData
    },
    template:
      `<div v-if="body !== undefined && body !== null" class="div-key">
        <label :for="id_body_optional">Optional</label>
        <input :id="id_body_optional" type="checkbox" v-model="body.optional" />
        <h4>Validator</h4>
        <div v-if="body.reactor !== undefined && body.reactor !== null">
          <input :id="id_body_type" v-model="body.reactor.type" /><br/>
          <textarea :id="id_body_val" v-model="body.reactor.value" />
        </div>
      </div>`
  }
}
  