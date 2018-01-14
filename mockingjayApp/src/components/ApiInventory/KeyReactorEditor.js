export default {
  name: 'KeyReactorEditor',
  opts: {
    props: ['value'],
    mounted: function () {
    },
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
      `<div class="div-key">
        <label>Key: </label>
        <input path="key" :value="value.key" v-on:input="updateValue($event.target)"/>
        <input path="optional" type="checkbox" :value="value.optional" v-on:input="updateValue($event.target)"/>
        <label>Optional</label><br/>
        <h4>Reactor</h4>
        <div v-if="value.reactor !== undefined && value.reactor !== null">
          <input path="reactor.type" :value="value.reactor.type" v-on:input="updateValue($event.target)"/><br/>
          <textarea path="reactor.value" :value="value.reactor.value" v-on:input="updateValue($event.target)"/>
        </div>
      </div>`
  }
}
