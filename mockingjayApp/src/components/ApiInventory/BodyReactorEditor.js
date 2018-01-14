export default {
  name: 'BodyReactorEditor',
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
      `<div v-if="value !== undefined && value !== null" class="div-key">
        <label>Optional</label>
        <input path="optional" type="checkbox" v-model="value.optional" v-on:input="updateValue($event.target)"/>
        <h4>Validator</h4>
        <div v-if="value.reactor !== undefined && value.reactor !== null">
          <input path="reactor.type" v-model="value.reactor.type" v-on:input="updateValue($event.target)"/><br/>
          <textarea path="reactor.value" v-model="value.reactor.value" v-on:input="updateValue($event.target)"/>
        </div>
      </div>`
  }
}
