module.exports = {
  name: 'BodyValidationEditor',
  opts: {
    props: ['bodyDesc'],
    computed: {
    },
    template:
        `<div class="div-key">
          <label for="ipt_req_body_required">Required</label><br/>
          <input id="ipt_req_body_required" type="checkbox" v-model="bodyDesc.required" />
          <h4>Validator</h4>
          <div>
            <input id="ipt_body_validator_type" v-model="bodyDesc.validator.type" /><br/>
            <textarea id="ipt_body_validator_type" :value="bodyDesc.validator.value" />
          </div>
        </div>`
  }
}
