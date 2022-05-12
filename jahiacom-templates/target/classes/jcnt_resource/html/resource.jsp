<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="java.util.GregorianCalendar" %>
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
<fmt:setLocale value="${language}" scope="session"/>

<c:set var="resourceType" value="${currentNode.properties.resourceType.string}"/>

<c:set var="resourceDate" value="${currentNode.properties['date']}"/>

<c:choose>
    <c:when test="${language eq 'fr'}">
        <fmt:formatDate value="${resourceDate.time}" pattern="d MMMM yyyy" var="formatedResourceDate"/>
    </c:when>
    <c:otherwise>
        <fmt:formatDate value="${resourceDate.time}" pattern="MMMM d, yyyy" var="formatedResourceDate"/>
    </c:otherwise>
</c:choose>
<c:choose>
    <c:when test="${resourceType eq 'analystReport'}">
        <c:set var="themeColor" value=" border-danger"/>
    </c:when>
    <c:when test="${resourceType eq 'whitePaper'}">
        <c:set var="themeColor" value=" border-success"/>
    </c:when>
    <%--
    <c:when test="${resourceType eq 'downloads'}">
        <c:set var="themeColor" value=" border-success"/>
    </c:when>
    --%>
    <%--
    <c:when test="${resourceType eq 'event'}">
        <c:set var="themeColor" value=" border-danger"/>
    </c:when>
    --%>
    <%--
    <c:when test="${resourceType eq 'job'}">
        <c:set var="themeColor" value=" border-warning"/>
    </c:when>
    --%>
    <c:when test="${resourceType eq 'successStory'}">
        <c:set var="themeColor" value=" border-warning"/>
    </c:when>
    <c:when test="${resourceType eq 'documentation'}">
        <c:set var="themeColor" value=" border-primary"/>
    </c:when>
    <c:when test="${resourceType eq 'product'}">
        <c:set var="themeColor" value=" border-purple"/>
    </c:when>
    <%--
    <c:when test="${resourceType eq 'training'}">
        <c:set var="themeColor" value=" border-purple"/>
    </c:when>
    --%>
    <%--
    <c:otherwise>
        <c:set var="themeColor" value=" border-primary"/>
    </c:otherwise>
    --%>
</c:choose>

<c:url var="detailUrl" value="${currentNode.url}" context="/"/>
<c:set var="imageNode" value="${currentNode.properties.image.node}"/>

