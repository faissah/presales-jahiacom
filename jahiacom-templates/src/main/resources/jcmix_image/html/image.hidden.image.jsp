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

<c:set var="imageNode" value="${currentNode.properties.image.node}"/>
<c:if test="${! empty imageNode}">
    <c:set var="className" value="${currentResource.moduleParams.class}"/>
    <c:set var="style" value="${currentResource.moduleParams.style}"/>
    <c:set var="figure" value="${currentResource.moduleParams.figure}"/>

    <c:if test="${! empty className}">
        <c:set var="classAttrib">${' '}class="${className}"</c:set>
    </c:if>
    <c:if test="${! empty style}">
        <c:set var="styleAttrib">${' '}style="${style}"</c:set>
    </c:if>

    <c:url var="imageUrl" value="${imageNode.url}" context="/"/>
    <c:set var="img">
        <img src="${imageUrl}" alt="${fn:escapeXml(imageNode.displayableName)}"${classAttrib}${styleAttrib}/>
    </c:set>

    <c:choose>
        <c:when test="${! empty figure}">
            <figure class="${figure}">
                ${img}
            </figure>
        </c:when>
        <c:otherwise>
            ${img}
        </c:otherwise>
    </c:choose>
</c:if>
