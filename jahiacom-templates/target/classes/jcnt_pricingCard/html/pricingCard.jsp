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
<c:set var="summary" value="${currentNode.properties.summary.string}"/>
<c:set var="text" value="${currentNode.properties.text.string}"/>
<c:set var="prefix" value="${currentNode.properties.prefix.string}"/>
<c:set var="price" value="${currentNode.properties.price.string}"/>
<c:set var="currency" value="${currentNode.properties.currency.string}"/>
<c:set var="periode" value="${currentNode.properties.periode.string}"/>


<div class="card card-pricing text-center">
    <div class="card-header">${title}</div>
    <div class="card-body">
        <c:if test="${! empty summary}">
            <div class="mb-4" style="border-left: 3px solid #00A1E3;">
                <div class="text-left ml-3">
                    ${summary}
                </div>
            </div>
        </c:if>
        <div class="price">
            <c:if test="${! empty prefix}">
                <div class="price-prepend">${prefix}</div>
            </c:if>
            <c:if test="${! empty price}">
                <div class="price-amount">
                    <c:if test="${! empty currency}">
                        <sup>${currency}</sup>
                    </c:if>
                    ${price}
                </div>
            </c:if>
            <c:if test="${! empty periode}">
                <div class="price-append">${periode}</div>
            </c:if>

        </div>
        ${text}
        <template:area areaAsSubNode="true" path="more"/>
    </div>

    <div class="card-footer">
        <template:area areaAsSubNode="true" path="buttons"/>
    </div>
</div>
