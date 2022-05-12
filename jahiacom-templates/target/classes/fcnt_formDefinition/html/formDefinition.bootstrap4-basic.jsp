<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<ff-progress-bar ng-if="!_.isUndefined(vm.currentForm.progressBar) && (vm.currentForm.progressBar.position === 'top' || vm.currentForm.progressBar.position === 'both') && !vm.getFormController().$submitted"
                 form="vm.currentForm" current-step="vm.currentStep"></ff-progress-bar>

<%--Preload Message--%>
<div class="" ng-if="vm.showPreloadMessage">
    <div class=" muted">
        <strong ng-bind-html="vm.currentForm.afterSubmissionText"></strong>
    </div>
</div>

<%--After submission callbacks and message--%>
<div class="" ng-if="vm.getFormController().$submitted">
    <div class=""
         ng-if="!vm.displaySubmissionText && (!vm.runCallbacks && vm.currentForm.callbacks.displayTemplates)
         || !vm.displaySubmissionText && (vm.runCallbacks && !vm.currentForm.callbacks.displayTemplates)
         || !vm.displaySubmissionText && vm.currentForm.callbacks === null">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
    </div>

    <ff-callback ng-if="vm.runCallbacks"
                 action-data="vm.actionData"
                 result-data="vm.resultData"
                 callback-directives="vm.currentForm.callbacks.callbacks"
                 all-completed-flag="vm.displaySubmissionText"
                 display-templates="vm.currentForm.callbacks.displayTemplates">
    </ff-callback>

    <div class=" muted" ng-if="vm.displaySubmissionText">
        <strong ng-bind-html="vm.currentForm.afterSubmissionText"></strong>
    </div>
</div>

<template:include view="bootstrap4-basic-formView" templateType="html" />

<ff-progress-bar ng-if="!_.isUndefined(vm.currentForm.progressBar) && (vm.currentForm.progressBar.position === 'bottom' || vm.currentForm.progressBar.position === 'both') && !vm.getFormController().$submitted"
                 form="vm.currentForm" current-step="vm.currentStep"></ff-progress-bar>

