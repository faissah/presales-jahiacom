var maxRecentSearches = 3;
var searchQuery;
var searchInfoBoxCount = 0;
var _country = "";
var _cty = "";
var _stPrv = "";
var isSearching = false;

function SearchInit() {
    //$('#divMapSearchHistory').html(ProcessRecentCookie('MIGMAP_RECENT_COOKIE'));
}

function OpenSearchModal()
{
    var tmpSrchVal = "City, State";
    if (_country != "" && _cty != "" && _stPrv != "")
    {
        tmpSrchVal = _cty + ", " + _stPrv;
        isSearching = true;
    }
    $("#h4ModelHeaderGlobalModal").html("Search");
    $("#divModalContentGlobalModal").html($("#divSearch").html());
    $("#divTextBoxSearchContainer").html(ProcessRecentCookie());

    if (isSearching) {
        $("#divTextBoxSearchContainer").html($("#divTextBoxSearchContainer").html() + "<a class='linkClearSearch' href='javascript:ClearSearch()'>exit search mode</a><hr>");
    }

    $("#divTextBoxSearchContainer").html($("#divTextBoxSearchContainer").html() + '<input type="text" id="txtSearchMap" onfocus="this.value=\'\'" value="' + tmpSrchVal + '" onkeypress="CheckForEnter(event)"/>');


    $("#GlobalModal").modal('show');
}

function ClearSearch()
{
    _country = "";
    _cty = "";
    _stPrv = "";
    buildReportsListView();
    ClearMarkerType(markersSearch);
    ShowMarkers(markersPublic, false);
    ShowMarkers(markersField, false);
    ShowMarkers(markersBiologist, false);
    InfoBoxClose();
    isSearching = false;
    $("#GlobalModal").modal('hide');
    $("#clearSearchLink").css("display", "none");
    if (isSmallDevice) { ToggleToolbar(); }
}

function SearchMap(txtSearch) {

    if (txtSearch.length > 0) {
        isSearching = true;
        $("#GlobalModal").modal('hide');
        InfoBoxClose();
        //ToggleToolbar();

        var latLng = new google.maps.LatLng();
        
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': txtSearch.replace(" ", "+") }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var j = 0; j < results[0].address_components[i].types.length; j++) {
                        if (results[0].address_components[i].types[j] == "country") {
                            country = results[0].address_components[i];
                            _country = (country.short_name == "US") ? "1" : "2";
                        }
                        if (results[0].address_components[i].types[j] == "locality") {
                            city = results[0].address_components[i];
                            _cty = city.short_name;
                        }
                        if (results[0].address_components[i].types[j] == "administrative_area_level_1") {
                            stateProv = results[0].address_components[i];
                            _stPrv = stateProv.short_name;
                        }
                    }
                }
                
                PopulateSearchReportsListView(_country, _cty, ConvertStateProvAbbrevToId(_stPrv));
                latLng = results[0].geometry.location;
                AddSearchMarker(latLng, txtSearch);

                //something really weird going on here.
                CreateRecentCookie(txtSearch, txtSearch);

                $("#txtSearchMap").val("");

            } else {
                alert("Search did not find a location for " + txtSearch);
            }
        });

        var loc = txtSearch.replace(",", "_");
        loc = loc.replace(" ", "");
        DoAnalyticsAndAds(loc, 'view', '', '');

        if (isSmallDevice) { ToggleToolbar(); }
        $("#clearSearchLink").css("display", "inline");
    }
}

function ConvertStateProvAbbrevToId(stateProvAbbrev) {

    var stateProvId = 0
    for (var s = 0; s < stateProvLookupArray.length; s++) {
        if (stateProvLookupArray[s][1] == stateProvAbbrev) {
            stateProvId = stateProvLookupArray[s][0];
            break;
        }
    }
    return stateProvId;
}

function ConvertStateProvIdToAbbrev(stateProvID) {

    var stateProvAbbreviation = new String();
    for (var s = 0; s < stateProvLookupArray.length; s++) {
        if (stateProvLookupArray[s][0] == stateProvID) {
            stateProvAbbreviation = stateProvLookupArray[s][1];
            break;
        }
    }
    return stateProvAbbreviation;
}

