<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<h2>${currentNode.properties.firstName.string} ${currentNode.properties.lastName.string}</h2>
${currentNode.properties['jcr:title'].string}


<c:set var="birthDate" value="${currentNode.properties.birthDate.time}"/>
<c:if test="${not empty birthDate}">
    <div>
        <fmt:formatDate value="${birthDate}" pattern="dd/MM/yyyy"/>
    </div>
</c:if>

<c:set var="jobTitle" value="${currentNode.properties.jobTitle}"/>
<div>
    <jcr:nodePropertyRenderer node="${currentNode}" name="jobTitle" renderer="resourceBundle"/>
</div>

<c:set var="nationality" value="${currentNode.properties.nationality}"/>
<div>
    <jcr:nodePropertyRenderer node="${currentNode}" name="nationality" renderer="flagcountry"/>
</div>

<div class="biography">
    ${currentNode.properties.biography.string}
</div>

<c:set var="photo" value="${currentNode.properties.photo.node}"/>
<c:if test="${not empty photo}">
    <c:url value="${photo.url}" var="photoUrl" />
    <img src="${photoUrl}" alt="${fn:escapeXml(currentNode.properties['jcr:title'].string)}" />
</c:if>

<c:set var="supervisor" value="${currentNode.properties.supervisor.node}" />
<c:choose>
    <c:when test="${not empty supervisor}">
        <p>Supervisor: <template:module node="${supervisor}" view="hidden.employeeName" editable="false" /></p>
    </c:when>
    <c:otherwise>
        <p><fmt:message key="label.employee.nosupervisor" /></p>
    </c:otherwise>
</c:choose>
<%--
<c:choose>
    <c:when test="${not empty supervisor}">
        <p>Supervisor: ${supervisor.properties.firstName.string}&nbsp;${supervisor.properties.lastName.string}</p>
        <template:addCacheDependency node="${supervisor}" />
    </c:when>
    <c:otherwise>
        <p><fmt:message key="label.employee.nosupervisor" /></p>
    </c:otherwise>
</c:choose>
--%>

<c:url var="vCardUrl" value="${url.base}${currentNode.path}.vcf"/>
<div>
    <a href="${vCardUrl}"><fmt:message key="label.employee.downloadVcard"/></a>
</div>



<c:if test="${jcr:hasPermission(currentNode, 'executeSayHi')}">
    <div>
        <button id="sayHi_${currentNode.identifier}">Hi</button>
    </div>

    <c:url value="${url.base}${currentNode.path}.hi.do" var="hiURL" />
    <template:addResources type="javascript" resources="jquery.min.js"/>
    <script type="text/javascript">
        jQuery("#sayHi_${currentNode.identifier}").click(function() {
            console.log("Click on #sayHi_${currentNode.identifier}");
            jQuery.ajax({
                url: "${hiURL}",
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    alert(data.message);
                }
            });
        })
    </script>
</c:if>




















<div>
    <button id="sayHi-gql_${currentNode.identifier}">Hi (GraphQL)</button>
</div>
<script type="text/javascript">
    const graphQLQuery = '{\n' +
        '  jcr(workspace: EDIT) {\n' +
        '    nodesByQuery(query: "select * from [mynt:employee]") {\n' +
        '      nodes {\n' +
        '        property(name: "firstName") {\n' +
        '          value\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '}\n'
    jQuery("#sayHi-gql_${currentNode.identifier}").click(function() {
        console.log("Click on #sayHi-gql_${currentNode.identifier}");
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open("POST", "/modules/graphql");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {
            console.log('data returned:', xhr.response);
            //alert("John Doe says hi!")
        }
        xhr.send(JSON.stringify({query: graphQLQuery}));
    })
</script>

