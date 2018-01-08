module.exports = {
  name: 'BodyValidationEditor',
  opts: {
    props: ['bodyDesc', 'baseId'],
    data: function () {
      return {
        body: {}
      }
    },
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
    beforeCreate: function () {},
    created: function () {
      if (this.bodyDesc !== undefined && this.bodyDesc !== null) {
        this.body = this.bodyDesc
        if (this.body.validator === undefined || this.body.validator === undefined) {
          this.body.validator = {
            type: 'exact',
            value: ''
          }
        }
        console.log(this.body)
      }
    },
    beforeMount: function () {},
    mounted: function () { console.log('mounted'); console.log(this.body) },
    beforeUpdate: function () { console.log('beforeUpdate'); console.log(this.body) },
    updated: function () { console.log('updated'); console.log(this.body) },
    beforeDestroy: function () { console.log('beforeDestroy'); console.log(this.body) },
    destroyed: function () { console.log('destroyed'); console.log(this.body) },
    template:
        `<div v-if="body !== undefined && body !== null" class="div-key">
          <label :for="id_body_optional">Required</label>
          <input :id="id_body_optional" type="checkbox" v-model="body.required" />
          <h4>Validator</h4>
          <div>
            <input :id="id_body_type" v-model="body.validator.type" /><br/>
            <textarea :id="id_body_val" v-model="body.validator.value" />
          </div>
        </div>`
  }
}