function CreateRecentCookie(text, value) {
    var cookie = GetCookie("MIGMAP_RECENT_COOKIE");
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + 365);

    if (cookie) {
        if (CountChars(cookie, "|") == maxRecentSearches) {
            cookie = cookie.substring(0, cookie.lastIndexOf("|"));
        }

        if (cookie.toString().indexOf(value) == -1) {
            DeleteCookie("MIGMAP_RECENT_COOKIE");

            document.cookie = "MIGMAP_RECENT_COOKIE=" + escape(text + "^" + value + "|" + cookie) + ";expires=" + expDate;
        }
    }
    else {
        document.cookie = "MIGMAP_RECENT_COOKIE=" + escape(text + "^" + value) + ";expires=" + expDate;
    }
    ProcessRecentCookie();
}

function DeleteCookie(cookieName) {
    var expDate = new Date();

    expDate.setTime(expDate.getTime() - 1);

    document.cookie = cookieName += "=; expires=" + expDate.toGMTString();

    $("#divMapSearchHistory").html("");

    $("#txtSearchMap").val("City, State");

    ProcessRecentCookie();

    ClearRecentSearches();
}

function GetCookie(cookieName) {
    var results = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
    if (results) {
        return (unescape(results[2]));
    }
    else {
        return null;
    }
}

function ProcessRecentCookie() {

    var cookie = GetCookie("MIGMAP_RECENT_COOKIE");
    var tmpParam;
    if (cookie) {
        var html = "<table cellpadding=\"3\" width=\"100%\">";
        html += "<tr><td>Search History</td></tr>";
        cookie = cookie.toString().split('|');

        for (var s = 0; s < cookie.length; s++) {
            textValue = cookie[s].toString().split('^');

            tmpParam = textValue[0].replace(/'/g, "\\'");

            //html += "= <a href=\"javascript:void(0)\" onclick=\"SearchMap('" + cookie[s] + "')\">" + cookie[s] + "</a><br/>"
            html += "<tr><td><div class=\"divSearchHistoryLink\"><a class=\"link\" onclick=\"SearchMap('" + tmpParam + "')\"><img src=\"resources/images/searchMarker.png\" width=\"15px\" border=\"0\"></a>&nbsp;&nbsp;<a class=\"link\" onclick=\"SearchMap('" + tmpParam + "')\">" + textValue[1] + "</a></div></td></tr>";
            html += "<tr><td colspan=\"2\"><p></p></td></tr>";
        }
        html += "<tr><td><br><a class=\"linkClearSearch\" onclick=\"DeleteCookie('MIGMAP_RECENT_COOKIE')\">clear search history</a><hr></td></tr>";
        html += "</table>";
    }
    

    return html;
}

function CheckForEnter(e) {
    var keyCode;
    if (e) {
        e = e;
    }
    else {
        e = window.event;
    }

    if (e.which) {
        keyCode = e.which;
    }
    else {
        keyCode = e.keyCode;
    }
    if (keyCode == 13) {
        SearchMap(document.getElementById("txtSearchMap").value);
    }
}


function ClearRecentSearches() {
    //document.getElementById('divMapSearchHistory').innerHTML = "";
    $("#div-recent-searches").html("");
    //ClearSearchInfoBoxes();
}

function CountChars(string, charToCount) {
    cnt = 0;
    hasChar = true;
    index = 0;

    while (hasChar == true) {
        index = string.toString().indexOf(charToCount, (index + charToCount.toString().length));

        if (index != -1) {
            cnt++;
        }
        else {
            hasChar = false;
        }
    }

    return (cnt + 1);
}

function HandleSearchMarkers() {
    if (map.getZoom() < 8) {
        ClearSearchInfoBoxes();
    }
}

function ClearSearchInfoBoxes() {
    searchLayer.clear();
}

function closeSearchInfoBox(searchInfoBoxID) {

    document.getElementById(new String(searchInfoBoxID)).style.display = "none";
}
