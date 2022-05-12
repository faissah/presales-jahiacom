<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="java.util.Date" %>
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
<c:set var="timeZone" value="${currentNode.properties['timeZone'].string}"/>

<c:if test="${empty timeZone}">
    <c:set var="timeZone" value="ETC"/>
</c:if>
<fmt:setTimeZone value="${timeZone}"/>
<c:choose>
    <c:when test="${language eq 'fr'}">
        <fmt:formatDate value="${resourceDate.time}" pattern="d MMMM yyyy" var="formatedResourceDate"/>
    </c:when>
    <c:otherwise>
        <fmt:formatDate value="${resourceDate.time}" pattern="MMMM d, yyyy" var="formatedResourceDate"/>
    </c:otherwise>
</c:choose>
<c:url var="detailUrl" value="${currentNode.url}" context="/"/>
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

<section class="entry-content">
    <div class="container">
        <c:set var="title" value="${currentNode.properties['jcr:title'].string}"/>
        <c:if test="${! empty title}">
            <div class="row text-center ">
                <div class="col-md-12 pb-5 blog">
                    <h1>${title}</h1>
                </div>
            </div>
        </c:if>


        <c:set var="mainColContent">
            <c:set var="largeImageNode" value="${currentNode.properties.largeImage.node}"/>
            <c:choose>
                <c:when test="${empty largeImageNode}">
                    <c:set var="imageNode" value="${currentNode.properties.image.node}"/>
                    <c:if test="${! empty imageNode}">
                        <template:include view="hidden.image"/>
                    </c:if>
                </c:when>
                <c:otherwise>
                    <c:url var="imageUrl" value="${largeImageNode.url}" context="/"/>
                    <img src="${imageUrl}"  class="img-fluid mb-4" alt=""/>
                </c:otherwise>
            </c:choose>
            <c:if test="${resourceType ne 'documentation' || resourceType ne 'downloads'}">

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
                                                <fmt:formatDate value="${startDate.time}"
                                                                pattern="d MMMM yyyy"
                                                                var="formatedStartDate"/>
                                            </c:when>
                                            <c:otherwise>
                                                <fmt:formatDate value="${startDate.time}"
                                                                pattern="MMMM d, yyyy"
                                                                var="formatedStartDate"/>
                                            </c:otherwise>
                                        </c:choose>
                                        <div class="pr-4"><i
                                                class="far fa-calendar gris"></i> ${formatedStartDate}</div>
                                    </c:when>
                                    <c:when test="${startMonth eq endMonth}">
                                        <c:choose>
                                            <c:when test="${language eq 'fr'}">
                                                <fmt:formatDate value="${startDate.time}" pattern="d"
                                                                var="formatedStartDate"/>
                                                <fmt:formatDate value="${endDate.time}"
                                                                pattern="d MMMM yyyy"
                                                                var="formatedEndDate"/>
                                                <div class="pr-4"><i
                                                        class="far fa-calendar gris"></i> ${formatedStartDate}
                                                    - ${formatedEndDate}</div>
                                            </c:when>
                                            <c:otherwise>
                                                <fmt:formatDate value="${startDate.time}" pattern="MMMM d"
                                                                var="formatedStartDate"/>
                                                <fmt:formatDate value="${endDate.time}" pattern="d, yyyy"
                                                                var="formatedEndDate"/>
                                                <div class="pr-4"><i
                                                        class="far fa-calendar gris"></i> ${formatedStartDate}
                                                    - ${formatedEndDate}</div>
                                            </c:otherwise>
                                        </c:choose>
                                    </c:when>
                                    <c:otherwise>
                                        <c:choose>
                                            <c:when test="${language eq 'fr'}">
                                                <fmt:formatDate value="${startDate.time}"
                                                                pattern="d MMMM yyyy"
                                                                var="formatedStartDate"/>
                                                <fmt:formatDate value="${endDate.time}"
                                                                pattern="d MMMM yyyy"
                                                                var="formatedEndDate"/>
                                                <div class="pr-4"><i
                                                        class="far fa-calendar gris"></i> ${formatedStartDate}
                                                    - ${formatedEndDate}</div>
                                            </c:when>
                                            <c:otherwise>
                                                <fmt:formatDate value="${startDate.time}"
                                                                pattern="MMMM d, yyyy"
                                                                var="formatedStartDate"/>
                                                <fmt:formatDate value="${endDate.time}"
                                                                pattern="MMMM d, yyyy"
                                                                var="formatedEndDate"/>
                                                <div class="pr-4"><i
                                                        class="far fa-calendar gris"></i> ${formatedStartDate}
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
                            <div class="pr-4"><i class="far fa-calendar gris"></i> ${formatedResourceDate}
                            </div>
                        </c:if>

                    </c:otherwise>
                </c:choose>

            </c:if>
            <p>${currentNode.properties.text.string}</p>


            <c:if test="${jcr:isNodeType(currentNode, 'jcmix:job')}">
                <div class="job">
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                            <c:set var="jobTitle" value="${currentNode.properties.jobTitle.string}"/>
                            <c:if test="${! empty jobTitle}">
                                <tr>
                                    <td><fmt:message key="jcmix_job.jobTitle"/></td>
                                    <td>${jobTitle}</td>
                                </tr>
                            </c:if>

                            <c:set var="reportingTo" value="${currentNode.properties.reportingTo.string}"/>
                            <c:if test="${! empty reportingTo}">
                                <tr>
                                    <td><fmt:message key="jcmix_job.reportingTo"/></td>
                                    <td>${reportingTo}</td>
                                </tr>
                            </c:if>

                            <c:set var="position" value="${currentNode.properties.position.string}"/>
                            <c:if test="${! empty position}">
                                <tr>
                                    <td><fmt:message key="jcmix_job.position"/></td>
                                    <td>${position}</td>
                                </tr>
                            </c:if>

                            <c:set var="location" value="${currentNode.properties.location.string}"/>
                            <c:if test="${! empty location}">
                                <tr>
                                    <td><fmt:message key="jcmix_job.location"/></td>
                                    <td>${location}</td>
                                </tr>
                            </c:if>

                            <c:set var="salary" value="${currentNode.properties.salary.string}"/>
                            <c:if test="${! empty salary}">
                                <tr>
                                    <td><fmt:message key="jcmix_job.salary"/></td>
                                    <td>${salary}</td>
                                </tr>
                            </c:if>

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
                                <tr>
                                    <td><fmt:message key="jcmix_job.startDate"/></td>
                                    <td>${dateValue}</td>
                                </tr>
                            </c:if>
                            </tbody>
                        </table>
                    </div>
                    <c:set var="whatYouWillBeDoing"
                           value="${currentNode.properties.whatYouWillBeDoing.string}"/>
                    <c:if test="${! empty whatYouWillBeDoing}">
                        <h5 class="pt-4"><fmt:message key="jcmix_job.whatYouWillBeDoing"/></h5>
                        ${whatYouWillBeDoing}
                    </c:if>

                    <c:set var="whatYouNeedForThisPosition"
                           value="${currentNode.properties.whatYouNeedForThisPosition.string}"/>
                    <c:if test="${! empty whatYouNeedForThisPosition}">
                        <h5 class="pt-4"><fmt:message key="jcmix_job.whatYouNeedForThisPosition"/></h5>
                        ${whatYouNeedForThisPosition}
                    </c:if>

                    <c:set var="profileWeAreLookingFor"
                           value="${currentNode.properties.profileWeAreLookingFor.string}"/>
                    <c:if test="${! empty profileWeAreLookingFor}">
                        <h5 class="pt-4"><fmt:message key="jcmix_job.profileWeAreLookingFor"/></h5>
                        ${profileWeAreLookingFor}
                    </c:if>

                    <c:set var="whatsInItForYou" value="${currentNode.properties.whatsInItForYou.string}"/>
                    <c:if test="${! empty whatsInItForYou}">
                        <h5 class="pt-4"><fmt:message key="jcmix_job.whatsInItForYou"/></h5>
                        ${whatsInItForYou}
                    </c:if>

                        ${currentNode.properties.more.string}
                </div>
            </c:if>

            <template:include view="hidden.link">
                <template:param name="class" value="btn btn-primary btn-circle"/>
            </template:include>
            <c:set var="parentPage" value="${jcr:getParentOfType(currentNode, 'jnt:page')}"/>
            <c:url var="parentPageUrl" value="${parentPage.url}" context="/"/>
            <a href="${parentPageUrl}" class="primary"><i class="fas fa-arrow-left"></i> <fmt:message key="label.back"/></a>
        </c:set>

        <div class="row">

            <%-- check if side is empty or not... --%>
            <c:set var="hasSideContent" value="false"/>
            <jcr:node var="sideNode" path="${currentNode.path}/side"/>
                <c:if test="${! empty sideNode}">
                    <c:set var="childNodes" value="${jcr:getChildrenOfType(sideNode, 'jnt:content')}"/>
                    <c:if test="${fn:length(childNodes)>0}">
                        <c:set var="hasSideContent" value="true"/>
                    </c:if>
                </c:if>
            <c:choose>
                <c:when test="${hasSideContent || renderContext.editMode}">
                    <div class="col-lg-8 col-md-6 col-sm-12">
                        ${mainColContent}
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <template:area path="side" areaAsSubNode="true"/>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="col-md-12'">
                            ${mainColContent}
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>

</section>
