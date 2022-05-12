<!DOCTYPE html>
<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="jahiacom" uri="http://jahia.com/jahiacom/taglibs" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<c:set var="mainResourceNode" value="${renderContext.mainResource.node}"/>
<html lang="${renderContext.mainResourceLocale.language}">
<head>
    <%-- Required meta tags --%>
    <meta charset="utf-8"/>
    <meta name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=5, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi"/>
    <c:set var="pageTitle"
           value="${mainResourceNode.displayableName}"/>
    <c:if test="${jcr:isNodeType(mainResourceNode, 'jcmix:alternativeTitle')}">
        <c:set var="longTitle" value="${mainResourceNode.properties.longTitle.string}"/>
        <c:if test="${not empty longTitle}">
            <c:set var="pageTitle"
                   value="${longTitle}"/>
        </c:if>
    </c:if>

    <title>${pageTitle}</title>
    <meta name="format-detection" content="telephone=no"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet">

    <link rel="shortcut icon" href="${url.currentModule}/images/favicon/favicon.ico" type="image/x-icon">

    <link rel="apple-touch-icon" sizes="57x57" href="${url.currentModule}/images/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="${url.currentModule}/images/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="${url.currentModule}/images/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="${url.currentModule}/images/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="${url.currentModule}/images/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="${url.currentModule}/images/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="${url.currentModule}/images/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="${url.currentModule}/images/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="${url.currentModule}/images/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"
          href="${url.currentModule}/images/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="${url.currentModule}/images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="${url.currentModule}/images/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="${url.currentModule}/images/favicon/favicon-16x16.png">
    <meta name="msapplication-TileImage" content="${url.currentModule}/images/favicon/ms-icon-144x144.png">

    <template:addResources type="css" resources="bootstrap.min.css"/>
    <template:addResources type="css" resources="slick.min.css"/>
    <template:addResources type="css" resources="slick-theme.min.css"/>
    <template:addResources type="css" resources="all.min.css"/>
    <template:addResources type="css" resources="jahiacom27.min.css"/>
    <template:addResources type="css" resources="animate.min.css"/>
    <template:addResources type="javascript" resources="jquery.min.js"/>
    <template:addResources type="javascript" resources="popper.min.js"/>
    <template:addResources type="javascript" resources="bootstrap.min.js"/>
    <template:addResources type="javascript" resources="slick.js"/>
    <template:addResources type="javascript" resources="jquery.appear.min.js"/>
    <template:addResources type="javascript" resources="custom.js"/>
    <c:if test="${renderContext.editMode}">
        <template:addResources type="css" resources="edit.css"/>
    </c:if>
    <c:if test="${not empty mainResourceNode.properties['jcr:description'].string}">
        <c:set var="pageDescription"
               value="${fn:substring(mainResourceNode.properties['jcr:description'].string,0,160)}"/>
        <meta name="description" content="${fn:escapeXml(pageDescription)}"/>
        <meta property="og:description" content="${fn:escapeXml(pageDescription)}"/>
    </c:if>
    <c:set var="keywordsI18n" value="${renderContext.mainResource.node.properties['j:keywordsI18n'].string}"/>
    <c:choose>
        <c:when test="${! empty keywordsI18n}">
            <meta name="keywords" content="${fn:trim(keywordsI18n)}"/>
        </c:when>
        <c:otherwise>
            <jcr:nodeProperty node="${mainResourceNode}" name="j:keywords" var="keywords"/>
            <c:set var="keywordsStr" value=""/>
            <c:forEach items="${keywords}" var="keyword">
                <c:set var="keywordsStr">${keywordsStr} ${keyword.string}</c:set>
            </c:forEach>
            <c:if test="${!empty keywordsStr}">
                <meta name="keywords" content="${fn:escapeXml(keywordsStr)}"/>
            </c:if>
        </c:otherwise>
    </c:choose>
    <c:choose>
        <c:when test="${pageContext.request.serverPort == 80 || pageContext.request.serverPort == 443}">
            <c:set var="serverUrl" value="${pageContext.request.scheme}://${pageContext.request.serverName}"/>
        </c:when>
        <c:otherwise>
            <c:set var="serverUrl"
                   value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}"/>
        </c:otherwise>
    </c:choose>

    <meta property="og:title" content="${fn:escapeXml(pageTitle)}"/>
    <c:url var="currentPageUrl" value="${mainResourceNode.url}" context="/"/>
    <meta property="og:url" content="${serverUrl}${currentPageUrl}"/>
    <c:set var="imageUrl" value="${url.currentModule}/images/jahia-3x.png"/>
    <c:set var="imageWidth" value="250"/>
    <c:set var="imageHeight" value="120"/>

    <c:if test="${jcr:isNodeType(mainResourceNode, 'jcmix:image')}">
        <c:set var="image" value="${mainResourceNode.properties.image.node}"/>
        <c:if test="${not empty image}">
            <c:url var="imageUrl" value="${image.url}" context="/"/>
            <c:set var="imageWidth" value="${image.properties['j:width'].long}"/>
            <c:set var="imageHeight" value="${image.properties['j:height'].long}"/>
        </c:if>
    </c:if>
    <meta property="og:image" content="${serverUrl}${imageUrl}"/>
    <meta property="og:image:width" content="${imageWidth}"/>
    <meta property="og:image:height" content="${imageHeight}"/>






    <%--
    <c:if test="${jcr:isNodeType(mainResourceNode, 'jcnt:blogEntry,jcnt:resource,jcnt:person')}">
        <c:url var="currentPageUrl" value="${mainResourceNode.url}"/>
        <c:url var="ampUrl" value="https://mercury.postlight.com/amp">
            <c:param name="url" value="${serverUrl}${currentPageUrl}"/>
        </c:url>
        <link rel="amphtml" href="${ampUrl}">
    </c:if>
    --%>
        <template:module view="hidden.metaUrls" node="${currentNode}"/>

</head>

<body>


<template:module view="hidden.searchmodal" node="${currentNode}"/>
<template:module view="hidden.loginmodal" node="${currentNode}"/>

<header>
    <c:if test="${! jcr:isNodeType(mainResourceNode, 'jcmix:hideMenu')}">
        <template:module view="hidden.topbar" node="${currentNode}"/>
    </c:if>
    <template:include view="hidden.nav"/>
</header>
<c:if test="${jcr;jcr:isNodeType(mainResourceNode, 'jcmix:mainClass')}">
    <c:set var="mainClass" value="${mainResourceNode.properties.mainClass.string}"/>
</c:if>

<main role="main" id="${mainResourceNode.name}"<c:if test="${! empty mainClass}">${' '}class="${fn:escapeXml(mainClass)}"</c:if>>

    <%--
    <template:include view="hidden.maincontent-removeme"/>
    --%>

    <template:area path="pagecontent"/>

</main>
<c:if test="${! jcr:isNodeType(mainResourceNode, 'jcmix:hideFooter')}">
<template:include view="hidden.footer"/>
</c:if>
</body>
</html>
