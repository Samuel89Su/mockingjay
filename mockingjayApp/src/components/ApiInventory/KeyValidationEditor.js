export default {
  name: 'KeyValidationEditor',
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
    template:
      `<li class="div-key">
        <label>Key: </label>
        <input path="key" v-model="value.key" />
        <input path="required" type="checkbox" v-model="value.required" />
        <label >Required</label><br/>
        <h4>Validator</h4>
        <div v-if="value.validator !== undefined && value.validator !== null">
          <input path="validator.type" v-model="value.validator.type" /><br/>
          <textarea path="validator.val" v-model="value.validator.value" />
        </div>
      </li>`
  }
}
