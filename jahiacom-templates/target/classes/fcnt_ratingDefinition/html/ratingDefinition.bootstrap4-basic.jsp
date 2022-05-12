<div class="form-group"
     ng-class="{'has-error': form[input.name].$invalid&&form[input.name].$dirty}"
     ng-show="resolveLogic()">
    <label class="control-label" for="{{input.name}}">
        {{input.label}}<span ng-if="isRequired()" ng-show="asteriskResolver()"><sup>&nbsp;<i class="fas fa-asterisk fa-sm"></i></sup></span>
    </label>

    <input type="hidden"
           name="{{input.name}}"
           id="{{input.name}}"
           ng-model="input.value"
           ng-required="isRequired()"
           ff-validations
           ff-logic>
    <span ng-mouseleave="reset()"
          ng-keydown="onKeydown($event)"
          tabindex="0"
          role="slider"
          aria-valuemin="0"
          aria-valuemax="{{range.length}}"
          aria-valuenow="{{value}}" class="noOutline">
          <span ng-repeat-start="r in range track by $index" class="sr-only"></span>
            <span ng-repeat-end
               ng-mouseenter="enter($index + 1)"
               ng-click="rate($index + 1)"
                  class="fa-stack {{r.iconSize}}">
                <i class="fa {{resolveClass(r)}} {{r.stateHover}} pointer">
            </i>
                <strong ng-if="r.type == 'variable'" class="fa-stack-1x text-primary pointer">{{r.value}}</strong>
           </span>
    </span>
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
