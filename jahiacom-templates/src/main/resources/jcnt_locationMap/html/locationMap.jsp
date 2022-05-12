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

<section class="bg-white">
    <div class="container">
        <c:if test="${! empty title}">
            <h2>${title}</h2>
        </c:if>

        <div class="map-canvas map-canvas d-none d-lg-block">
            <div class="pop" id="toronto">Toronto</div>
            <div class="pop pop-left" id="boston">Boston</div>
            <div class="pop" id="paris">Paris</div>
            <div class="pop pop-top" id="geneva">Geneva</div>
            <div class="pop pop-left" id="velden">Velden</div>
            <img src="${url.currentModule}/images/map-sample.jpg" alt="Map Contacts">
        </div>
        <template:area path="offices" areaAsSubNode="true" nodeTypes="jcnt:cards" listLimit="1"/>
    </div>
</section>
