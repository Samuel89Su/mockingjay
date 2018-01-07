module.exports = {
  name: 'BodyReactorEditor',
  opts: {
    props: ['bodyDesc'],
    computed: {
    },
    template:
      `<div class="div-key">
        <label for="ipt_req_body_required">Optional</label><br/>
        <input id="ipt_req_body_required" type="checkbox" v-model="bodyDesc.optional" />
        <h4>Validator</h4>
        <div>
          <input id="ipt_body_validator_type" v-model="bodyDesc.reactor.type" /><br/>
          <textarea id="ipt_body_validator_type" :value="bodyDesc.reactor.value" />
        </div>
      </div>`
  }
}
  