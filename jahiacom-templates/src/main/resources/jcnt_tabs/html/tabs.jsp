<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="uiComponents" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="search" uri="http://www.jahia.org/tags/search" %>
<%@ taglib prefix="jahiacom" uri="http://jahia.com/jahiacom/taglibs" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<%--@elvariable id="moduleMap" type="java.util.Map"--%>


<template:addResources type="javascript" resources="jquery.min.js"/>
<template:addResources type="javascript" resources="popper.min.js"/>
<template:addResources type="javascript" resources="bootstrap.min.js"/>

<c:set var="menuStyle" value="${currentNode.properties.menuStyle.string}"/>
<c:choose>
    <c:when test="${menuStyle eq 'style2'}">
        <c:set var="menuClass" value=" nav-border-bottom border-primary"/>
    </c:when>
    <c:when test="${menuStyle eq 'style3'}">
        <c:set var="menuClass" value=" nav-no-border"/>
    </c:when>
    <c:when test="${menuStyle eq 'style4'}">
        <c:set var="menuClass" value=" nav-border-bottom h4 border-primary font-weight-bold justify-content-center py-4"/>
    </c:when>
    <c:when test="${menuStyle eq 'style5'}">
        <c:set var="menuClass" value=" nav-no-border h1 font-weight-bold nav-space-between nav-primary"/>
    </c:when>
    <c:when test="${menuStyle eq 'style6'}">
        <c:set var="menuClass" value=" justify-content-center nav-border-top"/>
    </c:when>
    <c:otherwise>
        <c:set var="menuClass" value=" nav-border-bottom h4 font-weight-bold nav-space-between"/>
    </c:otherwise>
</c:choose>

<c:set var="parentTabs" value="${jcr:getParentsOfType(currentNode, 'jcnt:tab')}"/>
<c:if test="${fn:length(parentTabs) > 0}">
    <c:set var="anchorNamePreset" value="${jahiacom:replaceAll(currentNode.displayableName, '[^A-Za-z0-9_]', '-')}_"/>
    <c:set var="firstChar" value = "${fn:substring(fn:toLowerCase(anchorNamePreset), 0, 1)}" />
    <c:if test="${! fn:contains(alphabet, firstChar)}">
        <c:set var="anchorNamePreset" value="tab-${anchorNamePreset}"/>
    </c:if>

</c:if>

<c:set var="subLists" value="${jcr:getChildrenOfType(currentNode, 'jcnt:tab,jnt:contentReference')}"/>
<c:set var="alphabet" value="abcdefghijklmnopqrstuvwxyz"/>
<c:forEach items="${subLists}" var="droppableContent" varStatus="status">
    <c:set var="anchorName" value="${fn:trim(droppableContent.name)}"/>
    <%-- check if anchor start using a char, else prefix with tab --%>
    <c:set var="firstChar" value = "${fn:substring(fn:toLowerCase(anchorName), 0, 1)}" />
    <c:if test="${! fn:contains(alphabet, firstChar)}">
        <c:set var="anchorName" value="tab-${anchorName}"/>
    </c:if>
    <%-- cleanup --%>
    <c:set var="anchorName" value="${anchorNamePreset}${jahiacom:replaceAll(anchorName, '[^A-Za-z0-9_]', '-')}"/>
    <c:set var="imageNode" value="${droppableContent.properties.image.node}"/>
    <c:if test="${! empty imageNode}">
        <c:url var="imageUrl" value="${imageNode.url}" context="/"/>
    </c:if>

    <c:set var="navItems">
        ${navItems}
        <li class="nav-item">
            <a class="nav-link ${status.first?' active':''}" data-toggle="tab" href="#${anchorName}" data-target="#${anchorName}" role="tab" aria-controls="${anchorName}">${droppableContent.displayableName}</a>
        </li>
    </c:set>
    <c:set var="tabPanes">
        ${tabPanes}
        <c:if test="${! empty imageUrl && menuStyle ne 'style6'}">
            <c:set var="bgStyle">${' '}style="background:url(${imageUrl}) no-repeat;margin-top: -200px;padding-top: 200px;background-position: 10% 50%;background-size: cover;"</c:set>
        </c:if>
        <div class="tab-pane  ${status.first?' active':''} fade ${status.first ? ' show' : ''}" id="${anchorName}" role="tabpanel" ${bgStyle}>
            <div class="container">
                <div class="row ${empty imageUrl ? '' : ' space'}">
                    <c:if test="${! empty imageUrl && menuStyle eq 'style6'}">
                        <img src="${imageUrl}" alt="" class="mx-auto">
                    </c:if>

                    <template:module node="${droppableContent}" editable="true"/>
                </div>
            </div>

        </div>
    </c:set>
    <c:remove var="imageUrl"/>
    <c:remove var="bgStyle"/>
</c:forEach>


<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
<c:if test="${! empty title}">
    <h2 class="text-center">${title}</h2>
</c:if>
<c:if test="${menuStyle eq 'style6'}">
    <div class="tab-img-target"></div>
</c:if>

<ul class="nav nav-tabs d-flex ${menuClass} ${menuStyle eq 'style6' ? ' tab-multi' : ''}" id="tabs-${currentNode.identifier}" role="tablist">
    ${navItems}
</ul>
<div class="tab-content ${menuStyle eq 'style6' ? ' tab-multi-targets' : ''}">
    ${tabPanes}
</div>
<c:if test="${renderContext.editMode}">
    <template:module path="*" nodeTypes="jcnt:tab"/>
</c:if>
<template:addResources targetTag="body" type="inline">
    <script>
        var url = window.location.href;
        if (url.indexOf("#") > 0){
            var activeTab = url.substring(url.indexOf("#") + 1);
            $('.nav[role="tablist"] a[href="#'+activeTab+'"]').tab('show');
        }
    </script>
</template:addResources>
