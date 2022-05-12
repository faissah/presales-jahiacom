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

<c:set var="className" value="${currentResource.moduleParams.class}"/>
<c:set var="style" value="${currentResource.moduleParams.style}"/>
<c:set var="icon" value="${currentResource.moduleParams.icon}"/>
<c:set var="iconAfter" value="${currentResource.moduleParams.iconAfter}"/>

<c:if test="${! empty className}">
    <c:set var="classAttrib">${' '}class="${className}"</c:set>
</c:if>
<c:if test="${! empty style}">
    <c:set var="styleAttrib">${' '}style="${style}"</c:set>
</c:if>
<c:if test="${! empty icon}">
    <c:set var="iconHtml">${' '}<i class="${icon}"></i>&nbsp;</c:set>
</c:if>

<c:if test="${! empty iconAfter}">
    <c:set var="iconAfterHtml">${'&nbsp;'}<i class="${iconAfter}"></i></c:set>
</c:if>

<c:set var="linkTitle" value="${currentNode.properties.linkTitle.string}"/>
<c:set var="linkType" value="${currentNode.properties.linkType.string}"/>
<c:set var="linkUrl" value="#"/>
<c:choose>
    <c:when test="${linkType eq 'internalLink'}">
        <c:set var="internalLinkNode" value="${currentNode.properties.internalLink.node}"/>
        <c:choose>
            <c:when test="${! empty internalLinkNode}">
                <c:url var="linkUrl" value="${internalLinkNode.url}" context="/"/>
                <c:if test="${empty linkTitle}">
                    <c:set var="linkTitle" value="${internalLinkNode.displayableName}"/>
                </c:if>
            </c:when>
            <c:otherwise>
                <c:if test="${renderContext.editMode}">
                <span class="badge badge-warning">
                    <fmt:message key="label.noUrl"/>
                </span>
                </c:if>
            </c:otherwise>
        </c:choose>
        <a href="${linkUrl}"${classAttrib}${styleAttrib}>${iconHtml}${linkTitle}</a>
    </c:when>
    <c:when test="${linkType eq 'externalLink'}">
        <c:url var="linkUrl" value="${currentNode.properties.externalLink.string}"/>
        <c:if test="${empty linkTitle}">
            <fmt:message key="label.readMore" var="linkTitle"/>
        </c:if>
        <c:if test="${(empty linkUrl or linkUrl eq 'http://') && renderContext.editMode}">
            <span class="badge badge-warning">
                <fmt:message key="label.noUrl"/>
            </span>
        </c:if>
        <a href="${linkUrl}"${classAttrib}${styleAttrib}>${iconHtml}${linkTitle}${iconAfterHtml}</a>
    </c:when>
</c:choose>
