<form ng-show="!vm.showPreloadMessage"
      class="{{vm.cssClassName}}"
      novalidate name="{{vm.formName}}"
      ng-model-options="{updateOn:'default blur', debounce: { default: 0, blur: 0 } }"
      ng-submit="vm.preventSubmit($event)"
      data-form-id="{{vm.currentForm.jcrId}}">
    <fieldset>
        <legend ng-if="vm.showFormTitle && !vm.isSubmitted()">{{vm.currentForm.displayableName}}</legend>
        <ff-input ng-if="!vm.isLayoutAvailable && !input.isInFieldset"
                  ng-repeat="input in vm.inputs"
                  input="input"
                  resolve-logic="vm.resolveLogic(input, vm.getFormController())"
                  resolve-placeholder="vm.resolvePlaceholder(input)"
                  resolve-inputsize="vm.resolveInputsize(input)"
                  resolve-name="vm.resolveName(input)"
                  resolve-label="vm.resolveLabel(input)"
                  dispatch-active-input-event="vm.dispatchActiveInputEvent(type)"
                  validation-display-level="{{vm.validationDisplayLevel}}">
        </ff-input>
        <div class="row"
             ng-if="vm.isLayoutAvailable && !input.isInFieldset"
             ng-repeat="rows in vm.currentForm.layoutJson.steps[vm.currentStep].rows">
            <div class="{{cols.col}} {{cols.offset}}"
                 ng-repeat="cols in rows.row">
                <div ng-if="cols.layoutUUID !== null">
                    <ff-input input="vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]]"
                              resolve-logic="vm.resolveLogic(vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]], vm.getFormController())"
                              resolve-placeholder="vm.resolvePlaceholder(vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]])"
                              resolve-inputsize="vm.resolveInputsize(vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]])"
                              resolve-name="vm.resolveName(vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]])"
                              resolve-label="vm.resolveLabel(vm.inputs[vm.preparedLayoutInputs[cols.layoutUUID]])"
                              validation-display-level="{{vm.validationDisplayLevel}}">
                    </ff-input>
                </div>
            </div>
        </div>
        <div class="row" ng-if="vm.getCaptchaKey() !== null && vm.currentForm.steps.length-1 === vm.currentStep && vm.currentForm.displayCaptcha">
            <div class="col-sm-10 col-sm-offset-2 text-right">
                <div vc-recaptcha theme="'light'" key="vm.getCaptchaKey()" on-create="vm.notifyOfCaptchaLoad()" lang="vm.getContextualData().locale" ng-model="vm.captchaResponse"></div>
            </div>
        </div>
        <div class="form-group" ng-show="vm.showFormControlButtons()">
            <div class="col-sm-offset-2 col-sm-10" ng-if="vm.currentForm.controls == undefined">
                <button class="btn btn-sm btn-default" type="button"
                        ng-click="vm.update(false); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$submitted"
                        ng-show="vm.currentStep>0&&!vm.isSubmitted()"
                        message-key="angular.ffController.button.previousStep">
                </button>
                <button class="btn btn-sm btn-primary"
                        type="button"
                        data-submit="customsubmit"
                        ng-click="vm.update(true); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$invalid
                                || vm.getFormController().$submitted
                                || vm.isPreviewMode
                                || (vm.currentForm.displayCaptcha && vm.getCaptchaKey() !== null && !vm.captchaLoaded && vm.currentForm.displayCaptcha)
                                || vm.currentStep<vm.currentForm.steps.length-1"
                        ng-show="vm.currentStep==vm.currentForm.steps.length-1&&!vm.isSubmitted()"
                        message-key="angular.ffController.button.submit">
                </button>
                <button class="btn btn-sm btn-default"
                        type="button"
                        data-submit="customsubmit"
                        ng-click="vm.update(true); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$invalid || vm.getFormController().$submitted"
                        ng-show="vm.currentStep<vm.currentForm.steps.length-1&&!vm.isSubmitted()"
                        message-key="angular.ffController.button.nextStep">
                </button>
                <button class="btn btn-sm btn-danger"
                        type="button" ng-click="vm.reset()"
                        ng-disabled="vm.getFormController().$submitted || vm.currentForm.steps[vm.currentStep].resetDisabled"
                        ng-show="!vm.isSubmitted()"
                        message-key="angular.ffController.button.reset">
                </button>
            </div>
            <div class="col-sm-offset-2 col-sm-10" ng-if="vm.currentForm.controls != undefined">
                <button class="btn btn-sm btn-default" type="button"
                        ng-click="vm.update(false); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$submitted"
                        ng-show="!vm.currentForm.controls.hidePrevious&&vm.currentStep>0&&!vm.isSubmitted()">
                    <span ng-if="vm.currentForm.controls.previousLabel != undefined">{{vm.currentForm.controls.previousLabel}}</span>
                    <span ng-if="vm.currentForm.controls.previousLabel == undefined" message-key="angular.ffController.button.previousStep"></span>
                </button>
                <button class="btn btn-sm btn-primary"
                        type="button"
                        data-submit="customsubmit"
                        ng-click="vm.update(true); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$invalid
                                || vm.getFormController().$submitted
                                || vm.isPreviewMode
                                || (vm.currentForm.displayCaptcha && vm.getCaptchaKey() !== null && !vm.captchaLoaded && vm.currentForm.displayCaptcha)
                                || vm.currentStep<vm.currentForm.steps.length-1"
                        ng-show="vm.currentStep==vm.currentForm.steps.length-1&&!vm.isSubmitted()">
                    <span ng-if="vm.currentForm.controls.submitLabel != undefined">{{vm.currentForm.controls.submitLabel}}</span>
                    <span ng-if="vm.currentForm.controls.submitLabel == undefined" message-key="angular.ffController.button.submit"></span>
                </button>
                <button class="btn btn-sm btn-default"
                        type="button"
                        data-submit="customsubmit"
                        ng-click="vm.update(true); vm.scrollToTop()"
                        ng-disabled="vm.getFormController().$invalid || vm.getFormController().$submitted"
                        ng-show="vm.currentStep<vm.currentForm.steps.length-1&&!vm.isSubmitted()">
                    <span ng-if="vm.currentForm.controls.nextLabel != undefined">{{vm.currentForm.controls.nextLabel}}</span>
                    <span ng-if="vm.currentForm.controls.nextLabel == undefined" message-key="angular.ffController.button.nextStep"></span>
                </button>
                <button class="btn btn-sm btn-danger"
                        type="button" ng-click="vm.reset()"
                        ng-disabled="vm.getFormController().$submitted || vm.currentForm.steps[vm.currentStep].resetDisabled"
                        ng-show="!vm.currentForm.controls.hideReset&&!vm.isSubmitted()">
                    <span ng-if="vm.currentForm.controls.resetLabel != undefined">{{vm.currentForm.controls.resetLabel}}</span>
                    <span ng-if="vm.currentForm.controls.resetLabel == undefined" message-key="angular.ffController.button.reset"></span>
                </button>
            </div>
        </div>
    </fieldset>
</form>