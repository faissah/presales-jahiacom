<!-- Multiple Radios (inline) -->
<div class="form-group"
     ng-class="{'has-error': form[input.name].$invalid&&form[input.name].$dirty}"
     ng-show="resolveLogic()">

    <div class="d-flex flex-column">

        <label>{{input.label}}
            <span ng-if="isRequired()"  ng-show="asteriskResolver()">
            <sup>&nbsp;<i class="fa fa-asterisk fa-sm"></i></sup>
        </span>
        </label>
        <div>

            <div class="form-check form-check-inline"
                 ng-repeat="(radiok, radiov) in input.radios | filter: 'true' : null : visible">
                <input type="radio"
                       class="form-check-input"
                       name="{{input.name}}"
                       id="{{radiov.key}}"
                       ng-model="input.value"
                       ng-model-options="{'allowInvalid':true}"
                       value="{{radiov.key}}"
                       ng-required="isRequired()"
                       ng-disabled="readOnly"
                       ng-change="makeDirty()"
                       ff-validations
                       ff-logic
                       ff-focus-tracker="{{input.name}}_{{radiov.key}}">
                <label class="form-check-label" for="{{radiov.key}}">
                    {{radiov.value}}
                </label>
            </div>
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