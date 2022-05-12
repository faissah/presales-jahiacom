<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<template:addResources type="javascript" resources="jquery-ui.min.js"/>
<template:addResources type="javascript" resources="bootstrap.min.js"/>
<script>
    (function(){
        <!--Configure the ffFormControlProvider-->
        angular.module('formFactory').config(['ffFormControlProvider', function(ffFormControlProvider) {
            ffFormControlProvider.setErrorMessageDisplayBehaviour('${errorMessageDisplayBehaviour}');
        }]);
        var datePickerJqueryUI = function($log, i18n, ffCommonUseFactory) {
            var directive = {
                restrict: 'A',
                require : ['^ngModel'],
                link    : linkFunction
            };
            return directive;
            function linkFunction(scope, el, attr, ctrl) {
                var pickerScope = scope;
                $(el).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: normalizeFormat(scope.input.format),
                    onClose: function(dateAsTxt) {
                        pickerScope.input.value = moment(dateAsTxt,pickerScope.input.format).toJSON();
                        pickerScope.input.previouslySelected = dateAsTxt;
                    },
                    beforeShow:function() {
                        if(pickerScope.input.previouslySelected !== undefined) {
                            return {defaultDate : pickerScope.input.previouslySelected}
                        }
                        return null;
                    }
                });
                function normalizeFormat(format) {
                    if (format == null || format.trim().length == 0) {
                        format = 'yy-mm-dd';
                    }
                    var separator =  ['-', '/'];
                    var normalizedFormat = '';
                    var separatorDetected = false;
                    for (var i in separator) {
                        //Go with the first separator we find, as this format should never have more than one type of separator.
                        if (format.indexOf(separator[i]) !== -1) {
                            var sections = format.split(separator[i]);
                            for (var j in sections) {
                                if (sections[j].toLowerCase().indexOf('y') !== -1) {
                                    normalizedFormat += sections[j].toLowerCase().substring(0, sections[j].length/2) + (j < sections.length-1 ? separator[i] : '');
                                } else if (sections[j].toLowerCase().indexOf('m') !== -1) {
                                    normalizedFormat += sections[j].toLowerCase() + (j < sections.length-1 ? separator[i] : '');
                                } else if (sections[j].toLowerCase().indexOf('d') !== -1) {
                                    normalizedFormat += sections[j].toLowerCase() + (j < sections.length-1 ? separator[i] : '');
                                }
                            }
                            separatorDetected = true;
                            break;
                        }
                    }
                    return normalizedFormat;
                }
            }
        };
        angular.module('formFactory').directive('ffDatePickerUi', ['$log', 'i18nService', 'ffCommonUseFactory', datePickerJqueryUI]);
    })();
</script>
<style>
    .ff-has-error {
        color: red;
        border: 1px solid red ;
    }
</style>