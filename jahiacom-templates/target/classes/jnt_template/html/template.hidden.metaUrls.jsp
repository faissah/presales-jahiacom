<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="jahiacom" uri="http://jahia.com/jahiacom/taglibs" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<c:set var="mainResourceNode" value="${renderContext.mainResource.node}"/>


<c:choose>
    <c:when test="${pageContext.request.serverPort == 80 || pageContext.request.serverPort == 443}">
        <c:set var="serverUrl" value="${pageContext.request.scheme}://${pageContext.request.serverName}"/>
    </c:when>
    <c:otherwise>
        <c:set var="serverUrl"
               value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}"/>
    </c:otherwise>
</c:choose>

<c:if test="${jcr:isNodeType(mainResourceNode, 'jcmix:canonicalURL')}">
    <c:set var="canonicalURL" value="${mainResourceNode.properties.canonicalURL.string}"/>
</c:if>
<c:if test="${empty canonicalURL || canonicalURL eq 'https://'}">
    <c:url var="currentPageUrl" value="${mainResourceNode.url}"/>
    <c:set var="canonicalURL" value="${serverUrl}${currentPageUrl}"/>
</c:if>
<link rel="canonical" href="${canonicalURL}">

<c:catch var="errorLanguages">
    <ui:initLangBarAttributes activeLanguagesOnly="${renderContext.liveMode}"/>
    <c:set var="languageCodes" value="${requestScope.languageCodes}"/>
    <c:if test="${fn:length(languageCodes)>1}">
        <c:set var="invalidLanguages" value=""/>
        <c:catch var="e">
            <c:if test="${! empty mainResourceNode.properties['j:invalidLanguages']}">
                <c:forEach items="${mainResourceNode.properties['j:invalidLanguages']}"
                           var="invalidLanguage">
                    <c:set var="invalidLanguages" value="${invalidLanguages} ${invalidLanguage.string}"/>
                </c:forEach>
            </c:if>
        </c:catch>
        <c:forEach var="languageCode" items="${languageCodes}">
            <c:if test="${! empty languageCode && ! fn:contains(invalidLanguages, languageCode) && languageCode != renderContext.mainResourceLocale.language}">
                <c:set var="hrefLangUrl"><jahiacom:hrefLangTag languageCode="${languageCode}"/></c:set>
                <c:url var="hrefLangUrl" value="${hrefLangUrl}" context="/"/>
                <link rel="alternate" hreflang="${languageCode}" href="${serverUrl}${hrefLangUrl}" />
            </c:if>
        </c:forEach>
    </c:if>
</c:catch>
