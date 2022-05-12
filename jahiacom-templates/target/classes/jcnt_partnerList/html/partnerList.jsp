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
<c:set var="displayPartnerTypes" value="${currentNode.properties.displayPartnerTypes.boolean}"/>
<c:set var="displayFilterArea" value="${currentNode.properties.displayFilterArea.boolean}"/>
<template:include view="hidden.header"/>
<div class="entry-content">
    <section class="row">
        <div class="container">
            <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
            <c:if test="${displayFilterArea || ! empty title}">

                <div class="border-bottom pb-3 d-flex justify-content-between align-items-center">
                    <c:if test="${! empty title}">
                        <h3>${title}</h3>
                    </c:if>
                    <c:if test="${displayFilterArea}">
                        <c:if test="${! empty title}">
                            <div></div>
                        </c:if>
                        <div>
                            <template:area areaAsSubNode="false" path="filter-${currentNode.identifier}"/>
                        </div>
                    </c:if>
                </div>
            </c:if>

            <c:forEach items="${moduleMap.currentList}" var="partner" begin="${moduleMap.begin}" end="${moduleMap.end}" varStatus="item">
                <template:module node="${partner}" editable="true">
                    <template:param name="displayPartnerTypes" value="${displayPartnerTypes}"/>
                </template:module>
            </c:forEach>
            <c:if test="${renderContext.editMode}">
                <template:module path="*" nodeTypes="jcnt:partner"/>
            </c:if>
        </div>
    </section>
    <template:area path="partners-${currentNode.name}" areaAsSubNode="false"/>
</div>