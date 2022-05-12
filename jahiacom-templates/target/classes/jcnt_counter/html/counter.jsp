<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="uiComponents" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="search" uri="http://www.jahia.org/tags/search" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<%--@elvariable id="moduleMap" type="java.util.Map"--%>

<%-- jquery.appear.min.js comes from animate module --%>
<template:addResources type="javascript" resources="jquery.min.js,jquery.appear.min.js,jquery.countTo.js"/>


<div class="font-weight-normal primary display-3"><span class="timer" id="timer-${currentNode.identifier}" data-to="${currentNode.properties.number.long}">${currentNode.properties.number.long}</span>${currentNode.properties.unit.string}


</div>
<p>${currentNode.properties['jcr:title'].string}</p>
<template:addResources type="inline" targetTag="body">
    <script>
        $(document).ready(function () {
            $('#timer-${currentNode.identifier}').appear(function () {
                var $this = $(this);
                $this.countTo({speed:600})
            },{accX: 50, accY: 50})
        });
    </script>
</template:addResources>
