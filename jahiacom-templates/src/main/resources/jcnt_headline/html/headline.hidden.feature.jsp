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
<c:set var="imagePosition" value="${currentNode.properties.imagePosition.string}"/>
<c:set var="verticalAlign" value=" ${currentNode.properties.verticalAlign.string}"/>

<c:set var="imageContent">
    <%@ include file="imageContent.jspf" %>
</c:set>

<c:set var="textContent">
    <c:if test="${! empty title}">
        <h4>${title}</h4>
    </c:if>
    ${currentNode.properties.text.string}
    <template:include view="hidden.link">
        <template:param name="class" value="primary"/>
    </template:include>

    <c:forEach items="${jcr:getChildrenOfType(currentNode, 'jmix:droppableContent')}" var="droppableContent">
        <template:module node="${droppableContent}" editable="true"/>
    </c:forEach>

    <c:if test="${renderContext.editMode}">
        <template:module path="*" nodeTypes="jmix:droppableContent"/>
    </c:if>
</c:set>


<%--
// Use the "hideme" class to add an animation
<div class="row border-bottom py-5  img-icons hideme">
--%>
<div class="row border-bottom py-5  img-icons ">
    <div class="container justify-content-center">
        <div class="row ${verticalAlign}">
            <c:choose>
                <c:when test="${imagePosition eq 'left'}">
                    <div class="col-3 col-md-2">${imageContent}</div>
                    <div class="col-9 col-md-10">${textContent}</div>
                </c:when>
                <c:otherwise>
                    <div class="col-9 col-md-10 ">${textContent}</div>
                    <div class="col-3 col-md-2">${imageContent}</div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
</div>
