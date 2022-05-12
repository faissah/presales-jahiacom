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
<c:set var="displayFilters" value="${currentNode.properties.displayFilters.boolean}"/>
<div class="entry-content">
    <section class="row">
        <div class="container">
            <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
            <c:if test="${displayFilters || ! empty title}">

                <div class="border-bottom pb-3 d-flex justify-content-between align-items-center">
                    <c:if test="${! empty title}">
                        <h3>${title}</h3>
                    </c:if>
                    <c:if test="${displayFilters}">
                        <c:if test="${! empty title}">
                            <div></div>
                        </c:if>
                        <div>
                            <template:area areaAsSubNode="false" path="filter-${currentNode.identifier}"/>
                        </div>
                    </c:if>
                </div>
            </c:if>
            <!-- START FILTER GRID -->
            <div class="filter-grid">
                <%--
                <c:set var="displayFilters" value="${currentNode.properties.displayFilters.boolean}"/>
                <c:if test="${displayFilters}">
                    <ul class="nav nav-tabs nav-border-bottom border-primary ">
                        <li class="nav-item">
                            <a class="nav-link active" href="#all-customers">All Customers</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Industry</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Project type</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Location</a>
                        </li>

                        <li class="nav-item ml-auto">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control border-0" placeholder="Search customers"
                                       aria-label="Username" aria-describedby="basic-addon1">
                                <div class="input-group-append">
                                <span class="input-group-text border-0 bg-light" id="basic-addon1"><i
                                        class="fa fa-search primary"></i></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </c:if>
                --%>

                <c:forEach items="${moduleMap.currentList}" var="customer" begin="${moduleMap.begin}" end="${moduleMap.end}" varStatus="item">
                    <template:module node="${customer}" editable="true"/>
                </c:forEach>
                <c:if test="${renderContext.editMode}">
                    <template:module path="*" nodeTypes="jcnt:customer"/>
                </c:if>


            </div>
        </div>
    </section>
</div>