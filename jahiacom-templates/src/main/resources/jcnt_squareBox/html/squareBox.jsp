<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="subTitle" value="${currentNode.properties.subTitle.string}"/>
<c:set var="color" value="${currentNode.properties.color.string}"/>

<c:set var="imageNode" value="${currentNode.properties.image.node}"/>
<c:if test="${! empty imageNode}">
    <c:url var="imageUrl" value="${imageNode.url}" context="/"/>
    <c:set var="bgStyle"> style="background-image: url(${imageUrl});background-position: center bottom;background-repeat: no-repeat;background-size: contain"</c:set>
</c:if>

<c:choose>
    <c:when test="${color eq 'blue'}">
        <c:set var="colorClass" value=" bg-jahia white"/>
    </c:when>
    <c:when test="${color eq 'white'}">
        <c:set var="colorClass" value=" bg-white"/>
    </c:when>
</c:choose>
<div class="jumbotron square ${colorClass}"${bgStyle}>

    <c:if test="${! empty title}">
        <h3>${title}</h3>
    </c:if>
    <p>
        <c:if test="${! empty subTitle}">
            ${subTitle}<br/>
        </c:if>
        <template:include view="hidden.link"/>
    </p>

    <%--<template:include view="hidden.image"/>--%>
</div>
