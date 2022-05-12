<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="templa" uri="http://www.jahia.org/tags/templateLib" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<nav class="navbar navbar-expand-lg navbar-light bg-light main-nav">
    <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <c:url value="${renderContext.site.home.url}" var="homePageUrl" context="/"/>
            <c:set var="mainSiteUrl" value="${renderContext.site.properties.mainSiteUrl.string}"/>
            <c:if test="${! empty mainSiteUrl  && mainSiteUrl ne 'https://'}">
                <c:set value="${mainSiteUrl}" var="homePageUrl"/>
            </c:if>

            <a class="navbar-brand" href="${homePageUrl}"><img src="${url.currentModule}/images/jahia-3x.png" alt="Logo Jahia"></a>

            <c:if test="${! jcr:isNodeType(renderContext.mainResource.node, 'jcmix:hideMenu')}">
                <c:set var="level1Pages" value="${jcr:getChildrenOfType(renderContext.site.home, 'jmix:navMenuItem')}"/>
                <c:set var="hasLevel1Pages" value="${fn:length(level1Pages) > 0}"/>
                <c:if test="${hasLevel1Pages}">
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0 bg-light">
                        <c:forEach items="${level1Pages}" var="level1Page" varStatus="status">
                            <template:addCacheDependency node="${level1Page}"/>
                            <template:addCacheDependency path="${level1Page.path}"/>
                            <c:if test="${! jcr:isNodeType(level1Page, 'jcmix:hidePage')}">
                                <c:set var="page1Title" value="${level1Page.displayableName}"/>
                                <c:choose>
                                    <c:when test="${jcr:isNodeType(level1Page, 'jnt:navMenuText')}">
                                        <c:set var="page1Url" value="#"/>
                                    </c:when>
                                    <c:when test="${jcr:isNodeType(level1Page, 'jnt:externalLink')}">
                                        <c:url var="page1Url" value="${level1Page.properties['j:url'].string}"/>
                                    </c:when>
                                    <c:when test="${jcr:isNodeType(level1Page, 'jnt:page')}">
                                        <c:url var="page1Url" value="${level1Page.url}" context="/"/>
                                    </c:when>
                                    <c:when test="${jcr:isNodeType(level1Page, 'jnt:nodeLink')}">
                                        <c:url var="page1Url" value="${level1Page.properties['j:node'].node.url}" context="/"/>
                                        <c:if test="${empty page1Title}">
                                            <c:set var="page1Title"
                                                   value="${level1Page.properties['j:node'].node.displayableName}"/>
                                        </c:if>
                                    </c:when>
                                </c:choose>

                                <c:set var="level2Pages" value="${jcr:getChildrenOfType(level1Page, 'jmix:navMenuItem')}"/>
                                <c:set var="hasLevel2Pages" value="${fn:length(level2Pages) > 0}"/>
                                <c:set var="hasLevel2Menu" value="false"/>
                                <c:forEach items="${level2Pages}" var="level2Page" varStatus="status">
                                    <c:if test="${! jcr:isNodeType(level2Page, 'jcmix:hidePage')}">
                                        <c:set var="hasLevel2Menu" value="true"/>
                                    </c:if>
                                </c:forEach>

                                <c:choose>
                                    <%-- has submenu --%>
                                    <c:when test="${hasLevel2Menu}">

                                        <c:choose>
                                            <%-- Megamenu --%>
                                            <c:when test="${jcr:isNodeType(level1Page,'jcmix:hasMegaMenu')}">
                                                <li class="nav-item active dropdown megamenu-li">
                                                    <%-- button to open the menu --%>
                                                    <a class="nav-link dropdown-toggle" href="${page1Url}" id="mega-${level1Page.identifier}" role="button"
                                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        ${page1Title}
                                                    </a>
                                                    <%-- menu --%>
                                                    <div class="dropdown-menu megamenu" aria-labelledby="mega-${level1Page.identifier}">
                                                        <div class="container">
                                                            <div class="row">

                                                                <c:forEach items="${level2Pages}" var="level2Page" varStatus="status">
                                                                    <c:if test="${! jcr:isNodeType(level2Page, 'jcmix:hidePage')}">
                                                                        <template:addCacheDependency node="${level2Page}"/>
                                                                        <template:addCacheDependency path="${level2Page.path}"/>
                                                                        <c:set var="featured" value="false"/>
                                                                        <c:if test="${jcr:isNodeType(level2Page, 'jcmix:hasMegaMenu')}">
                                                                            <c:set var="featured" value="${level2Page.properties.featured.boolean}"/>
                                                                        </c:if>
                                                                        <c:set var="page2Title" value="${level2Page.displayableName}"/>
                                                                        <c:choose>
                                                                            <c:when test="${jcr:isNodeType(level2Page, 'jnt:externalLink')}">
                                                                                <c:url var="page2Url" value="${level2Page.properties['j:url'].string}"/>
                                                                            </c:when>
                                                                            <c:when test="${jcr:isNodeType(level2Page, 'jnt:page')}">
                                                                                <c:url var="page2Url" value="${level2Page.url}" context="/"/>
                                                                            </c:when>
                                                                            <c:when test="${jcr:isNodeType(level2Page, 'jnt:nodeLink')}">
                                                                                <c:url var="page2Url" value="${level2Page.properties['j:node'].node.url}" context="/"/>
                                                                                <c:if test="${empty page2Title}">
                                                                                    <c:set var="page2Title" value="${level2Page.properties['j:node'].node.displayableName}"/>
                                                                                </c:if>
                                                                            </c:when>
                                                                        </c:choose>
                                                                        <c:set var="level2Fragment">
                                                                            <c:choose>
                                                                                <c:when test="${jcr:isNodeType(level2Page, 'jnt:navMenuText')}">
                                                                                    <c:if test="${! status.first}">
                                                                                        <div class="dropdown-divider"></div>
                                                                                    </c:if>
                                                                                    <span class="submenu-title">${page2Title}</span>
                                                                                </c:when>
                                                                                <c:otherwise>
                                                                                    <a class="dropdown-item ${featured?' featured':''}" href="${page2Url}">
                                                                                            ${page2Title} <span class="caret">›</span>
                                                                                        <c:if test="${jcr:isNodeType(level2Page, 'jcmix:alternativeTitle')}">
                                                                                            <c:set var="smallDescription"
                                                                                                   value="${level2Page.properties.smallDescription.string}"/>
                                                                                            <c:if test="${! empty smallDescription}">
                                                                                                <desc>${smallDescription}</desc>
                                                                                                <c:remove var="smallDescription"/>
                                                                                            </c:if>
                                                                                        </c:if>
                                                                                    </a>                                                                        </c:otherwise>
                                                                            </c:choose>
                                                                        </c:set>

                                                                        <c:set var="position" value="col1"/>
                                                                        <c:if test="${jcr:isNodeType(level1Page,'jcmix:hasMegaMenu')}">
                                                                            <c:set var="position" value="${level2Page.properties.position.string}"/>
                                                                        </c:if>

                                                                        <c:choose>
                                                                            <c:when test="${position eq 'col2'}">
                                                                                <c:set var="col2Content">
                                                                                    ${col2Content}
                                                                                    ${level2Fragment}
                                                                                </c:set>
                                                                            </c:when>
                                                                            <c:otherwise>
                                                                                <c:set var="col1Content">
                                                                                    ${col1Content}
                                                                                    ${level2Fragment}
                                                                                </c:set>
                                                                            </c:otherwise>
                                                                        </c:choose>
                                                                        <c:remove var="level2Fragment"/>
                                                                        <c:remove var="featured"/>
                                                                    </c:if>
                                                                </c:forEach>

                                                                <div class="col-md-6">
                                                                    <%-- the first item of the submenu is the link to the main menu page (only if page is not a menulabel) --%>
                                                                    <c:if test="${! jcr:isNodeType(level1Page, 'jnt:navMenuText')}">
                                                                        <c:if test="${! jcr:isNodeType(level1Page, 'jcmix:alternativeTitle')}">
                                                                            <c:set var="longTitle" value="${level1Page.properties.longTitle.string}"/>
                                                                            <c:if test="${! empty longTitle}">
                                                                                <c:set var="page1Title" value="${longTitle}"/>
                                                                            </c:if>
                                                                            <c:set var="smallDescription" value="${level1Page.properties.smallDescription.string}"/>
                                                                        </c:if>
                                                                        <a class="dropdown-item" href="${page1Url}">
                                                                            ${page1Title} <span class="caret">›</span>
                                                                            <c:if test="${! empty smallDescription}">
                                                                                <desc>${smallDescription}</desc>
                                                                                <c:remove var="smallDescription"/>
                                                                            </c:if>
                                                                        </a>
                                                                        <div class="dropdown-divider"></div>
                                                                    </c:if>
                                                                        ${col1Content}
                                                                </div>
                                                                <div class="col-md-6">
                                                                        ${col2Content}
                                                                </div>
                                                                <c:remove var="col1Content"/>
                                                                <c:remove var="col2Content"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </c:when>
                                            <%-- Standard menu --%>
                                            <c:otherwise>
                                                <li class="nav-item active dropdown">
                                                    <%-- button to open the menu --%>
                                                    <a class="nav-link dropdown-toggle" href="${page1Url}" id="drop-${level1Page.identifier}" role="button"
                                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        ${page1Title}
                                                    </a>
                                                     <%-- menu --%>
                                                    <div class="dropdown-menu" aria-labelledby="drop-${level1Page.identifier}">

                                                        <%-- the first item of the submenu is the link to the main menu page (only if page is not a menulabel) --%>
                                                        <c:if test="${! jcr:isNodeType(level1Page, 'jnt:navMenuText')}">
                                                            <c:if test="${jcr:isNodeType(level1Page, 'jcmix:alternativeTitle')}">
                                                                <c:set var="longTitle" value="${level1Page.properties.longTitle.string}"/>
                                                                <c:if test="${! empty longTitle}">
                                                                    <c:set var="page1Title" value="${longTitle}"/>
                                                                </c:if>
                                                                <c:set var="smallDescription" value="${level1Page.properties.smallDescription.string}"/>
                                                            </c:if>
                                                            <a class="dropdown-item" href="${page1Url}">
                                                                    ${page1Title} <span class="caret">›</span>
                                                                <c:if test="${! empty smallDescription}">
                                                                    <desc>${smallDescription}</desc>
                                                                    <c:remove var="smallDescription"/>
                                                                </c:if>
                                                            </a>
                                                            <div class="dropdown-divider"></div>
                                                        </c:if>

                                                        <c:forEach items="${level2Pages}" var="level2Page" varStatus="status">
                                                            <template:addCacheDependency node="${level2Page}"/>
                                                            <template:addCacheDependency path="${level2Page.path}"/>
                                                            <c:if test="${! jcr:isNodeType(level2Page, 'jcmix:hidePage')}">
                                                                <c:set var="page2Title" value="${level2Page.displayableName}"/>
                                                                <c:choose>
                                                                    <c:when test="${jcr:isNodeType(level2Page, 'jnt:externalLink')}">
                                                                        <c:url var="page2Url" value="${level2Page.properties['j:url'].string}"/>
                                                                    </c:when>
                                                                    <c:when test="${jcr:isNodeType(level2Page, 'jnt:page')}">
                                                                        <c:url var="page2Url" value="${level2Page.url}" context="/"/>
                                                                    </c:when>
                                                                    <c:when test="${jcr:isNodeType(level2Page, 'jnt:nodeLink')}">
                                                                        <c:url var="page2Url" value="${level2Page.properties['j:node'].node.url}" context="/"/>
                                                                        <c:if test="${empty page2Title}">
                                                                            <c:set var="page2Title" value="${level2Page.properties['j:node'].node.displayableName}"/>
                                                                        </c:if>
                                                                    </c:when>
                                                                </c:choose>
                                                                <c:choose>
                                                                    <c:when test="${jcr:isNodeType(level2Page, 'jnt:navMenuText')}">
                                                                        <c:if test="${! status.first}">
                                                                            <div class="dropdown-divider"></div>
                                                                        </c:if>
                                                                        <span class="submenu-title">${page2Title}</span>
                                                                    </c:when>
                                                                    <c:otherwise>
                                                                        <c:set var="featured" value="false"/>
                                                                        <c:if test="${jcr:isNodeType(level2Page, 'jcmix:hasMegaMenu')}">
                                                                            <c:set var="featured" value="${level2Page.properties.featured.boolean}"/>
                                                                        </c:if>
                                                                        <a class="dropdown-item ${featured?' featured':''}" href="${page2Url}">
                                                                                ${page2Title} <span class="caret">›</span>
                                                                            <c:if test="${jcr:isNodeType(level2Page, 'jcmix:alternativeTitle')}">
                                                                                <c:set var="smallDescription"
                                                                                       value="${level2Page.properties.smallDescription.string}"/>
                                                                                <c:if test="${! empty smallDescription}">
                                                                                    <desc>${smallDescription}</desc>
                                                                                    <c:remove var="smallDescription"/>
                                                                                </c:if>
                                                                            </c:if>
                                                                        </a>
                                                                        <c:remove var="featured"/>
                                                                    </c:otherwise>
                                                                </c:choose>
                                                            </c:if>
                                                        </c:forEach>
                                                    </div>
                                                </li>
                                            </c:otherwise>
                                        </c:choose>

                                    </c:when>

                                    <%-- single page --%>
                                    <c:otherwise>
                                        <c:if test="${status.first}">

                                        </c:if>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${page1Url}">${page1Title}</a>
                                        </li>
                                    </c:otherwise>
                                </c:choose>
                            </c:if>
                        </c:forEach>
                    </ul>
                </c:if>
            </c:if>
        </div>
    </div>
</nav>
