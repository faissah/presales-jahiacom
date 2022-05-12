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
<c:set var="text" value="${currentNode.properties.text.string}"/>
<c:set var="heading" value="${currentNode.properties.heading.string}"/>
<c:set var="expanded" value="${currentNode.properties.expanded.boolean}"/>


<${heading}><a data-toggle="collapse" href="#collapse-${currentNode.identifier}" role="button" aria-expanded="false" aria-controls="collapse-${currentNode.identifier}">${currentNode.displayableName} <i class="fas fa-angle-down"></i><i class="fas fa-angle-up"></i></a></${heading}>
<div class="collapse${expanded  ? ' in':''}" id="collapse-${currentNode.identifier}">
    ${text}
    <template:area path="collapse" areaAsSubNode="true"/>
</div>
