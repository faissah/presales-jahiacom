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
<div id="topbar">
    <div class="container">
        <ul class="d-flex justify-content-end">
            <li class="search" data-toggle="modal" data-target="#modal-search"><i class="fas fa-search"></i></li>
            <c:set var="mainSiteUrl" value="${renderContext.site.properties.mainSiteUrl.string}"/>
            <c:if test="${! empty mainSiteUrl  && mainSiteUrl ne 'https://'}">
                <c:set var="mainSiteTitle" value="${renderContext.site.properties.mainSiteTitle.string}"/>
                <c:if test="${! empty mainSiteTitle}">
                    <li>
                        <a href="${mainSiteUrl}"><i class="fas fa-home"></i> ${mainSiteTitle}</a>
                    </li>
                </c:if>
            </c:if>

            <c:set var="academyPageUrl" value="${renderContext.site.properties.academyPageUrl.string}"/>
            <c:if test="${! empty academyPageUrl  && academyPageUrl ne 'https://'}">
            <li>
                    <a href="${academyPageUrl}"><i class="fas fa-graduation-cap"></i> Resource Center</a>
            </li>
            </c:if>
            <c:set var="downloadPageNode" value="${renderContext.site.properties.downloadPage.node}"/>
            <c:if test="${! empty downloadPageNode}">
                <c:url var="downloadPageUrl" value="${downloadPageNode.url}" context="/"/>
                <li><a href="${downloadPageUrl}"><i class="fas fa-download"></i> <fmt:message key="label.downloadTrial"/></a></li>
            </c:if>

            <c:set var="blogPageNode" value="${renderContext.site.properties.blogPage.node}"/>
            <c:if test="${! empty blogPageNode}">
                <c:url var="blogPageUrl" value="${blogPageNode.url}" context="/"/>
                <li><a href="${blogPageUrl}"><i class="fas fa-blog"></i> <fmt:message key="label.blog"/></a></li>
            </c:if>

            <c:choose>
                <c:when test="${renderContext.loggedIn}">
                    <li class="username">
                        <c:set var="userProperties" value="${currentUser.properties}"/>
                        <c:set var="firstname" value="${userProperties['j:firstName']}"/>
                        <c:set var="lastname" value="${userProperties['j:lastName']}"/>
                        <c:set var="profilePageNode" value="${renderContext.site.properties.profilePage.node}"/>
                        <c:choose>
                            <c:when test="${! empty profilePageNode}">
                                <c:url var="profilePageUrl" value="${profilePageNode.url}" context="/"/>
                            </c:when>
                            <c:otherwise>
                                <c:set var="profilePageUrl" value="#"/>
                            </c:otherwise>
                        </c:choose>
                        <div class="dropdown">
                            <%--<a href="${profilePageUrl}"><i class="fas fa-user-circle"></i> ${empty firstname and empty lastname ? currentUser.name : firstname}&nbsp;${fn:escapeXml(lastname)}</a>--%>
                            <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-user-circle"></i> ${empty firstname and empty lastname ? currentUser.name : firstname}&nbsp;${fn:escapeXml(lastname)}</a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <c:if test="${jcr:hasPermission(mainResourceNode, 'jContentAccess')}">
                                    <c:choose>
                                        <c:when test="${renderContext.editMode}">
                                            <a class="dropdown-item" href="<c:url value='${url.preview}'/>"><i class="fas fa-eye fa-fw"></i> <fmt:message key="label.preview"/></a>
                                        </c:when>
                                        <c:otherwise>
                                            <a class="dropdown-item" href="<c:url value='${url.edit}'/>"><i class="fas fa-edit fa-fw"></i> <fmt:message key="label.edit"/></a>
                                        </c:otherwise>
                                    </c:choose>

                                    <div class="dropdown-divider"></div>
                                </c:if>
                                <a class="dropdown-item" href="${profilePageUrl}"><i class="far fa-user fa-fw"></i> Profile</a>
                                <a class="dropdown-item" href="${url.logout}"><i class="fas fa-sign-out-alt fa-fw"></i> <fmt:message key="label.logout"/></a>

                            </div>
                        </div>
                    </li>
                </c:when>
                <c:otherwise>
                    <li class="login">
                        <a href="#" data-toggle="modal" data-target="#loginModal"><i class="fas fa-sign-in-alt"></i> <fmt:message key="label.login"/></a>
                    </li>
                </c:otherwise>
            </c:choose>

            <c:catch var="errorLanguages">
                <ui:initLangBarAttributes activeLanguagesOnly="${renderContext.liveMode}"/>
                <c:set var="languageCodes" value="${requestScope.languageCodes}"/>
                <c:if test="${fn:length(languageCodes)>1}">
                    <li>
                    <div class="dropdown">
                        <a href="#" class="dropdown-toggle" id="languageSwitchButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${fn:toUpperCase(renderContext.mainResourceLocale.language)}
                        </a>
                        <div class="dropdown-menu" aria-labelledby="languageSwitchButton">
                            <c:set var="invalidLanguages" value=""/>
                            <c:catch var="e">
                                <c:if test="${! empty mainResourceNode.properties['j:invalidLanguages']}">
                                    <c:forEach items="${mainResourceNode.properties['j:invalidLanguages']}" var="invalidLanguage">
                                        <c:set var="invalidLanguages" value="${invalidLanguages} ${invalidLanguage}"/>
                                    </c:forEach>
                                </c:if>
                            </c:catch>
                            <c:forEach var="languageCode" items="${languageCodes}">
                                <c:if test="${! empty languageCode && ! fn:contains(invalidLanguages, languageCode) && languageCode != renderContext.mainResourceLocale.language}">
                                    <jahiacom:switchToLanguageLink languageCode="${languageCode}"/>
                                </c:if>
                            </c:forEach>
                        </div>

                    </div>
                </c:if>
            </c:catch>
        </ul>
    </div>
</div>
