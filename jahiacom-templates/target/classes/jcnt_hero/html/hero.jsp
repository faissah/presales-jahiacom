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
    <c:url var="imageUrl" value="${imageNode.url}" context="/"/>
</c:if>
<c:if test="${! empty imageUrl}">
    <c:set var="bgStyle">${' '}style="background-image:url(${imageUrl})"</c:set>
</c:if>
<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="subTitle" value="${currentNode.properties.subTitle.string}"/>
<c:set var="imageFilter" value=" ${currentNode.properties.imageFilter.string}"/>
<c:if test="${imageFilter eq 'none'}">
    <c:remove var="imageFilter"/>
</c:if>
<c:set var="verticalAlign" value=" ${currentNode.properties.verticalAlign.string}"/>
<c:set var="fullScreen" value="${currentNode.properties.fullScreen.string}"/>
<c:choose>
    <c:when test="${fullScreen eq 'true'}">
        <c:set var="fullScreenClass" value="hero-page fullsize"/>
    </c:when>
    <c:when test="${fullScreen eq 'small' || fullScreen eq 'tinny'}">
        <c:choose>
            <c:when test="${verticalAlign eq ' align-items-start'}">
                <c:set var="fullScreenClass" value="py-2-4"/>
            </c:when>
            <c:when test="${verticalAlign eq ' align-items-end'}">
                <c:set var="fullScreenClass" value="py-4-2"/>
            </c:when>
            <c:when test="${verticalAlign eq ' align-content-between'}">
                <c:remove var="fullScreenClass"/>
            </c:when>
            <c:when test="${fullScreen eq 'tinny'}">
                <c:set var="fullScreenClass" value="py-5"/>
            </c:when>
            <c:otherwise>
                <c:set var="fullScreenClass" value="py-6"/>
            </c:otherwise>
        </c:choose>

    </c:when>
    <c:otherwise>
        <c:choose>
            <c:when test="${verticalAlign eq ' align-items-start'}">
                <c:set var="fullScreenClass" value="hero-page py-3-7"/>
            </c:when>
            <c:when test="${verticalAlign eq ' align-items-end'}">
                <c:set var="fullScreenClass" value="hero-page py-7-3"/>
            </c:when>
            <c:when test="${verticalAlign eq ' align-items-end'}">
                <c:set var="fullScreenClass" value="hero-page py-7-3"/>
            </c:when>
            <c:when test="${verticalAlign eq ' align-content-between'}">
                <c:remove var="fullScreenClass"/>
            </c:when>
            <c:otherwise>
                <c:set var="fullScreenClass" value="hero-page py-10"/>
            </c:otherwise>
        </c:choose>
    </c:otherwise>
</c:choose>

<c:set var="textAlign" value=" ${currentNode.properties.textAlign.string}"/>
<c:set var="textColor" value=" ${currentNode.properties.textColor.string}"/>

<c:set var="imagePosition" value="${currentNode.properties.imagePosition.string}"/>
<c:if test="${imagePosition ne 'center'}">
    <c:set var="imagePositionValue">;background-position:${imagePosition}</c:set>
</c:if>

<c:set var="imageEffect" value="${currentNode.properties.imageEffect.string}"/>
<c:if test="${imageEffect eq 'none' || renderContext.editMode}">
    <c:remove var="imageEffect"/>
</c:if>

<c:choose>
    <c:when test="${imageEffect eq 'parallax'}">
        <c:set var="imageEffectClass" value=" parallax-window"/>
        <c:set var="imageAttrib">${' '}data-parallax="scroll" data-image-src="${imageUrl}"</c:set>
    </c:when>
    <c:when test="${imageEffect eq 'zoom-in'}">
        <c:set var="imageEffectClass" value=" zoom-in"/>
        <c:set var="imageAttrib">${' '}style="background-image:url(${imageUrl})${imagePositionValue}</c:set>
    </c:when>
    <c:otherwise>
        <c:set var="imageAttrib">${' '}style="background-image:url(${imageUrl})${imagePositionValue}</c:set>
    </c:otherwise>
</c:choose>


<section class="${fullScreenClass} d-flex ${imageFilter} ${textAlign ne ' text-right' ? textAlign : ''} ${verticalAlign} ${textColor} ${imageEffectClass} size-${fullScreen}" ${imageAttrib}">
    <div class="container">
        <div class="row">
            <c:choose>
                <c:when test="${textAlign eq ' text-right'}">
                    <c:set var="colClass" value="col-md-6 offset-md-5"/>
                </c:when>
                 <c:when test="${textAlign eq ' text-middle'}">
                    <c:set var="colClass" value="col-md-6 offset-md-3"/>
                </c:when>
                <c:when test="${textAlign eq ' text-left'}">
                    <c:set var="colClass" value="col-12 col-sm-8 offset-md-1"/>
                </c:when>
                <c:otherwise>
                    <c:set var="colClass" value="col"/>
                </c:otherwise>
            </c:choose>
            <c:if test="${verticalAlign eq ' align-content-between'}">
                <c:set var="colClass" value="${colClass} d-flex flex-column align-content-between size-${fullScreen}-alt "/>
                <c:set var="hClass">class="mb-auto"</c:set>
            </c:if>

            <div class="${colClass}">
                <c:if test="${! empty title}">
                    <c:choose>
                        <c:when test="${fullScreen eq 'small'}">
                            <h2 ${hClass}>${title}</h2>
                        </c:when>
                        <c:otherwise>
                            <h1 ${hClass}>${title}</h1>
                        </c:otherwise>
                    </c:choose>

                </c:if>
                <c:if test="${! empty subTitle}">
                    <p class="lead-text pt-4">${subTitle}</p>
                </c:if>
                <c:forEach items="${jcr:getChildrenOfType(currentNode, 'jmix:droppableContent')}"
                           var="droppableContent">
                    <template:module node="${droppableContent}" editable="true"/>
                </c:forEach>
                <c:if test="${renderContext.editMode}">
                    <template:module path="*" nodeTypes="jmix:droppableContent"/>
                </c:if>

            </div>
        </div>
    </div>
</section>
