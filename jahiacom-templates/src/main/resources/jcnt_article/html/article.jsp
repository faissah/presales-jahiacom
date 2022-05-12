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

<c:set var="parentArticle" value="${jcr:getParentsOfType(currentNode, 'jcnt:article')}"/>

<c:set var="articleContent">
    <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
    <c:if test="${! empty title}">
        <h2>${title}</h2>
    </c:if>
    <div class="article">
            ${currentNode.properties.text.string}
    </div>
    <c:forEach items="${jcr:getChildrenOfType(currentNode, 'jmix:droppableContent')}" var="droppableContent">
        <template:module node="${droppableContent}" editable="true"/>
    </c:forEach>
    <c:if test="${renderContext.editMode}">
        <template:module path="*" nodeTypes="jmix:droppableContent"/>
    </c:if>
</c:set>


<c:choose>
    <c:when test="${fn:length(parentArticle) > 0}">
        ${articleContent}
    </c:when>
    <c:otherwise>
        <div class="entry-content">
            <section class="row">
                <div class="container">
                    ${articleContent}
                </div>
            </section>
        </div>
    </c:otherwise>
</c:choose>

