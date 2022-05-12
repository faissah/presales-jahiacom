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
<c:set var="subLists" value="${jcr:getChildrenOfType(currentNode, 'jcnt:resource,jnt:contentReference')}"/>
<%--
<c:set var="displayFilters" value="${currentNode.properties.displayFilters.boolean}"/>
<c:if test="${displayFilters}">
    <ul class="nav nav-pills d-flex justify-content-center pt-5" id="" role="tablist">
        <li class="nav-item px-2">
            <a class="nav-link badge-dark rounded-pill active" id="" data-toggle="tab" href="#jahia-media" data-target="#jahia-media" role="tab" aria-controls="" aria-selected="true">All Resources</a>
        </li>
        <li class="nav-item px-2">
            <a class="nav-link badge-primary rounded-pill" id="" data-toggle="tab" href="#press-room" data-target="#press-room" role="tab" aria-controls="id" aria-selected="false">Success Stories</a>
        </li>
        <li class="nav-item px-2">
            <a class="nav-link badge-purple rounded-pill" id="" data-toggle="tab" href="#press-room" data-target="#press-room" role="tab" aria-controls="id" aria-selected="false">Documentation</a>
        </li>
        <li class="nav-item px-2">
            <a class="nav-link badge-danger rounded-pill" id="" data-toggle="tab" href="#press-room" data-target="#press-room" role="tab" aria-controls="id" aria-selected="false">Tools</a>
        </li>
        <li class="nav-item px-2">
            <a class="nav-link badge-warning rounded-pill" id="" data-toggle="tab" href="#press-room" data-target="#press-room" role="tab" aria-controls="id" aria-selected="false">Trials</a>
        </li>
        <li class="nav-item px-2">
            <a class="nav-link badge-success rounded-pill" id="" data-toggle="tab" href="#press-room" data-target="#press-room" role="tab" aria-controls="id" aria-selected="false">Events &amp; Webinars</a>
        </li>
    </ul>
</c:if>

--%>
<section class="row pt-4 resources">
    <div class="container">
        <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
        <c:if test="${! empty title}">
            <h2 class="text-center">${title}</h2>
        </c:if>
        <c:forEach items="${subLists}" var="droppableContent" varStatus="status">
            <%--<div class="filter-grid-item bg-white row">--%>
                <template:module node="${droppableContent}" editable="true"/>
            <%--</div>--%>
        </c:forEach>
        <c:if test="${renderContext.editMode}">
            <template:module path="*" nodeTypes="jcnt:resource"/>
        </c:if>
    </div>
</section>


