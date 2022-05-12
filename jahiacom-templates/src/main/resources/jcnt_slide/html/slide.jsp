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
<c:set var="verticalAlign" value="${currentNode.properties.verticalAlign.string}"/>
<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="subTitle" value="${currentNode.properties.subTitle.string}"/>
<c:choose>
    <c:when test="${verticalAlign eq 'justify-content-center'}">
        <c:set var="flexClass" value="d-flex flex-column justify-content-center"/>
    </c:when>
    <c:when test="${verticalAlign eq 'justify-content-between'}">
        <c:set var="flexClass" value=" d-flex flex-column justify-content-between"/>
    </c:when>
</c:choose>

<template:include view="hidden.image">
    <template:param name="class" value="d-block w-100"/>
    <template:param name="style" value="transform: translateY(-10%)"/>
</template:include>

<div class="carousel-caption ${flexClass}">
    <c:if test="${! empty title}">
        <div class="display-4 font-weight-bold">${currentNode.displayableName}</div>
    </c:if>
    <c:if test="${! empty subTitle}">
        <p class="lead">${subTitle}</p>
    </c:if>
</div>