<div class="filter-grid-item row bg-white">
    <div class="d-flex justify-content-end">
        <a href="${detailUrl}" target="_blank" class="pl-4 float-right text-black-10" data-toggle="tooltip"
           data-placement="top" title="Direct access"><i class="fas fa-hashtag"></i> <span class="sr-only">Direct access</span></a>
    </div>
    <c:choose>
    <c:when test="${! empty imageNode}">
    <div class="col-lg-3 col-md-4 col-sm-3">
        <template:include view="hidden.image">
            <template:param name="class" value="thumbnail"/>
            <template:param name="figure" value="figure-gray figure-square ${themeColor} d-flex align-items-center"/>
        </template:include>
    </div>
    <div class="col-lg-9 col-md-8 col-sm-7">
        </c:when>
        <c:otherwise>
        <div class="col-md-12">
            </c:otherwise>
            </c:choose>
            <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
            <c:if test="${! empty title}">
                <h4>${title}</h4>
            </c:if>

            <div class="d-flex flex-row gris fz-08">
                <%--
                <c:if test="${! empty resourceType}">
                    <p><i class="fa fa-map-marker gris"></i> <fmt:message key="jcnt_resource.resourceType.${resourceType}"/> </p>
                </c:if>
                --%>
                <c:if test="${resourceType ne 'documentation' && resourceType ne 'downloads'  && resourceType ne 'product'}">

                    <c:choose>
                        <c:when test="${jcr:isNodeType(currentNode, 'jcmix:job')}">
                            <c:set var="startDate" value="${currentNode.properties['startDate']}"/>
                            <c:set var="startDateDate" value="${currentNode.properties['startDate'].date}"/>

                            <c:if test="${! empty startDate}">

                                <%
                                    GregorianCalendar now = new GregorianCalendar();
                                    GregorianCalendar startDate = (GregorianCalendar) pageContext.findAttribute("startDateDate");
                                    if (now.compareTo(startDate) > 0) {
                                %><fmt:message key="jcmix_job.startDate.immediately" var="dateValue"/><%
                            } else {
                            %>
                                <c:choose>
                                    <c:when test="${language eq 'fr'}">
                                        <fmt:formatDate value="${startDate.time}" pattern="d MMMM yyyy"
                                                        var="dateValue"/>
                                    </c:when>
                                    <c:otherwise>
                                        <fmt:formatDate value="${startDate.time}" pattern="MMMM d, yyyy"
                                                        var="dateValue"/>
                                    </c:otherwise>
                                </c:choose>
                                <%
                                    }
                                %>
                                <div class="pr-4"><i class="far fa-calendar gris"></i> ${dateValue}</div>
                            </c:if>
                            <c:set var="location" value="${currentNode.properties.location.string}"/>
                            <c:if test="${! empty location}">
                                <div class="pr-4"><i class="fas fa-map-marker-alt gris"></i> ${location}</div>
                            </c:if>

                        </c:when>
                        <c:when test="${resourceType eq 'training' || resourceType eq 'event'}">
                            <c:set var="eventType" value="${currentNode.properties.eventType.string}"/>
                            <c:if test="${! empty eventType}">
                                <div class="pr-4"><i class="fas fa-map-marker-alt gris"></i> <fmt:message
                                        key="jcmix_training.eventType.${eventType}"/></div>
                            </c:if>
                            <c:set var="duration" value="${currentNode.properties.duration.string}"/>
                            <c:choose>
                                <c:when test="${! empty duration}">
                                    <div class="pr-4"><i class="fas fa-calendar gris"></i> ${duration}</div>
                                </c:when>
                                <c:otherwise>
                                    <c:set var="startDate" value="${currentNode.properties['startDate']}"/>
                                    <c:set var="endDate" value="${currentNode.properties['endDate']}"/>
                                    <fmt:formatDate value="${startDate.time}" pattern="d" var="startDay"/>
                                    <fmt:formatDate value="${endDate.time}" pattern="d" var="endDay"/>
                                    <fmt:formatDate value="${startDate.time}" pattern="MMMM" var="startMonth"/>
                                    <fmt:formatDate value="${endDate.time}" pattern="MMMM" var="endMonth"/>
                                    <fmt:formatDate value="${startDate.time}" pattern="yyyy" var="startYear"/>
                                    <fmt:formatDate value="${endDate.time}" pattern="yyyy" var="endYear"/>
                                    <c:choose>
                                        <c:when test="${startDay eq endDay}">
                                            <c:choose>
                                                <c:when test="${language eq 'fr'}">
                                                    <fmt:formatDate value="${startDate.time}" pattern="d MMMM yyyy"
                                                                    var="formatedStartDate"/>
                                                </c:when>
                                                <c:otherwise>
                                                    <fmt:formatDate value="${startDate.time}" pattern="MMMM d, yyyy"
                                                                    var="formatedStartDate"/>
                                                </c:otherwise>
                                            </c:choose>
                                            <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedStartDate}</div>
                                        </c:when>
                                        <c:when test="${startMonth eq endMonth}">
                                            <c:choose>
                                                <c:when test="${language eq 'fr'}">
                                                    <fmt:formatDate value="${startDate.time}" pattern="d"
                                                                    var="formatedStartDate"/>
                                                    <fmt:formatDate value="${endDate.time}" pattern="d MMMM yyyy"
                                                                    var="formatedEndDate"/>
                                                    <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedStartDate}
                                                        - ${formatedEndDate}</div>
                                                </c:when>
                                                <c:otherwise>
                                                    <fmt:formatDate value="${startDate.time}" pattern="MMMM d"
                                                                    var="formatedStartDate"/>
                                                    <fmt:formatDate value="${endDate.time}" pattern="d, yyyy"
                                                                    var="formatedEndDate"/>
                                                    <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedStartDate}
                                                        - ${formatedEndDate}</div>
                                                </c:otherwise>
                                            </c:choose>
                                        </c:when>
                                        <c:otherwise>
                                            <c:choose>
                                                <c:when test="${language eq 'fr'}">
                                                    <fmt:formatDate value="${startDate.time}" pattern="d MMMM yyyy"
                                                                    var="formatedStartDate"/>
                                                    <fmt:formatDate value="${endDate.time}" pattern="d MMMM yyyy"
                                                                    var="formatedEndDate"/>
                                                    <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedStartDate}
                                                        - ${formatedEndDate}</div>
                                                </c:when>
                                                <c:otherwise>
                                                    <fmt:formatDate value="${startDate.time}" pattern="MMMM d, yyyy"
                                                                    var="formatedStartDate"/>
                                                    <fmt:formatDate value="${endDate.time}" pattern="MMMM d, yyyy"
                                                                    var="formatedEndDate"/>
                                                    <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedStartDate}
                                                        - ${formatedEndDate}</div>
                                                </c:otherwise>
                                            </c:choose>
                                        </c:otherwise>
                                    </c:choose>
                                </c:otherwise>
                            </c:choose>
                            <c:set var="location" value="${currentNode.properties.location.string}"/>
                            <c:if test="${! empty location}">
                                <div class="pr-4"><i class="fas fa-map-marker-alt gris"></i> ${location}</div>
                            </c:if>
                        </c:when>
                        <c:otherwise>
                            <c:if test="${! empty formatedResourceDate}">
                                <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedResourceDate}</div>
                            </c:if>

                        </c:otherwise>
                    </c:choose>

                </c:if>
            </div>
            <c:set var="summary" value="${currentNode.properties.summary.string}"/>
            <c:choose>
                <c:when test="${! empty summary}">
                    ${summary}
                </c:when>
                <c:otherwise>
                    ${currentNode.properties.text.string}
                </c:otherwise>
            </c:choose>

            <c:set var="linkType" value="${currentNode.properties.linkType.string}"/>
            <c:choose>
                <c:when test="${linkType eq 'noLink'}">
                    <%-- go to the detail page --%>
                    <c:set var="linkTitle" value="${currentNode.properties.linkTitle.string}"/>
                    <c:if test="${empty linkTitle}">
                        <fmt:message key="label.readMore" var="linkTitle"/>
                    </c:if>
                    <a href="${detailUrl}" class="primary">${linkTitle}</a>
                </c:when>
                <c:otherwise>
                    <template:include view="hidden.link">
                        <template:param name="class" value="primary"/>
                    </template:include>
                </c:otherwise>
            </c:choose>

        </div>
    </div>
