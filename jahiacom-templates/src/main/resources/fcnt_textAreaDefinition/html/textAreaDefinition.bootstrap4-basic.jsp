<!-- Textarea -->
<div class="form-group"
     ng-class="{'has-error': form[input.name].$invalid&&form[input.name].$dirty}"
     ng-show="resolveLogic()">
    <label class="control-label" for="{{input.name}}">
        {{input.label}}<span ng-if="isRequired()" ng-show="asteriskResolver()"><sup>&nbsp;<i class="fas fa-asterisk fa-sm"></i></sup></span>
    </label>

    <textarea rows="{{input.rows}}"
              ng-model-options="{allowInvalid:true}"
              ng-model="input.value"
              placeholder="{{input.placeholder}}"
              class="form-control {{input.inputsize}}"
              name="{{input.name}}"
              id="{{input.name}}"
              ng-required="isRequired()"
              ng-readonly="readOnly"
              ff-validations
              ff-logic
              ng-binding="input.value"
              ff-focus-tracker="{{input.name}}">
        </textarea>
        <span class="help-block"
              ng-show="input.helptext != undefined">
            {{input.helptext}}
        </span>
        <span class="help-block"
              ng-repeat="(validationName, validation) in input.validations"
          ng-show="showErrorMessage(validationName)">
                {{validation.message}}
        </span>
</div>
