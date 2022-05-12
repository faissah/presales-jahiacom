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
<div class="timeline-badge primary"><a href="${blogUrl}"><i class="fas fa-circle white fz-08" rel="tooltip"
                                          title="${fn:escapeXml(title)}" id="blog-${currentNode.identifier}"></i></a></div>


<c:set var="authorNode" value="${currentNode.properties.author.node}"/>
<c:if test="${! empty authorNode}">
    <c:set var="authorName" value="${authorNode.properties.name.string}"/>
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


<div class="timeline-panel">
    <div class="timeline-heading">
        <template:include view="hidden.image">
            <template:param name="class" value="img-responsive"/>
        </template:include>
    </div>
    <div class="timeline-body bg-white">
        <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
        <c:if test="${! empty title}">
            <h5>${title}</h5>
        </c:if>
        <div class="meta d-inline-flex pl-4 text-secondary fz-08">
            <div class="pr-4"><i class="far fa-calendar-alt"></i>
                ${formatedDate}
            </div>
            <c:if test="${! empty authorName}">
                <div><i class="fas fa-user"></i> ${authorName}</div>
            </c:if>
        </div>
        <c:set var="summary" value="${currentNode.properties.summary.string}"/>
        <c:choose>
            <c:when test="${! empty summary}">
                <p>${summary}</p>
            </c:when>
            <c:otherwise>
                <p>${functions:abbreviate(functions:removeHtmlTags(currentNode.properties.text.string),400,450,'...')}</p>
            </c:otherwise>
        </c:choose>
    </div>

    <div class="timeline-footer">
        <%--<a><i class="glyphicon glyphicon-thumbs-up"></i></a>
        <a><i class="glyphicon glyphicon-share"></i></a>--%>
        <a href="${blogUrl}" class="primary"><fmt:message key="label.readMore"/></a>
    </div>
</div>
