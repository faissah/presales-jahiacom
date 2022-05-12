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
<template:include view="hidden.header"/>
<div class="container">
    <div class="row">
        <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
        <c:if test="${! empty title}">
            <div class="page-header text-center">
                <h1>${title}</h1>
            </div>
        </c:if>

        <c:if test="${renderContext.editMode}">
            <template:module path="*" nodeTypes="jcnt:blogEntry"/>
        </c:if>

        <ul class="timeline">
            <c:forEach items="${moduleMap.currentList}" var="blogEntry" begin="${moduleMap.begin}" end="${moduleMap.end}" varStatus="status">
                <li class="${status.index mod 2 == 0 ? ' timeline-inverted' : ''}">
                    <template:module node="${blogEntry}" editable="true"/>
                </li>
            </c:forEach>
        </ul>
    </div>
</div>

<%--
<script>
    $(document).ready(function () {
        var my_posts = $("[rel=tooltip]");

        var size = $(window).width();
        for (i = 0; i < my_posts.length; i++) {
            the_post = $(my_posts[i]);

            if (the_post.hasClass('invert') && size >= 767) {
                the_post.tooltip({placement: 'left'});
                the_post.css("cursor", "pointer");
            } else {
                the_post.tooltip({placement: 'rigth'});
                the_post.css("cursor", "pointer");
            }
        }
    });
</script>
--%>