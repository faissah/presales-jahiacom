<!-- Multiple Checkboxes (inline) -->
<div class="form-group"
     ng-class="{'has-error': form[input.name].$invalid&&form[input.name].$dirty}"
     ng-show="resolveLogic()">
    <label class="control-label">
        {{input.label}}
        <span ng-if="isRequired()"
              ng-show="asteriskResolver()">
            <sup>&nbsp;<i class="fas fa-asterisk fa-sm"></i></sup>
        </span>
    </label>

    <div class="checkbox" ff-validations ff-logic>
        <div class="form-check form-check-inline" ng-repeat="checkboxOption in input.checkboxes | filter: 'true' : null : visible">
            <label class="form-check-label">
                <input type="checkbox"
                       class="form-check-input"
                       name="{{input.name}}" checklist-model="input.value"
                       ng-required="checkValues()"
                       checklist-value="checkboxOption.key"
                       checklist-change="makeDirty(); ffValidate()"
                       ng-model-options="{'allowInvalid':true}"
                       ng-disabled="readOnly"
                       ff-focus-tracker="{{input.name}}_{{checkboxOption.key}}">
                {{checkboxOption.value}}
                <span ng-init="input.value.length > 0 ? makeDirty() : ''"></span>
            </label>
        </div>
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
</div>
