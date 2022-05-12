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
<c:set var="animate" value="${currentNode.properties.animate.boolean}"/>
<c:set var="backgroundColor" value="${currentNode.properties.backgroundColor.string}"/>
<c:if test="${empty backgroundColor}">
    <c:set var="backgroundColor" value="white"/>
</c:if>
<c:set var="isOpenDiv" value="false"/>
<section class="${animate ? 'hideme ' : ''}${backgroundColor eq 'white' ? ' bg-white' : ''} text-center">
    <div class="container">
        <c:forEach items="${jcr:getChildrenOfType(currentNode, 'jcnt:squareBox')}" var="squareBox" varStatus="status">
            <c:if test="${status.index mod 2 == 0}">
                <div class="row">
                <c:set var="isOpenDiv" value="true"/>
            </c:if>
            <div class="col-md-12 col-lg-6 p-0 px-1">
                <template:module node="${squareBox}" editable="true"/>
            </div>
            <c:if test="${status.index mod 2 == 1}">
                </div>
                <c:set var="isOpenDiv" value="false"/>
            </c:if>
        </c:forEach>
        <c:if test="${isOpenDiv}">
    </div>
    </c:if>
    <c:if test="${renderContext.editMode}">
        <template:module path="*" nodeTypes="jcnt:squareBox"/>
    </c:if>
    </div>
</section>