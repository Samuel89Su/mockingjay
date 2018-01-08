module.exports = {
  name: 'BodyValidationEditor',
  opts: {
    props: ['keyPostfix', 'id'],
    data: function () {
      return {
        body: {
          required: false,
          validator: null
        }
      }
    },
    computed: {
      id_body_optional: function () {
        return 'ipt_' + this.id
      },
      id_body_type: function () {
        return 'ipt_' + this.id + '_validator_type'
      },
      id_body_val: function () {
        return 'ipt_' + this.id + '_validator_value'
      }
    },
    beforeCreate: function () {},
    created: function () {},
    beforeMount: function () {},
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
    beforeUpdate: function () { console.log('beforeUpdate') },
    updated: function () { console.log('updated') },
    beforeDestroy: function () { console.log('beforeDestroy') },
    destroyed: function () { console.log('destroyed') },
    template:
        `<div v-if="body !== undefined && body !== null" class="div-key">
          <label :for="id_body_optional">Required</label>
          <input :id="id_body_optional" type="checkbox" v-model="body.required" />
          <h4>Validator</h4>
          <div v-if="body.validator !== undefined && body.validator !== null">
            <input :id="id_body_type" v-model="body.validator.type" /><br/>
            <textarea :id="id_body_val" v-model="body.validator.value" />
          </div>
        </div>`
  }
}
