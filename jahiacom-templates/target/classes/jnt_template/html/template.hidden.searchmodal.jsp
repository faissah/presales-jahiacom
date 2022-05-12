<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions"%>
<div class="modal fade" id="modal-search" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header clearfix">
                <button type="button lienModalLow" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body tab-content">
                <p>Search Jahia</p>

                <c:set var="searchUrl" value="#"/>
                <jcr:node var="searchNode" path="${renderContext.site.path}/searchresult"/>
                <c:if test="${! empty searchNode}">
                    <c:url var="searchUrl" value="${searchNode.url}" context="/"/>
                </c:if>
                <s:form method="post" action="${searchUrl}" class="form-inline">
                    <s:site value="${renderContext.site.name}" includeReferencesFrom="systemsite" display="false"/>
                    <s:language value="${renderContext.mainResource.locale}" display="false" />

                    <div class="input">
                        <s:term match="all_words" id="searchTerm" value="${startSearching}" searchIn="siteContent,tags,files" class="form-control" placeholder="Enter keyword"/>
                        <button type="submit">Go</button>
                    </div>
                </s:form>

                <%--<form method="post" name="searchForm" action="index.html#" class="form-inline" >
                    <input type="hidden" name="jcrMethodToCall" value="get" />
                    <input type="hidden" name="src_originSiteKey" value="jahiacom"/>
                    <input type="hidden" name="src_sites.values" value="jahiacom"/>
                    <input type="hidden" name="src_sitesForReferences.values" value="systemsite"/>
                    <input type="hidden" name="src_languages.values" value="en"/>

                    <div class="input">
                        <input name="src_terms[0].term" id="searchTerm" placeholder="Enter keyword" type="text" class="form-control"  value=""/>
                        <input type="hidden" name="src_terms[0].applyFilter" value="true"/>
                        <input type="hidden" name="src_terms[0].match" value="all_words"/>
                        <input type="hidden" name="src_terms[0].fields.siteContent" value="true"/>
                        <input type="hidden" name="src_terms[0].fields.tags" value="true"/>
                        <input type="hidden" name="src_terms[0].fields.files" value="true"/>
                        <button type="submit">Go</button>
                    </div>
                </form>--%>
            </div>
        </div>
    </div>
</div>
