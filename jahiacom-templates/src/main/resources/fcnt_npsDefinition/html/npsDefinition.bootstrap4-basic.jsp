<style>
    .btn-circle {
        text-align: center;
        padding: 0;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        line-height: 35px;
        font-size: 0.9rem;
    }
    .btn-outline-primary {
        border-color:#00a1e4!important;
    }
    .btn-outline-primary:not(:disabled):not(.disabled).active,
    .btn-outline-primary:not(:disabled):not(.disabled):active{
        background-color:#00a1e4!important;
        border-color:#00a1e4!important;
    }
</style>

<div class="form-group"
     ng-class="{'has-error': form[input.name].$invalid&&form[input.name].$dirty}"
     ng-show="resolveLogic()">
    <label class="control-label" for="{{input.name}}">
        {{input.label}}<span ng-if="isRequired()" ng-show="asteriskResolver()"><sup>&nbsp;<i class="fa fa-asterisk fa-sm"></i></sup></span>
    </label>
    <div class="d-flex flex-column">
        <input type="hidden"
               name="{{input.name}}"
               id="{{input.name}}"
               ng-model="input.value"
               ng-required="isRequired()"
               ff-validations
               ff-logic>
        <div>
            <span ng-repeat="r in range track by $index "
                  class="btn btn-outline-primary btn-circle m-1"
                  ng-click="rate($index )"
                  ng-class="{'active': input.value === $index }">
                    {{ $index }}
                </span>
        </div>
        <small class="help-block text-muted"
              ng-show="input.helptext != undefined">
            {{input.helptext}}
        </small>
        <small class="help-block text-muted"
               ng-repeat="(validationName, validation) in input.validations"
               ng-show="showErrorMessage(validationName)">
            {{validation.message}}
        </small>
    </div>

</div>