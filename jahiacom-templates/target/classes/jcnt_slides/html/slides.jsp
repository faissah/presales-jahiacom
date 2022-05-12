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
<c:set var="subLists" value="${jcr:getChildrenOfType(currentNode, 'jcmix:slideMix')}"/>
<c:set var="interval" value="${currentNode.properties.interval.long}"/>
<c:if test="${empty interval}">
    <c:set var="interval" value="7000"/>
</c:if>

<div id="slider-${currentNode.identifier}" class="carousel slide" data-ride="carousel" data-interval="${interval}">
    <c:set var="displayDots" value="${currentNode.properties.displayDots.boolean}"/>
    <c:if test="${displayDots}">
        <ol class="carousel-indicators">
            <c:forEach items="${subLists}" var="droppableContent" varStatus="status">
                <li data-target="#slider-${currentNode.identifier}" data-slide-to="${status.index}" class="${status.first?'active':''}"></li>
            </c:forEach>
        </ol>
    </c:if>
    <div class="carousel-inner">
        <c:forEach items="${subLists}" var="droppableContent" varStatus="status">
            <div class="carousel-item ${status.first?'active':''}">
                <template:module node="${droppableContent}" editable="true"/>
            </div>
        </c:forEach>
    </div>


    <c:set var="displayArrows" value="${currentNode.properties.displayArrows.boolean}"/>
    <c:if test="${displayArrows}">
        <a class="carousel-control-prev" href="#slider-${currentNode.identifier}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#slider-${currentNode.identifier}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </c:if>
</div>
<c:if test="${renderContext.editMode}">
    <template:module path="*" nodeTypes="jcmix:slideMix"/>
</c:if>

