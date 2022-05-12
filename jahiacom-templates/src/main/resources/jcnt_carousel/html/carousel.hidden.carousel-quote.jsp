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

<c:set var="subLists" value="${jcr:getChildrenOfType(currentNode, 'jcnt:carouselItem,jnt:contentReference')}"/>

<section class="hideme bg-white">
    <div class="container">
        <div class="row">
            <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
            <c:if test="${! empty title}">
                <h2 class="text-center">${title}</h2>
            </c:if>
            <div class="carousel-multiple-items eq-height">
                <c:forEach items="${subLists}" var="droppableContent" varStatus="status">
                    <div class="c-item">
                        <template:module node="${droppableContent}" editable="true" view="hidden.carousel-quote"/>
                    </div>
                </c:forEach>
            </div>
        </div>
        <c:if test="${renderContext.editMode}">
                <template:module path="*" nodeTypes="jcnt:carouselItem"/>
        </c:if>
    </div>
</section>
