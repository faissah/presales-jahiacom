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

<section class="bg-white">
    <div class="container">
        <div class="row">

            <div class="col-lg-3 col-md-4 col-sm-6">
                <template:include view="hidden.image">
                    <template:param name="class" value="thumbnail"/>
                    <template:param name="figure" value="figure-gray figure-square d-flex align-items-center"/>
                </template:include>
            </div>
            <div class="col-lg-9 col-md-8 col-sm-6">
                <h2>${currentNode.displayableName}</h2>
                <div class="w-100 border-bottom pb-3 mb-3"></div>

                <template:include view="hidden.link">
                    <template:param name="class" value="gris"/>
                    <template:param name="icon" value="fas fa-home fa-fw"/>
                </template:include>

                <c:set var="countries" value="${currentNode.properties['countries']}"/>
                <c:set var="countriesCount" value="${fn:length(countries)}"/>
                <c:if test="${countriesCount > 0}">
                    <p><i class="fas fa-map-marker gris fa-fw"></i>
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
                <c:if test="${jcr:isNodeType(currentNode, 'jcnt:partner')}">
                    <c:set var="displayPartnerTypes" value="${currentResource.moduleParams.displayPartnerTypes}"/>
                    <c:if test="${displayPartnerTypes eq 'true'}">
                        <c:set var="partnerType" value="${currentNode.properties.partnerType.node}"/>
                        <c:if test="${! empty partnerType}">
                            <p><i class="fas fa-certificate gris"></i> ${partnerType.displayableName}</p>
                        </c:if>

                    </c:if>
                    <c:set var="partnerType" value="${currentNode.properties.partnerType.node}"/>
                    <c:if test="${! empty partnerType}">
                        <p><i class="fas fa-certificate gris"></i> ${partnerType.displayableName}</p>
                    </c:if>

                </c:if>
                <c:if test="${jcr:isNodeType(currentNode, 'jcnt:customer')}">
                    <c:set var="industries" value="${currentNode.properties['industries']}"/>
                    <c:set var="industriesCount" value="${fn:length(industries)}"/>
                    <c:if test="${industriesCount > 0}">
                        <p><i class="fas fa-bullseye gris fa-fw"></i>
                            <c:forEach var="industry" items="${industries}" varStatus="status">
                                <c:if test="${! status.first}">, </c:if>
                                ${industry.node.displayableName}
                            </c:forEach>
                        </p>
                    </c:if>

                    <c:set var="partnerNode" value="${currentNode.properties.partner.node}"/>
                    <c:if test="${! empty partnerNode}">
                        <c:url var="partnerUrl" value="${partnerNode.url}" context="/"/>
                        <p><i class="fas fa-certificate gris fa-fw"></i> <a href="${partnerUrl}">${partnerNode.displayableName}</a></p>
                    </c:if>

                    <c:set var="projectTypes" value="${currentNode.properties['projectType']}"/>
                    <c:set var="projectTypeCount" value="${fn:length(projectTypes)}"/>
                    <c:if test="${projectTypeCount > 0}">
                        <p><i class="fas fa-project-diagram gris fa-fw"></i>
                            <c:forEach var="projectType" items="${projectTypes}" varStatus="status">
                                <c:if test="${! status.first}">, </c:if>
                                ${projectType.node.displayableName}
                            </c:forEach>
                        </p>
                    </c:if>

                </c:if>

                <div class="w-100 border-bottom pb-3 mb-3"></div>

                ${currentNode.properties.text.string}
                ${currentNode.properties.readMoreText.string}
            </div>
        </div>
    </div>
</section>
