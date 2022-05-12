<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.Locale" %>
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
<c:set var="language" value="${renderContext.mainResourceLocale.language}"/>
<c:url var="detailUrl" value="${currentNode.url}" context="/"/>

<div class="filter-grid-item row">

    <div class="d-flex justify-content-end d-none d-sm-block">
        <a href="${detailUrl}" target="_blank" class="pl-4 float-right text-black-10 pr-3" data-toggle="tooltip"
           data-placement="top" title="Direct access"><i class="fas fa-hashtag"></i> <span class="sr-only">Direct access</span></a>
    </div>



    <div class="col-lg-3 col-md-4 col-sm-6">
        <template:include view="hidden.image">
            <template:param name="class" value="thumbnail"/>
            <template:param name="figure" value="figure-gray figure-square d-flex align-items-center"/>
        </template:include>
    </div>
    <div class="col-lg-9 col-md-8 col-sm-6">
        <h4>${currentNode.displayableName}</h4>

        <c:set var="countries" value="${currentNode.properties.countries}"/>
        <c:set var="countriesCount" value="${fn:length(countries)}"/>
        <c:if test="${countriesCount > 0}">
            <p><i class="fa fa-map-marker gris"></i>
                    <c:forEach items="${countries}" var="country" varStatus="status">
                        <c:if test="${! status.first}">, </c:if>
                        <c:set var="countryCode" value="${country.string}"/>
                        <%
                            String countryCode = (String) pageContext.findAttribute("countryCode");
                            Locale l = new Locale((String) pageContext.findAttribute("language"), countryCode);
                            String countryName = l.getDisplayCountry(l);
                            pageContext.setAttribute("countryName", countryName);
                        %>
                        ${countryName}
                    </c:forEach>
            </p>
        </c:if>
        <c:set var="linkType" value="${currentNode.properties.linkType.string}"/>
        <c:if test="${linkType ne 'noLink'}">
            <p>
            <template:include view="hidden.link">
                <template:param name="class" value="gris"/>
                <template:param name="icon" value="fa fa-home"/>
            </template:include>
            </p>
        </c:if>
        <c:if test="${jcr:isNodeType(currentNode, 'jcnt:partner')}">
            <c:set var="displayPartnerTypes" value="${currentResource.moduleParams.displayPartnerTypes}"/>

            <c:if test="${displayPartnerTypes eq 'true'}">
                <c:set var="partnerType" value="${currentNode.properties.partnerType.node}"/>
                <c:if test="${! empty partnerType}">
                    <p><i class="fas fa-certificate gris"></i> ${partnerType.displayableName}</p>
                </c:if>

            </c:if>
        </c:if>

        ${currentNode.properties.text.string}

        <c:choose>
            <c:when test="${jcr:isNodeType(currentNode, 'jcnt:customer')}">
                <c:if test="${jcr:isNodeType(currentNode, 'jcmix:readMore')}">
                    <template:include view="readMoreMix" />
                </c:if>
            </c:when>
            <c:otherwise>
                <a href="${detailUrl}" class="primary"><fmt:message key="label.readMore"/></a>
            </c:otherwise>
        </c:choose>
    </div>
</div>
