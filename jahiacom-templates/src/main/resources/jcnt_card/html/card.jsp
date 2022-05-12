<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="uiComponents" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="search" uri="http://www.jahia.org/tags/search" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<%--@elvariable id="moduleMap" type="java.util.Map"--%>
<c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
<c:set var="subTitle" value="${currentNode.properties.subTitle.string}"/>
<c:set var="text" value="${currentNode.properties.text.string}"/>
<c:set var="color" value="${currentNode.properties.color.string}"/>

<div class="card h-100 ${color eq 'blue' ? ' bg-jahia white' : ''}">
    <div class="card-body">
        <c:if test="${! empty title}">
            <h5 class="card-title">${title}</h5>
        </c:if>
        <c:if test="${! empty subTitle}">
            <h6 class="card-subtitle mb-2 text-muted">${subTitle}</h6>
        </c:if>
        <div class="card-text">${text}</div>
    </div>
</div>