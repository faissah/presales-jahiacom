<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<c:url var="blogUrl" value="${currentNode.url}" context="/"/>
<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>

<c:set var="authorNode" value="${currentNode.properties.author.node}"/>
<c:if test="${! empty authorNode}">
    <c:set var="authorName" value="${authorNode.properties.name.string}"/>
    <c:set var="authorBio" value="${authorNode.properties.text.string}"/>
    <c:set var="authorImage" value="${authorNode.properties.image.node}"/>
</c:if>
<c:set var="language" value="${renderContext.mainResourceLocale.language}"/>
<fmt:setLocale value="${language}" scope="session"/>
<c:set var="blogDate" value="${currentNode.properties['date']}"/>

<c:if test="${empty timeZone}">
    <c:set var="timeZone" value="ETC"/>
</c:if>
<fmt:setTimeZone value="${timeZone}"/>
<c:choose>
    <c:when test="${language eq 'fr'}">
        <fmt:formatDate value="${blogDate.time}" pattern="d MMMM yyyy" var="formatedDate"/>
    </c:when>
    <c:otherwise>
        <fmt:formatDate value="${blogDate.time}" pattern="MMMM d, yyyy" var="formatedDate"/>
    </c:otherwise>
</c:choose>


<div class="entry-content">
    <section class="container">
        <div class="row justify-content-md-center">
            <div class="col-md-8 col-sm-12 blog">
                <c:if test="${currentNode.properties.displayImageOnDetail.boolean}">
                    <template:include view="hidden.image">
                        <template:param name="class" value="img-responsive"/>
                    </template:include>
                </c:if>

                <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
                <c:if test="${! empty title}">
                    <h1>${title}</h1>
                </c:if>
                <div class="article">

                    <div class="meta d-inline-flex pl-4 text-secondary fz-08">
                        <div class="pr-4"><i class="far fa-calendar-alt"></i>
                            ${formatedDate}
                        </div>
                        <c:if test="${! empty authorName}">
                            <div><i class="fas fa-user"></i> ${authorName}</div>
                        </c:if>
                    </div>
                    ${currentNode.properties.text.string}
                    <c:if test="${! empty authorName && authorName ne 'Jahia Team'}">
                        <div class="w-100 border-bottom pb-3 mb-5"></div>
                        <div class="media">
                            <c:if test="${! empty authorImage}">
                                <c:url var="authorImageUrl" value="${authorImage.url}" context="/"/>
                                <img src="${authorImageUrl}" class="rounded-circle col-md-2 mr-3" alt="${fn:escapeXml(authorName)}">
                            </c:if>

                            <div class="media-body text-secondary">
                                <h5 class="mt-0">Author : ${authorName}</h5>
                                ${authorBio}
                            </div>
                        </div>
                    </c:if>

                    <template:area path="blogMore" areaAsSubNode="true"/>
                </div>
            </div>

        </div>

        <c:set var="parentPage" value="${jcr:getParentOfType(currentNode, 'jnt:page')}"/>
        <c:url var="parentPageUrl" value="${parentPage.url}" context="/"/>
        <a href="${parentPageUrl}" class="primary"><i class="fas fa-arrow-left"></i> <fmt:message key="label.back"/></a>

    </section>
</div>
