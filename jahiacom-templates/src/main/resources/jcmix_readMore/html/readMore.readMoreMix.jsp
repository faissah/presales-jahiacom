<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<c:if test="${jcr:isNodeType(currentNode, 'jcmix:readMore')}">
    <c:set var="readMoreExpendButton" value="${fn:escapeXml(currentNode.properties.readMoreExpendButton.string)}"/>
    <c:set var="readMoreCollapsButton" value="${fn:escapeXml(currentNode.properties.readMoreCollapsButton.string)}"/>
    <c:set var="readMoreText" value="${currentNode.properties.readMoreText.string}"/>
    <c:set var="readMorelayout" value="${currentNode.properties.readMorelayout.string}"/>
    <c:if test="${empty readMorelayout}">
        <c:set var="readMorelayout" value="default"/>
    </c:if>

    <c:if test="${empty readMoreExpendButton}">
        <fmt:message var="readMoreExpendButton" key="jcmix_readMore.readMoreExpendButton"/>
    </c:if>
    <c:if test="${empty readMoreCollapsButton}">
        <fmt:message var="readMoreCollapsButton" key="jcmix_readMore.readMoreCollapsButton"/>
    </c:if>


    <div id="more-${currentNode.identifier}" class="accordion-body collapse">
        <div class="accordion-inner">
                ${readMoreText}
        </div>
    </div>

    <a class="more-${currentNode.identifier} clearfix ${readMorelayout eq 'button' ? ' button button-medium button-rounded button-default':''} closed primary"  data-toggle="collapse" data-target="#more-${currentNode.identifier}" href="#more-${currentNode.identifier}">${readMoreExpendButton}</a>



    <script>
        $(document).ready(function() {
            $('.more-${currentNode.identifier}').click(function(){
                var $this = $(this);
                $this.toggleClass('closed');
                if($this.hasClass('closed')){
                    $this.html('${readMoreExpendButton}').text();
                } else {
                    $this.html('${readMoreCollapsButton}').text();
                }
            });
        })
    </script>
</c:if>