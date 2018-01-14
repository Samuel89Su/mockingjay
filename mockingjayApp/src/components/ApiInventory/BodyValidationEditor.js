export default {
  name: 'BodyValidationEditor',
  opts: {
    props: ['value'],
    methods: {
      updateValue: function (target) {
        let paths = target.getAttribute('path').split('.')
        let val = {}
        val = Object.assign(val, this.$props.value)
        let dummy = val
        let lastIndex = paths.length - 1
        for (let i = 0; i < lastIndex; i++) {
          const key = paths[i]
          dummy = dummy[key]
        }
        dummy[paths[lastIndex]] = target.value
        this.$emit('input', val)
      }
    },
    beforeCreate: function () {},
    created: function () {},
    beforeMount: function () {},
    beforeUpdate: function () { console.log('beforeUpdate') },
    updated: function () { console.log('updated') },
    beforeDestroy: function () { console.log('beforeDestroy') },
    destroyed: function () { console.log('destroyed') },
    template:
        `<div v-if="value !== undefined && value !== null" class="div-key">
          <label>Required</label>
          <input path="optional" type="checkbox" v-model="value.required" />
          <h4>Validator</h4>
          <div v-if="value.validator !== undefined && value.validator !== null">
            <input path="body.type" v-model="value.validator.type" /><br/>
            <textarea path="ibody.val" v-model="value.validator.value" />
          </div>
        </div>`
  }
}
