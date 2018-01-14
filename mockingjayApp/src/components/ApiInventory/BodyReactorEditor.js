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

// module.exports = {
//   name: 'BodyReactorEditor',
//   opts: {
//     props: ['keyPostfix', 'id'],
//     data: function () {
//       return {
//         body: {
//           optional: true,
//           reactor: null
//         }
//       }
//     },
//     computed: {
//       id_body_optional: function () {
//         return 'ipt_' + this.id
//       },
//       id_body_type: function () {
//         return 'ipt_' + this.id + '_reactor_type'
//       },
//       id_body_val: function () {
//         return 'ipt_' + this.id + '_reactor_value'
//       }
//     },
//     mounted: function () {
//       let config = this.$store.state.ApiConfig
//       let paths = this.id.split('_')
//       let keyData = config
//       for (let i = 0; i < paths.length; i++) {
//         let dummy = keyData[paths[i]]
//         if (dummy) {
//           keyData = dummy
//         } else {
//           break
//         }
//       }

//       this.$data.body = keyData
//     },
//     template:
//       `<div v-if="body !== undefined && body !== null" class="div-key">
//         <label :for="id_body_optional">Optional</label>
//         <input :id="id_body_optional" type="checkbox" v-model="body.optional" />
//         <h4>Validator</h4>
//         <div v-if="body.reactor !== undefined && body.reactor !== null">
//           <input :id="id_body_type" v-model="body.reactor.type" /><br/>
//           <textarea :id="id_body_val" v-model="body.reactor.value" />
//         </div>
//       </div>`
//   }
// }
  