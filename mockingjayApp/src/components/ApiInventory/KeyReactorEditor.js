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

// const $ = require('jquery')

// module.exports = {
//   name: 'KeyReactorEditor',
//   opts: {
//     data: function () {
//       return {
//         keyDesc: {
//           key: 'key',
//           optional: true,
//           reactor: null
//         }
//       }
//     },
//     props: ['keyPostfix', 'id'],
//     computed: {
//       id_ipt_key: function () {
//         return this.id + '_key'
//       },
//       id_ipt_optional: function () {
//         return this.id + '_optional'
//       },
//       id_reactor_type: function () {
//         return this.id + '_reactor_type'
//       },
//       id_reactor_val: function () {
//         return this.id + '_reactor_value'
//       }
//     },
//     mounted: function () {
//       let config = this.$store.state.ApiConfig

//       let index = $(this.$el).index()
//       let paths = this.id.replace('_' + this.keyPostfix, '').split('_')
//       let keyData = config
//       for (let i = 0; i < paths.length; i++) {
//         let dummy = keyData[paths[i]]
//         if (dummy) {
//           keyData = dummy
//         } else {
//           break
//         }
//       }
//       keyData = keyData[index]

//       this.$data.keyDesc = keyData
//     },
//     template:
//       `<div class="div-key">
//         <label :for="id_ipt_key">Key: </label>
//         <input :id="id_ipt_key" v-model="keyDesc.key" />
//         <input :id="id_ipt_optional" type="checkbox" v-model="keyDesc.optional" />
//         <label :for="id_ipt_optional">Optional</label><br/>
//         <h4>Reactor</h4>
//         <div v-if="keyDesc.reactor !== undefined && keyDesc.reactor !== null">
//           <input :id="id_reactor_type" v-model="keyDesc.reactor.type" /><br/>
//           <textarea :id="id_reactor_val" v-model="keyDesc.reactor.value" />
//         </div>
//       </div>`
//   }
// }
