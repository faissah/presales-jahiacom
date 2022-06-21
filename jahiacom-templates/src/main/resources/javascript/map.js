var mapDefaultCenterDesktop = [39.03, -98.2]; //summer view
var mapDefaultZoomDesktop = 5; 
var mapDefaultZoomMobile = 4;
var mapDefaultZoom;
var map, cnt = 0, viewPortCnt = 0, isZoomActive = true, rptCount = 0;
var xmlAsJsonObj;
var lastDragEndView, markerCount, marker, markers = [], sortTmpArr = [], uniqueReportsArr = [], currentBoundRptDataArr = [], finalBoundDataArr = [];
var filterCategoriesArr = [["type", "atLeastOne", { "chkBoxFilterPublic": "checked", "chkBoxFilterAlerts": "checked", "chkBoxFilterBiologist": "checked" }], ["time-period", "eitherOr", { "radioFilterTimePeriodMorning": "checked", "radioFilterTimePeriodAfternoon": "checked" }], ["activity", "none", { "activity-slider": "1"}]];
var activityLevelsArr = [["2", "Incoming: low numbers"], ["3", "Incoming: increasing"], ["5", "Peak numbers"], ["6", "Outgoing: decreasing"], ["8", "Outgoing: low numbers"]];
var currentView = "LIST";
var windowWidth = $(window).width();
var windowHeight = $(window).height();
var thresholdWidth = 768;
var previousScrollTop = 0;
var reportID = 0;
var contentHtml = new String();
var isMapLoaded = false, isListLoaded = false, isInit = true;
var DefaultDataSet = [];
var FilteredDataSet = [];
var CurrentDataSet = [];
var activeDataSet = [];
var isFiltersChanged = false;
var activeFilter = new String();
var activeFilterRuleIndex = -1;
var activeFilterRuleText = new String();
var isReport, isAlert, isBiologist;
var menuToggleState = "show";
var markerIcon;
var infoBoxExists = false;
var infobox;
var boxText;
var infoboxOptions;
var isInfoBoxHovering = false;
var resourcesImagePath = "resources/Images/";
var isSliderEngaged = false;
var markerGlobalCount = 0;
var markersNwr = [];
var kmzUrls = [];
var kmzLayers = [];
var isKmzActive = false;
var gaStringBase = "marker";
var bp = GetBreakpoint();
var isMobile = (bp == "xs" || bp == "sm") ? true : false;
var searchResultSelected = [];
var srchLocation;
var reloadAd = true;
var listItemCountBetweenAlerts = 2;
var targetInsertItemID;
var spacedAlertsCnt = 0;
var alertPastDaysMax = 5;
var alertHeadlineRemoveString = "Migration Alert: ";
var isPortrait = false;
var isLandscape = false;


$(document).ready(function () {

    
    startProgressIconInContainer("#report-list", "loading...");

    (windowWidth < thresholdWidth) ? RefreshMobileFixedFooterAd() : null;

    (windowWidth > thresholdWidth) ? RefreshDesktopHeaderAd() : null;

    mapDefaultZoom = (isMobile) ? mapDefaultZoomMobile : mapDefaultZoomDesktop;


    $(window).on("resize", function (e) {
        HandleScreenChange(e);
    });
    $(window).on("orientationchange", function (e) {
        HandleScreenChange(e);
    });

    if (GetData()) {
        PopulateListView(DefaultDataSet);
    }

    $("#column-2-grip").click(function () {
        ToggleListVisibility();
    });

    $("#div-map-list-toggler").click(function () {
        ToggleMapList();
    });

    $(".filter-item").click(function () {
        ExpandExtendedFilterPanel(this);
    });

    $("#reset-filters").click(function () {
        ResetFilterValues();
    });

    $("#div-filter-global-close").click(function () {
        HideExtendedFilterPanel();
    });
    $("#report-search").click(function () {
        ToggleModal("report-search-modal", 'show');
        $("#report_panel_search_location").val('');
        $("#report_panel_search_date_from").val('');
        $("#report_panel_search_date_to").val('');
        //$("#div-recent-searches").html(ProcessRecentCookie()); //removed by RP for launch
    });
    //$("#report_panel_search_location").blur(function () {});

    $("#report-search-modal").on("shown.bs.modal", function () {
        $("#report_panel_search_location").focus();
        DoAnalyticsAndAds('searchModal', 'view', '', '');
    });

    $("#modalPublicSubmission").on("shown.bs.modal", function () {
        DoAnalyticsAndAds('submissionForm', 'view', '', '');
    });

    $("#modalPublicSubmission").on("hidden.bs.modal", function () {
        $("#divPublicSubmitAlert").hide();
    });

    $("#GlobalModal").on("hidden.bs.modal", function () {
        ((bp == "xs" || bp == "sm") && isPortrait) ? RefreshMobileFixedFooterAd() : RefreshDesktopHeaderAd();
        DoAnalyticsAndAds("global_modal/hide", "event", "", "click");
    });

    $(document).click(function (event) {
        if (!$(event.target).closest("#modal-login").length) {
            //$("body").find("#modal-login").fadeOut();
            showLogin(false);
        }
    });

    //ability to hit ENTER to login from modal
    $("#modal-login").keypress(function (e) {
        if (e.which == 13) {
            btnLogInClick();
            e.preventDefault();
        }
    });

    $('#report_panel_search_date_from').datepicker()
        .on('changeDate', function (ev) {
            $('#report_panel_search_date_from').datepicker('hide');
        });

    $('#report_panel_search_date_to').datepicker()
        .on('changeDate', function (ev) {
            $('#report_panel_search_date_to').datepicker('hide');
        });
    $("#report_panel_search_location").blur(function () {
        CheckForPlaceChanged(this);
    });

    kmzUrls.push(kmzUrl + "Public_Lands_pt_August_2019.kmz");


    var mql = window.matchMedia("(orientation: portrait)");
    if (mql.matches) { isPortrait = true; isLandscape = false; } else { isPortrait = false; isLandscape = true;}
    mql.addListener(function (m) {
        var s = "changed to ";
        if (m.matches) {
            s += "portrait";
            isPortrait = true; isLandscape = false; 
            RefreshMobileFixedFooterAd();
        }
        else {
            s += "landscape";
            isPortrait = false; isLandscape = true; 
            if (!isMobile) {
                $("#report-list-container").css("display", "inline-block");
            }
            if (isMobile && !isMapLoaded) {
                RefreshDesktopHeaderAd();
                MigMap();
                ShowBoundMarkers();
            }
        }
        //console.log(s);
    });

    SetLayout();

});

function HandleScreenChange(e) {
    //console.log(e.type);
}

function SetLayout() {

    var offset = 180;

    if (bp == "md" || bp == "lg") {
        offset = 240;
    }

    $("#report-list-container").css("height", ($(window).height()));

    switch (isMobile) {
        case true:
            //tweak mobile layout
            break;
        case false:
            //tweak desktop layout
            $("#column-1").css("display", "inline-block");
            $("#column-2").css("display", "inline-block");
            MigMap();
            break;
    }

    (bp == "xs" || bp == "sm") ? $("#filters-extras").css("display", "none") : null;
}

function PopulateListView(dataset) {

        cnt = 0;

        var contentHtml = new String();
        var badgeClass = new String();
        var reportTypeClass = new String();
        var reportWebID, reportDate;
        var alertIDsArr = [];
        var reportIDsArr = [];
        var alertCnt = 1;

        alertIDsArr.length = 0;
        reportIDsArr.length = 0;

        $("#span-report-close").click(function () {
            returnToList();
        });

        $("#report-list-item-detail").css("height", windowHeight);
        $("#report-list-item-detail").css("left", windowWidth);


    if (dataset[0]) {
       
        for (var r = 0; r < dataset[0].length; r++) {

            isReport = false;
            isBiologist = false;
            isAlert = false;
            reportWebID = (dataset[0][r]["ReportWebID"]["#text"] != null) ? dataset[0][r]["ReportWebID"]["#text"] : "";
            reportDate = new Date(dataset[0][r]["ReportSubmitDate"]["#text"]);

            reportID = (dataset[0][r]["ReportID"]["#text"]) ? dataset[0][r]["ReportID"]["#text"] : 0;

            if (dataset[0][r]["ItemType"]["#text"] !== "alert") {

                switch (dataset[0][r]["ListItemType"]["#text"]) {

                    case "biologist":
                        reportTypeClass = "biologist";
                        isBiologist = true;
                        break;
                    default:
                        reportTypeClass = "public";
                        isReport = true;
                        break;
                }
            }
            else {
                isAlert = true;
                reportTypeClass = "alerts";
            }

            reportTypeClass = dataset[0][r]["ListItemType"]["#text"];

            var nd = new Date(reportDate);
            var relevantDateRange = GetRelevantDateRange(seasonStartMonth + "/1/" + seasonStartYear);

            //construct report html:start
            if (isReport) {

                //for DU badges - NEEDS REWORK
                //badgeClass = 'div-badge-placeholder ' + reportTypeClass; //(Math.floor(Math.random() * 10) > 5) ? 'div-member-badge' : 'div-badge-placeholder';

                contentHtml += "<div class='report-list-item-wrapper' onclick='GetLocationReports(\"" + dataset[0][r]["ReportCity"]["#text"] + ", " + dataset[0][r]["ReportState"]["#text"] + "\", \"" + dataset[0][r]["ReportLat"]["#text"] + "\",\"" + dataset[0][r]["ReportLong"]["#text"] + "\",\"" + reportWebID + "\",\"" + relevantDateRange[0] + "\",\"" + relevantDateRange[1] + "\",\"" + reportDate.getFullYear() + "\",\"" + dataset[0][r]["ReportZipCode"]["#text"] + "\", true, 0, " + dataset[0][r]["ReportID"]["#text"] + ")'>";

                //contentHtml += "<div class='report-list-item-wrapper' onclick='listItemClick(" + reportID + ", " + cnt + ",\"report-detail-modal\",\"" + badgeClass + "\",\""+reportTypeClass+"\")'>";
                contentHtml += "<div class='hint-bar " + reportTypeClass + "'></div>";
                contentHtml += "<div id='rpt_" + reportID + "' class='report-list-item'>";
                contentHtml += "<div class='row pb-2'>";

                //badge
                //contentHtml += "<div class='col'><div class='" + badgeClass + "'>&nbsp;</div>" + DefaultDataSet[0][r]["ReportFirstName"]["#text"] + " " + truncateText(DefaultDataSet[0][r]["ReportLastName"]["#text"], 1, '.') + "</div>";

                //no badge
                contentHtml += "<div class='col'>" + dataset[0][r]["ReportFirstName"]["#text"] + " " + truncateText(dataset[0][r]["ReportLastName"]["#text"], 1, '.') + "</div>";

                contentHtml += "<div class='col text-right'>";
                contentHtml += "<span class='item-date'>" + GetSmartSubmitDate(dataset[0][r]["ReportSubmitDate"]["#text"]) + "</span>";
                contentHtml += "<i class='fal fa-chevron-right'></i>";
                contentHtml += "</div > ";
                contentHtml += "</div>";
                contentHtml += "<b>" + dataset[0][r]["ReportCity"]["#text"] + ", " + dataset[0][r]["ReportState"]["#text"] + "</b><br>";
                contentHtml += "<span class='item-activity'>" + ConvertActivityLevelDisplay(dataset[0][r]["ReportActivityLevel"]["#text"]) + "</span>";
                contentHtml += "</div>";
                contentHtml += "</div>";

                reportIDsArr.push(reportID);
            }
            //construct report html:end

            //construct alert html:start
            if (isAlert) {
                var alertHeadline = new String(dataset[0][r]["AlertTabName"]["#text"]);
                contentHtml += "<div class='report-list-item-wrapper' onclick='OpenWindow(\"" + dataset[0][r]["AlertUrl"]["#text"] + "\")'>";
                contentHtml += "<div class='hint-bar " + reportTypeClass + "'>&nbsp;</div>";
                contentHtml += "<div id='alrt_" + alertCnt + "' class='report-list-item'>";
                contentHtml += "<div class='row pb-2'>";
                contentHtml += "<div class='col'><b class='alert-label'>Migration Alert</b></div>";
                contentHtml += "<div class='col text-right'>";
                contentHtml += "<span class='item-date'>" + GetSmartSubmitDate(dataset[0][r]["ReportSubmitDate"]["#text"]) + "</span>";
                contentHtml += "<i class='fal fa-chevron-right'></i>";
                contentHtml += "</div> ";
                contentHtml += "</div>";
                contentHtml += "<b>" + alertHeadline.replace(alertHeadlineRemoveString,'') + "</b><br>";
                contentHtml += "<div>" + dataset[0][r]["AlertLocation"]["#text"] + "</div>";

                if (new String(dataset[0][r]["AlertAdditionalVerbiage"]["#text"]) != "undefined") {
                    contentHtml += "<div>" + dataset[0][r]["AlertAdditionalVerbiage"]["#text"] + "</div>";
                }

                alertIDsArr.push("alrt_" + alertCnt);
                contentHtml += "</div>";
                contentHtml += "</div>";

                alertCnt++;

            }
            //construct alert html:end

            //construct biologist html:start
            if (isBiologist) {

                //contentHtml += "<div class='report-list-item-wrapper' onclick='GetLocationReports(\"" + dataset[0][r]["ReportCity"]["#text"] + " " + dataset[0][r]["ReportState"]["#text"] + "\", \"" + dataset[0][r]["ReportLat"]["#text"] + "\",\"" + dataset[0][r]["ReportLong"]["#text"] + "\",\"" + reportWebID + "\",\"" + relevantDateRange[0] + "\",\"" + relevantDateRange[1] + "\",\"" + reportDate.getFullYear() + "\",\"" + dataset[0][r]["ReportZipCode"]["#text"] + "\", true, 0, " + dataset[0][r]["ReportID"]["#text"] + ")'>";
                //contentHtml += "<div class='report-list-item-wrapper' onclick='listItemClick(" + reportID + ", " + cnt + ",\"report-detail-modal\",\"" + badgeClass + "\",\"" + reportTypeClass +"\")'>";
                contentHtml += "<div class='report-list-item-wrapper' onclick='ViewReportDetailsBiologist(\"" + dataset[0][r]["ReportCity"]["#text"] + " " + dataset[0][r]["ReportState"]["#text"] + "\", \"" + dataset[0][r]["ReportLat"]["#text"] + "\",\"" + dataset[0][r]["ReportLong"]["#text"] + "\",\"" + dataset[0][r]["ReportZipCode"]["#text"] + "\",\"" + isMobile + "\")'>";

                //javascript: ViewReportDetailsBiologist("Memphis, Tennessee", "35.131068", "-90.05458599999997", "38101", true)

                contentHtml += "<div class='hint-bar " + reportTypeClass + "'>&nbsp;</div>";
                contentHtml += "<div id='rpt_" + reportID + "'class='report-list-item'>";
                contentHtml += "<div class='row pb-2'>";
                contentHtml += "<div class='col'><b class='biologist-label'>Biologist Report</b></div>";
                contentHtml += "<div class='row'>" + dataset[0][r]["ReportFirstName"]["#text"] + " " + truncateText(dataset[0][r]["ReportLastName"]["#text"], 1, '.') + "</div>";
                contentHtml += "<div class='col text-right'>";
                contentHtml += "<span class='item-date'>" + GetSmartSubmitDate(dataset[0][r]["ReportSubmitDate"]["#text"]) + "</span>";
                contentHtml += "<i class='fal fa-chevron-right'></i>";
                contentHtml += "</div > ";
                contentHtml += "</div>";
                contentHtml += "<b>" + dataset[0][r]["ReportCity"]["#text"] + ", " + dataset[0][r]["ReportState"]["#text"] + "</b><br>";
                contentHtml += "<span class='item-activity'>" + ConvertActivityLevelDisplay(dataset[0][r]["ReportActivityLevel"]["#text"]) + "</span>";
                contentHtml += "</div>";
                contentHtml += "</div>";
            }
            //construct biologist html:end

            //join item:start
            if (r == 3) {

                contentHtml += "<div class='report-list-item-wrapper house-item' onclick='OpenWindow(\"" + joinLink + "\")'>";
                contentHtml += "<div class='hint-bar house'>&nbsp;</div>";
                contentHtml += "<div class='list-item-house'>";
                contentHtml += "<p class=\"m-0\">";
                contentHtml += "<p><b>DU Bottomland Adventurer Backpack</b></p>";
                contentHtml += "<p><img src=\"https://duckscdn.blob.core.windows.net/imagescontainer/landing-pages/migration/images/listview-promos/join-twoforone-backpack.png\" style=\"float: right\;margin-left:20px\"><a>Join today</a> and get the DU Bottomland Adventurer Backpack as our gift to you!</p>";
                contentHtml += "</div>";
                contentHtml += "</div>";
                contentHtml += "</div>";
            }
            //join item:end

            cnt++;
        }

        if (cnt == 0) {
            contentHtml = "<p style=\"text-align:center;padding:20px;margin:20px;border:1px solid #ccc;\">No reports found.</p>";
            deleteMarkers();
        }

        (isMapLoaded) ? ShowBoundMarkers() : null;

    } else {
        contentHtml = "<p style=\"text-align:center;padding:20px;margin:20px;border:1px solid #ccc;\">No reports found.</p>";
        deleteMarkers();
    }
    
    $("#report-list").html(contentHtml);

        //migration alert spacing:start
        spacedAlertsCnt = 0;
        for (var x = 0; x < reportIDsArr.length; x++) {
            if (x % listItemCountBetweenAlerts == 0 || x == 0) {
                targetInsertItemID = "rpt_" + reportIDsArr[x];
                $("#" + targetInsertItemID).parent().before($("#" + alertIDsArr[spacedAlertsCnt]).parent());
                spacedAlertsCnt++;
            } 
        }
        //migration alert spacing:end

        $(".column-1").css("height", $(window).height());

    isListLoaded = true;

}

function truncateText(str, length, ending) {
    var workingStr = new String(str);
    if (length == null ) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (workingStr.length > length) {
        return workingStr.substring(0, length) + ending;
    } else {
        return workingStr;
    }
}

function OpenWindow(url) {
    window.open(url);
}

function GetSmartSubmitDate(d) {
    var smartSubmitDate = new String();
    var currDate = new Date();
    var yestDate = new Date();
    var submitDate = new Date(d);
    var variableDate = new Date();
    var maxPastDate = new Date();
    maxPastDate.setDate(currDate.getDate() - alertPastDaysMax);

    yestDate.setDate(currDate.getDate() - 1);

    if ((currDate.getMonth() + 1) + "/" + currDate.getDate() + "/" + currDate.getFullYear() == (submitDate.getMonth() + 1) + "/" + submitDate.getDate() + "/" + submitDate.getFullYear()) {
        smartSubmitDate = "Today";
    }
    if ((yestDate.getMonth() + 1) + "/" + yestDate.getDate() + "/" + yestDate.getFullYear() == (submitDate.getMonth() + 1) + "/" + submitDate.getDate() + "/" + submitDate.getFullYear()) {
        smartSubmitDate = "Yesterday";
    }

    for (var y = 1; y < alertPastDaysMax; y++) {
        if ((yestDate.getMonth() + 1) + "/" + (yestDate.getDate() - y) + "/" + yestDate.getFullYear() == (submitDate.getMonth() + 1) + "/" + submitDate.getDate() + "/" + submitDate.getFullYear()) {
            smartSubmitDate = (y + 1) + " days ago";
            break;
        }
    }

    if (maxPastDate > submitDate) {
        smartSubmitDate = (submitDate.getMonth() + 1) + "/" + submitDate.getDate() + "/" + submitDate.getFullYear();
    }
    
    return smartSubmitDate;
}

function InitMap() {
    google.maps.event.addDomListener(window, 'load', MigMap);
}

function MigMap() {

    lastDragEndView = [mapDefaultCenterDesktop[0], mapDefaultCenterDesktop[1], mapDefaultZoomDesktop];

    //var latlng = new google.maps.LatLng(mapDefaultCenterDesktop[0], mapDefaultCenterDesktop[1]);
    var mapOptions = {
        center: new google.maps.LatLng(mapDefaultCenterDesktop[0], mapDefaultCenterDesktop[1]),
        zoom: mapDefaultZoom,
        disableDefaultUI: true,
        gestureHandling: 'greedy'
    };

    map = new google.maps.Map(document.getElementById("div-map"), mapOptions);

    map.setMapTypeId('hybrid');

    map.addListener('dragend', function (evt) {
        if (isZoomActive) {
            var tmp = this.getCenter();
            lastDragEndView = [tmp.lat(), tmp.lng(), this.getZoom()];
        }
        else {
            $("#div-viewport-previous").html("");
            isZoomActive = false;
        }
          //ShowBoundMarkers(true);
    });

    map.addListener('center_changed', function () {
        if (isZoomActive) {
            var tmp = this.getCenter();
            lastDragEndView = [tmp.lat(), tmp.lng(), this.getZoom()];
        }
        else {
            $("#div-viewport-previous").html("");
            isZoomActive = false;
        }
        //ShowBoundMarkers(true);
    });


    map.addListener('zoom_changed', function (evt) {
        if (isZoomActive) {
            var tmp = this.getCenter();
            lastDragEndView = [tmp.lat(), tmp.lng(), this.getZoom()];
        }
        else {
            $("#div-viewport-previous").html("");
            isZoomActive = false;
        }
        // ShowBoundMarkers();
    });


    isMapLoaded = true;

    ShowBoundMarkers();
    
    $("#search-container").css("height", $(window).height());

    var offset = 180;

    if (bp == "md" || bp == "lg") {
        offset = 120;
    }

    $("#div-map").css("height", ($(window).height()));

    InitKmzLayers();
}

function SetMapType() {

    if (map.getMapTypeId() == "hybrid") {
        var mapStyle = GetMapStyle();
        map.mapTypes.set('styled_map', mapStyle);
        map.setMapTypeId("styled_map");
        DoAnalyticsAndAds("styled_map", "event", "", "click");
    }
    else {
        map.setMapTypeId("hybrid");
        DoAnalyticsAndAds("hybrid", "event", "", "click");
    }
}

function ShowBoundMarkers() {

        deleteMarkers();
        strout = "";
        cnt = 0;
        alertCnt = 0;
        viewPortCnt = 0;
        markerCount = 0;
        markers.length = 0;
        var a, b, c, e, f, g, h, i, j;
        var el;
        //CurrentDataSet.length = 0;

    activeDataSet = getRelevantDataSet();

    try {
        for (var d = 0; d < activeDataSet[0].length; d++) {

            a = new String(activeDataSet[0][d].ReportLat["#text"]);
            b = new String(activeDataSet[0][d].ReportLong["#text"]);
            c = new String(activeDataSet[0][d].ReportID["#text"]);
            e = new String(activeDataSet[0][d].ListItemType["#text"]);
            f = new String(activeDataSet[0][d].ReportCity["#text"] + ", " + activeDataSet[0][d].ReportState["#text"]);
            g = new String(activeDataSet[0][d].AlertLocation["#text"]);
            h = (activeDataSet[0][d].ReportWebID["#text"] != null) ? activeDataSet[0][d].ReportWebID["#text"] : "";
            i = new Date(activeDataSet[0][d].ReportSubmitDate["#text"]);
            j = activeDataSet[0][d].ReportZipCode["#text"];
            k = new String(activeDataSet[0][d].AlertUrl["#text"]);

            markerIcon = "";

            if (e == "public") {
                markerIcon = resourcesImagePath + "publicIcon.png";
            }
            if (e == "biologist") {
                markerIcon = resourcesImagePath + "biologistIcon.png";
            }
            if (e == "alerts") {
                markerIcon = resourcesImagePath + "alertIcon.png";
            }

            latlng = new google.maps.LatLng(a, b);

            (e == "alerts") ? alertCnt++ : null;

            marker = new google.maps.Marker({
                map: map,
                position: latlng,
                icon: markerIcon,
                id: (e == "alerts") ? 'alrtMarker_'+alertCnt : 'rptMarker_' + c,
                location: (e == "alerts") ? g : f,
                itemType: e,
                webID: h,
                reportDate: (i.getMonth() + 1) + "/" + i.getDate() + "/" + i.getFullYear(),
                reportYear: i.getFullYear(),
                zip: j,
                alertUrl: k
            });

            google.maps.event.addListener(marker, 'click', (function (marker, markerCount) {
                return function () {   
                    var rhsItemPrefix, rhsItemBgColor, rhsItemType;
                    if (marker.itemType != "alerts") {
                        rhsItemPrefix = "rpt_";
                        rhsItemBgColor = "#ededed";
                        rhsItemType = "report";
                    }
                    else {
                        rhsItemPrefix = "alrt_";
                        rhsItemBgColor = "#ebfcdc";
                        rhsItemType = "alert";
                    }
                    reloadAd = false;

                    $(".report-list-item-wrapper").css("background", "#faf8f9");
                    el = document.getElementById(rhsItemPrefix + marker.id.split("_")[1]);
                    if (el) {
                        $(el).parent("div").css("backgroundColor", rhsItemBgColor);
                        $('#report-list').animate({ scrollTop: $('#report-list').scrollTop() + ($("#" + rhsItemPrefix + marker.id.split("_")[1]).offset().top - $('#report-list').offset().top - 50) });
                        
                        DoAnalyticsAndAds(CreateGoogleAnalyticsString(rhsItemType, "click", marker.location.replace(/, /g, "_").replace(/ /g, "_")), "event", "", "click");
                    }

                    InfoBoxClose();
                    if (!infoBoxExists) {
                        if (marker.itemType == "public") {
                            PopulatePublicInfoBox(marker, markerCount, e);
                        }
                        if (marker.itemType == "biologist") {
                            PopulateBiologistInfoBox(marker, markerCount, e);
                        }
                        if (marker.itemType == "alerts") {
                            PopulateAlertInfoBox(marker, markerCount, e);
                        }
                    }
                };
            })(marker, markerCount));

            markers.push(marker);

            markerCount++;

            cnt++;

            if (isZoomActive) {
                rptCount = cnt;
            }
         /*   if (e == "alerts") {
                console.log(alertCnt);
                alertCnt++;
            }*/
        }
    }
    catch(err) {//
    }

        //});

        $(".column-1").css("display", "inline-block");


   /* if (isMapLoaded) {
        for (var d2 = 0; d2 < activeDataSet[0].length; d2++) {

            console.log("map is loaded");
            if (IsWithinBounds(marker)) {
                console.log("marker is within boands");
                CurrentDataSet.push(activeDataSet[0][d2]);

                //  strout += "<div id='rpt_" + c + "' class='report-list-item-rhs' onmouseover='listItemMouseOver(" + cnt + ")' onmouseout='listItemMouseOut(" + cnt + ")' onclick='listItemClick(" + c) + ", " + cnt + ")'>";
                //  strout += "<b>" + dpdu[m] + ", " + ep[m] + "</b><br>";
                //  strout += "<sub>" + fp[m] + "</sub>";
                //  strout += "</div>";
                //  strout += "<hr>";
                //  viewPortCnt++;
            }
        }*/

        isInit = false;
    
}


function returnToLastDragEndView() {
    map.setCenter(new google.maps.LatLng(lastDragEndView[0], lastDragEndView[1]));
    map.setZoom(lastDragEndView[2]);
    isZoomActive = true;
    $("#div-viewport-previous").html("");
}
function listItemClick(rptId, index, modalID, badge, listItemType)
{

    console.log(modalID);

    var dataset = GetActiveDataSet();

    //ToggleModal(modalID, "show");

    previousScrollTop = $(window).scrollTop();

    $("#report-list-item-detail").css({"top": $(window).scrollTop() + "px","height": (windowHeight * .8) + "px" });

    //use in-memory reports data
    for (var r = 0; r < dataset[0].length; r++) {

        if (dataset[0][r]["ReportID"]["#text"] == rptId) {

            $reportID = dataset[0][r]["ReportID"]["#text"];
            $reportActivityLevel = dataset[0][r]["ReportActivityLevel"]["#text"];
            $city = dataset[0][r]["ReportCity"]["#text"];
            $state = dataset[0][r]["ReportState"]["#text"];
            $country = dataset[0][r]["ReportCountry"]["#text"];
            $firstName = dataset[0][r]["ReportFirstName"]["#text"];
            $lastName = dataset[0][r]["ReportLastName"]["#text"];
            $submitDate = dataset[0][r]["ReportSubmitDate"]["#text"];
            $comments = (dataset[0][r]["ReportComments"]["#text"]) ? DefaultDataSet[0][r]["ReportComments"]["#text"] : "";
            $reportTemp = dataset[0][r]["ReportTemperature"]["#text"];
            $reportTime = dataset[0][r]["ReportTimeOfDay"]["#text"];
            $reportWaterfowlClass = dataset[0][r]["ReportWaterfowlClassification"]["#text"];
            $reportWeather = dataset[0][r]["ReportWeather"]["#text"];
            $reportWindDir = dataset[0][r]["ReportWindDirection"]["#text"];
            $reportWindSpeed = dataset[0][r]["ReportWindSpeed"]["#text"];
            $reportLat = dataset[0][r]["ReportLat"]["#text"];
            $reportLong = dataset[0][r]["ReportLong"]["#text"];
            listItemType = dataset[0][r]["ListItemType"]["#text"];

            ZoomToLocation($reportLat, $reportLong);

            $("#modal-content-header").html($city + ", " + $state + " - " + $country);

            var city_state = new String($city + ", " + $state);
            city_state = city_state.replace(", ", "_");

            if (listItemType != "biologist") {
                //contentHtml += "<p>"+$reportID+"</p>";
                contentHtml = "<p>" + GetSmartSubmitDate($submitDate) + "</p>";
                //badge
                //contentHtml += "<p class='reporterName'><div class='" + badge + "'>&nbsp;</div>" + $firstName + " " + $lastName + ":</p>";

                //no badge
                contentHtml += "<p class='reporterName'>" + $firstName + " " + $lastName + ":</p>";

                contentHtml += "<p class='item-detail-activity'>" + $reportActivityLevel + "<br>(" + GetActivityLevelImage($reportActivityLevel) + ") </p>";
                contentHtml += ($comments !== "") ? "<p class='item-detail-comment'>\"" + $comments + "\"</p>" : "";
                contentHtml += ($reportTime !== "Not Provided") ? "<p class='item-detail-property'>" + $reportTime + "</p>" : "";
                contentHtml += ($reportWaterfowlClass !== "Unknown") ? "<p class='item-detail-property'>" + $reportWaterfowlClass + "</p>" : "";
                contentHtml += ($reportWeather !== "Not Provided") ? "<p class='item-detail-property'>" + $reportWeather + "</p>" : "";
                contentHtml += ($reportTemp !== "Not Provided") ? "<p class='item-detail-property'>" + $reportTemp + "</p>" : "";
                contentHtml += ($reportWindDir !== "Not Provided" || $reportWindSpeed !== "Not Provided") ? "<p class='item-detail-property'>" : "";
                contentHtml += ($reportWindDir !== "Not Provided") ? "Wind " + $reportWindDir : "";
                contentHtml += ($reportWindSpeed !== "Not Provided") ? " (" + $reportWindSpeed + ")" : "";
                contentHtml += ($reportWindDir !== "Not Provided" || $reportWindSpeed !== "Not Provided") ? "</p>" : "";

                contentHtml += "<div id='report-detail-ad'>";
                contentHtml += "<iframe align=\"center\" id=\"iframeEmbedAdReportDetail\" frameborder=\"0\" width=\"300\" height=\"250\" scrolling=\"no\" src=\"resources/aspx/AdFrameEmbed1.aspx\"></iframe>";
                contentHtml += "</div>";
            } else {

                contentHtml = "<p>" + GetSmartSubmitDate($submitDate) + "</p>";

                contentHtml += "<p class='reporterName'>Biologist " + $firstName + " " + $lastName + ":</p>";

                contentHtml += "<p class='item-detail-activity'>" + $reportActivityLevel + "<br>(" + GetActivityLevelImage($reportActivityLevel) + ") </p>";
                contentHtml += ($comments !== "") ? "<p class='item-detail-comment'>\"" + $comments + "\"</p>" : "";
                contentHtml += ($reportTime !== "Not Provided") ? "<p class='item-detail-property'>" + $reportTime + "</p>" : "";
                contentHtml += ($reportWaterfowlClass !== "Unknown") ? "<p class='item-detail-property'>" + $reportWaterfowlClass + "</p>" : "";
                contentHtml += ($reportWeather !== "Not Provided") ? "<p class='item-detail-property'>" + $reportWeather + "</p>" : "";
                contentHtml += ($reportTemp !== "Not Provided") ? "<p class='item-detail-property'>" + $reportTemp + "</p>" : "";
                contentHtml += ($reportWindDir !== "Not Provided" || $reportWindSpeed !== "Not Provided") ? "<p class='item-detail-property'>" : "";
                contentHtml += ($reportWindDir !== "Not Provided") ? "Wind " + $reportWindDir : "";
                contentHtml += ($reportWindSpeed !== "Not Provided") ? " (" + $reportWindSpeed + ")" : "";
                contentHtml += ($reportWindDir !== "Not Provided" || $reportWindSpeed !== "Not Provided") ? "</p>" : "";

                contentHtml += "<div id='report-detail-ad'>";
                contentHtml += "<iframe align=\"center\" id=\"iframeEmbedAdReportDetail\" frameborder=\"0\" width=\"300\" height=\"250\" scrolling=\"no\" src=\"resources/aspx/AdFrameEmbed1.aspx\"></iframe>";
                contentHtml += "</div>";
            }

            $("#modal-content-body").html(contentHtml);

            RefreshMobileReportDetailEmbedAd();

            reloadAd = false;
            DoAnalyticsAndAds("list/" + city_state, 'view', '', '');

            break;
        }
    }


    function GetActivityLevelImage(activityDesc)
    {
        return activityDesc.replace(/ /g, "").replace(/;/g, "").replace(/&/g, "").toLowerCase() + ".jpg";
    }

    ToggleModal(modalID, "show");
    HideExtendedFilterPanel();
    isZoomActive = false;

}
function showLayer(layer, state, sourceElementID) {
    switch (layer) {
        case "nwr":
            if (state) {
                AddNwrMarkers();
            } else {
                HideLayer(markersNwr);
            }
            break;
        case "project":
            if (state) {
                ToggleKmzLayer(0, true);
            } else {
                ToggleKmzLayer(0, false);
            }
            break;
    }
}

function HideLayer(markerArray) {
    setAllMap(null, markerArray);
}
function setAllMap(mapp, mrkrArray) {
    for (var i = 0; i < mrkrArray.length; i++) {
        mrkrArray[i].setMap(mapp);
    }
}

function ToggleModal(modalID, state) {
    $("#" + modalID).modal(state);
}

function openNav() {
    $("#mySidenav").css("width", "100%");
    DoAnalyticsAndAds("nav_open", "event", "", "click");
}

function closeNav() {
    $("#mySidenav").css("width", "0");
    DoAnalyticsAndAds("nav_close", "event", "", "click");
}

function returnToList() {
    $("#report-list-item-detail").animate({
        left: windowWidth,
        width: 0
    }, function () { $("#report-list-item-detail").css("display", "none"); });

    $("#report-list").animate({
        opacity: 1
    });

    previousScrollTop = 0;
}

function ExpandExtendedFilterPanel(obj)
{

    returnToList();

    activeFilter = $(obj).attr("data");

    var activeClass = $("#selectFilters-" + activeFilter + " > span").attr("class");

    if (activeClass == "down-caret") {
        ResetFilters();
        $("#selectFilters-" + activeFilter).removeClass("lowLite").addClass("hiLite");
        $("#selectFilters-" + activeFilter + " > span").removeClass("down-caret").addClass("open-caret");
        $("#fltr-ext-" + activeFilter).removeClass("hide").addClass("show");
        $("#filters-options-wrapper").slideDown("fast");
        DoAnalyticsAndAds("filter_open", "event", "", "click");
    } else {
        $("#selectFilters-" + activeFilter + " > span").removeClass("open-caret").addClass("down-caret");
        $("#selectFilters-" + activeFilter).removeClass("hiLite").addClass("lowLite");
        $("#filters-options-wrapper").slideUp("fast");
        DoAnalyticsAndAds("filter_close", "event", "", "click");
    }

    for (var f = 0; filterCategoriesArr.length; f++) {
        if (activeFilter == "activity") {
            isSliderEngaged = true;
        }
        if (activeFilter == filterCategoriesArr[f][0]) {
            activeFilterRuleIndex = f;
            break;
        }
    }
}

function LogFilterChange(filterCategory,sourceElementID) {

    cnt = 0;
    var splitParam = filterCategory.split("-");
    var totalFiltersChecked = 0;

    $("#reset-filters").css("visibility", "visible");
    $("#" + filterCategory).css("border", "1px solid red");
    isFiltersChanged = true;

    if (activeFilterRuleIndex !== 2) { //if not activity

        activeFilterRuleText = filterCategoriesArr[activeFilterRuleIndex][1];

        $.each(filterCategoriesArr[activeFilterRuleIndex][2], function (id, val) {
            if ($("#" + id).prop('checked')) {
                totalFiltersChecked++;
            }
        });

        if (totalFiltersChecked == 0) {
            if (activeFilterRuleText == "atLeastOne") {
                $.each(filterCategoriesArr[activeFilterRuleIndex][2], function (id, val) {
                    if (cnt == 0) {
                        $("#" + id).prop('checked', 'checked');
                    }
                    cnt++;
                });
            }
            if (activeFilterRuleText == "eitherOr") {

                if (sourceElementID == "radioFilterTimePeriodMorning") {
                    $("#radioFilterTimePeriodAfternoon").prop("checked", "checked");
                } else {
                    $("#radioFilterTimePeriodMorning").prop("checked", "checked");
                }
            }
        }
    }
}
function ResetFilters() {
    for (var f = 0; f < filterCategoriesArr.length; f++) {
        var activeFilter = $("#selectFilters-" + filterCategoriesArr[f][0]).attr("data");
        $("#selectFilters-" + activeFilter).removeClass("hiLite").addClass("lowLite");
        $("#selectFilters-" + activeFilter + " > span").removeClass("open-caret").addClass("down-caret");
        $("#fltr-ext-" + activeFilter).removeClass("show").addClass("hide");
        activeFilterRule = null;
    }
    //ResetFilterValues(); RP commented this out 8/31 9:30 am. Not sure this can be here if ResetFilters is going to be called in ExpandExtendedFilterPanel()

    /*
    HideLayer(markersNwr);
    $("#chkBoxFilterNWR").prop("checked", false);
    ToggleKmzLayer(0, false);
    $("#chkBoxFilterProject").prop("checked", false);
    */
    searchResultSelected.length = 0;
    
    //$("#report-search").removeClass("active").addClass("inactive");
    //CurrentDataSet.length = 0;

    DoAnalyticsAndAds("filter_reset", "event", "", "click");
}

function ResetFilterValues() {

    //autocomplete = null;

    ClearLocationSearch();
    ClearDateSearch();

    rDate = GetRelevantDateRange(seasonStartMonth + "/01/" + seasonStartYear);

    for (var f = 0; f < filterCategoriesArr.length; f++) {
        $("#selectFilters-" + filterCategoriesArr[f][0]).css("border", "1px solid #ccc");
        $("#selectFilters-" + filterCategoriesArr[f][0] + " > span").removeClass("open-caret").addClass("down-caret");

        $.each(filterCategoriesArr[f][2], function (id, val) {
            $("#" + id).prop("checked", (val == "checked") ? true : false);
            if (id == "activity-slider") {
                activitySliderObj.slider('refresh'); //or --> activitySliderObj.slider('setValue', val);
                $("#activity-label").html("Incoming: low numbers");
                isSliderEngaged = false;
            }
        });

    }

    isFiltersChanged = false;
    $("#reset-filters").css("visibility", "hidden");
    HideExtendedFilterPanel();

    activeDataSet = [];
    activeDataSet.length = 0;
    CurrentDataSet = [];
    CurrentDataSet.length = 0;

    if (currentView == "LIST") {
        PopulateListView(DefaultDataSet);
        if (!isMobile) { ShowBoundMarkers(); }
    } else {
        ShowBoundMarkers();
    }

    if (map) {
        map.setCenter(new google.maps.LatLng(mapDefaultCenterDesktop[0], mapDefaultCenterDesktop[1]));
        map.setZoom(mapDefaultZoom);
    }

    $('#report-list').animate({ scrollTop: $('#report-list').css("top") });

    HideLayer(markersNwr);
    $("#chkBoxFilterNWR").prop("checked", false);
    ToggleKmzLayer(0, false);
    $("#chkBoxFilterProject").prop("checked", false);

    $("#div-front-search-box").removeClass("search-active").addClass("search-inactive");

    isLocationSearch = false;
    isPlaceChange = false;
}

function ClearLocationSearch() {
    $("#report_panel_search_location").val('');
    $("#report-search").val("");
    $("#report-search-modal").modal('hide');
    $("#reset-filters").css("visibility", "hidden");
   // PopulateListView(DefaultDataSet);
    //alert("cleared");

    isLocationSearch = false;
}

function ClearDateSearch() {

    $("#report_panel_search_date_from").val("");
    $("#report_panel_search_date_to").val("");
    $('#report-search').val("");
    $("#report-search-modal").modal('hide');
    $("#reset-filters").css("visibility", "hidden");
    $("#report_panel_search_date_from").val(dThenStr);
    $("#report_panel_search_date_to").val(dNowStr);

    isDateRangeSearch = false;
}

function HideExtendedFilterPanel() {
    $("#filters-options-wrapper").slideUp("fast");
    ResetFilters();
}

/*
function ApplySearch() {

    isLocationSearch = true;

    SearchQuery();

    var tmp = new String(CurrentDataSet);

    var ds = CurrentDataSet;

    var tmpArr1 = [];
    tmpArr1.length = 0;

    for (var a1 = 0; a1 < ds[0].length; a1++) {

                    tmpArr1.push(ds[0][a1]);

        
    }

        if (currentView == "LIST") {
            PopulateListView(tmpArr1);
        } else {
            ShowBoundMarkers();
        }
        if (!isMobile) { ShowBoundMarkers(); }


    $('#report-list').animate({ scrollTop: 0 }, "fast");

    DoAnalyticsAndAds("apply_search", "event", "", "click");
}
*/

function ApplyFilters(isSearch) {


    var ds = [];
    ds.length = 0;

    if (isSearch) {

        SearchQuery();
        ds = CurrentDataSet;
        PopulateListView(ds);
        isLocationSearch = false;
        predictionsArr.length = 0;

    } else {

        HideExtendedFilterPanel();
        ds = DefaultDataSet;
        if (CreateFilteredDataSet(ds)) {
            if (currentView == "LIST") {
                PopulateListView(FilteredDataSet);
            } else {
               ShowBoundMarkers();
            }
            if (!isMobile) { ShowBoundMarkers(); }
        }
    }

    $('#report-list').animate({ scrollTop: 0 }, "fast");

    DoAnalyticsAndAds("apply_filters", "view", "", "");
}
function startProgressIconInContainer(container, text) {
    $(container).html("<img src='/resources/images/ring.gif'/><br>" + text);
}

function ToggleMapList()
{
    $("#map-container").css("display", "none");
    $("#report-list-container").css("display", "none");
    
    if (currentView == "MAP") {
        (bp=="xs" || bp=="sm") ? $("#filters-extras").css("display", "none") : null;
        $("#div-map-list-toggler").html("Map");
        currentView = "LIST";
        $(".column-2").removeClass("no-pointer-events").addClass("auto-pointer-events");

        DoAnalyticsAndAds("list", "view", "", "");

        //RP did this for now to keep the list from rebuilding every time if no filters were changed on the map view
        //consider splitting out the presentation (show/hide/fades) from the data population function of PopulateListView()

        //we have search results as well so we need to call client side reporistory. It won't go back to server. just find out the relevant data at this
        //moment.
       // if (isFiltersChanged) {
            PopulateListView(getRelevantDataSet());
       // }
       // else {
            $("#report-list").show();
            $("#report-list-container").fadeIn("fast");
       // }
    }
    else {
        $("#map-container").fadeIn();
        $("#filters-extras").css("display", "flex");
        $("#div-map-list-toggler").html("List");
        currentView = "MAP";
        $(".column-2").removeClass("auto-pointer-events").addClass("no-pointer-events");

        DoAnalyticsAndAds("map", "view", "", "");

        if (!isMapLoaded) {
            MigMap();
            isMapLoaded = true;
        }
        else {
            ShowBoundMarkers();
        }
    }
    HideExtendedFilterPanel();
}

function SetViewMode(viewMode) {
    if (viewMode == "list") {
        $("#map-container").css("display", "none");
        $("#report-list-container").css("display", "block");
        currentView = "LIST";

    } else {
        $("#map-container").css("display", "block");
        $("#report-list-container").css("display", "none");
        currentView = "MAP";
    }
}
function getRelevantDataSet() {
    activeDataSet = [];
    activeDataSet.length = 0;

    if (CurrentDataSet[0]) {
        activeDataSet.push(CurrentDataSet[0]);
    } else {
        activeDataSet = (isFiltersChanged) ? FilteredDataSet : DefaultDataSet;
    }
    return activeDataSet;
}
function listItemMouseOver(index)
{
    if (markers[index]) {

        markers[index].setIcon();
        markers[index].setAnimation(google.maps.Animation.BOUNCE);
        //markers[index].setIcon("https://www.ducks.org/migrationmap/resources/images/biologistIcon.png");

    /*    InfoBoxClose();
        if (!infoBoxExists) {
            PopulateInfoBox(markers[index], index, "public");
        }*/
    }
}

function listItemMouseOut(index)
{
    if (markers[index]) {

        //InfoBoxClose();
        markers[index].setAnimation(null);
        markers[index].setIcon("https://www.ducks.org/migrationmap/resources/images/publicIcon.png");

    }
}

function ZoomToLocation(lat, lng)
{
    if (map) {
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(10);
        DoAnalyticsAndAds("zoom/" + lat + ":" + lng, "event", "", "click");
    }
}

function IsWithinBounds(marker) {
    return map.getBounds().contains(marker.getPosition());
}

function deleteMarkers() {
    clearMarkers();
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function sort_unique(arr) {
    arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (arr[i - 1] !== arr[i]) {
            ret.push(arr[i]);
        }
    }
    return ret;
}

function DoAnalyticsAndAds(appender, trackType, trackName, trackValue) {

    try {
        //var sourceString = (isMobile) ? "/migrationMap/mobileweb/" + appender : "/migrationMap/" + appender;
        var sourceString = "/migrationMap/" + appender;

        switch (trackType) {
            case "view":
                pageTracker._trackPageview(sourceString);
                if (reloadAd) {
                    if (isMobile && isPortrait) {
                        //mobile
                        RefreshMobileFixedFooterAd();
                    } else {
                        //desktop

                    }
                }
                break;
            case "event":
                pageTracker._trackEvent(sourceString, trackValue);
                break;
        }
        reloadAd = true;
    }
    catch (err) { //
    }
}

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

function RefreshMobileFixedFooterAd() {
    //console.log("RefreshMobileFixedFooterAd");
    $('#iframeAnchorAd').attr('src', 'https://www.ducks.org/migrationmap/resources/aspx/AdFrameAnchor.aspx');
}

function RefreshMobileReportDetailEmbedAd() {
    //console.log("RefreshMobileReportDetailEmbedAd");
    $('#iframeEmbedAdReportDetail').attr('src', 'https://www.ducks.org/migrationmap/resources/aspx/AdFrameEmbed1.aspx');
}

function RefreshDesktopHeaderAd() {
    //console.log("RefreshDesktopHeaderAd");
    $('#iframeHeaderAd').attr('src', 'https://www.ducks.org/migrationmap/resources/aspx/AdFrameHeader.aspx');
}

function CreateFilteredDataSet(ds)
{
    var success = false;

    if (!ds) {
        ds = DefaultDataSet;
    }

    FilteredDataSet.length = 0;

    var tmpArr1 = [];
    tmpArr1.length = 0;

    var tmpArr2 = [];
    tmpArr2.length = 0;

    var tmpArr3 = [];
    tmpArr3.length = 0;

    var activeFilterArr = [];

    //type
    ($("#chkBoxFilterPublic").prop("checked")) ? activeFilterArr.push($("#chkBoxFilterPublic").val()) : null;
    ($("#chkBoxFilterBiologist").prop("checked")) ? activeFilterArr.push($("#chkBoxFilterBiologist").val()) : null;
    ($("#chkBoxFilterAlerts").prop("checked")) ? activeFilterArr.push($("#chkBoxFilterAlerts").val()) : null;

    //time-period
    //($("#radioFilterTimePeriodMorning").prop("checked")) ? activeFilterArr.push($("#radioFilterTimePeriodMorning").val()) : null;
    //($("#radioFilterTimePeriodAfternoon").prop("checked")) ? activeFilterArr.push($("#radioFilterTimePeriodAfternoon").val()) : null;


    //type
   // console.log(ds[0]);

    for (var a1 = 0; a1 < ds[0].length; a1++) {
        for (var f1 = 0; f1 < activeFilterArr.length; f1++) {
            if (ds[0][a1].ListItemType["#text"]) {
                if (ds[0][a1].ListItemType["#text"] == activeFilterArr[f1]) {
                    tmpArr1.push(ds[0][a1]);
                    break;
                }
            }
        }
    }

    //NOTE: time-period is not a required property. so we have to be careful. plus, "alerts" have no time-period value (or activity level)
    /*
    for (var a2 = 0; a2 < tmpArr1.length; a2++) {
        if (tmpArr1[a2].ListItemType["#text"] == "alerts" || tmpArr1[a2].ListItemType["#text"] == "biologist") {
            tmpArr2.push(tmpArr1[a2]);
        } {
            for (var f2 = 0; f2 < activeFilterArr.length; f2++) {
                //if (tmpArr1[a2].ReportTimeOfDay["#text"]) {
                console.log(tmpArr1[a2].ReportTimeOfDay["#text"].toLowerCase());
                    if (tmpArr1[a2].ReportTimeOfDay["#text"].toLowerCase().indexOf(activeFilterArr[f2].toLowerCase()) > 0) {
                        tmpArr2.push(tmpArr1[a2]);
                        break;
                    }
               // }
            }
        }
    }*/

    //$("#activity-label").text(value[1]);

    //CONSIDER CHANGING VALUES IN tb_MigrationMapActivityLevels_LU so they match with slider values.
    /*
    var alSplit, x, y;
    for (var a3 = 0; a3 < tmpArr2.length; a3++) {
        if (tmpArr2[a3].ListItemType["#text"] == "alerts" || tmpArr2[a3].ListItemType["#text"] == "biologist") {
            tmpArr3.push(tmpArr2[a3]);
        } else {
            for (var f3 = 0; f3 < activityLevelsArr.length; f3++) {
                if ($("#activity-label").text().indexOf(":") > -1) {
                    alSplit = $("#activity-label").text().split(":");
                    x = alSplit[1].substring(1, alSplit[1].length - 1);
                    y = tmpArr2[a3].ReportActivityLevel["#text"].toLowerCase();
                    if (y.indexOf(x) > -1) {
                        tmpArr3.push(tmpArr2[a3]);
                    }
                }
                else {
                    if ($("#activity-label").text() == tmpArr2[a3].ReportActivityLevel["#text"])
                        tmpArr3.push(tmpArr2[a3]);
                }
            }
        }
    }*/

    //CONSIDER CHANGING VALUES IN tb_MigrationMapActivityLevels_LU so they match with slider values.
    if (isSliderEngaged) {
        var alSplit, x, y;
        for (var a3 = 0; a3 < tmpArr1.length; a3++) {
            if (tmpArr1[a3].ListItemType["#text"] == "alerts" || tmpArr1[a3].ListItemType["#text"] == "biologist") {
                tmpArr3.push(tmpArr1[a3]);
            } else {
                for (var f3 = 0; f3 < activityLevelsArr.length; f3++) {
                    if ($("#activity-label").text().indexOf(":") > -1) {
                        alSplit = $("#activity-label").text().split(":");
                        x = alSplit[1].substring(1, alSplit[1].length - 1);
                        y = tmpArr1[a3].ReportActivityLevel["#text"].toLowerCase();
                        if (y.indexOf(x) > -1) {
                            tmpArr3.push(tmpArr1[a3]);
                        }
                        break;
                    }
                    else {
                        if ($("#activity-label").text() == tmpArr1[a3].ReportActivityLevel["#text"]) {
                            tmpArr3.push(tmpArr1[a3]);
                            break;
                        }
                    }
                }
            }
        }
        FilteredDataSet.push(tmpArr3);
    } else {
        FilteredDataSet.push(tmpArr1);
    }

    return true;
}

function GetData() {

    //$("#report-list").css("display","inline-block");

   //$("#report-list").html('<div style=\"padding:30px\"><img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING...</div>');

    var todayDate = new Date();
    var dateStart = GetFormattedStringDate(seasonStartMonth +"/01/"+seasonStartYear);
    var dateEnd = GetFormattedStringDate((todayDate.getMonth() + 1) + "/" + todayDate.getDate() + "/" + todayDate.getFullYear());

    var success = false;
    var promise = $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/faissah/presales-jahiacom/ducks/jahiacom-templates/src/site/GetLatestMigrationReportsMigrationAlertsCombinedDateRange.xml",
        dataType: "xml",
        async: false,
        /*success: function (data) {
            reportList_Success(data);
        },*/
        error: function (err) {
            //console.log("Data error: " + err.responseText);
            reportList_Failure("Sorry. The data could not be retrieved at this time");
        }
    });

    promise.done(function (data) {
        reportList_Success(data);
    });

    function reportList_Success(d) {

        currentView = "LIST";

        xmlAsJsonObj = xmlToJson(d);
        var itemType;

        $(xmlAsJsonObj).each(function (ind, val) {

            $.each(val, function (index, obj) {
                DefaultDataSet.push(obj.MigrationMapReportMigrationAlertCombined);
            });

            for (var a = 0; a < DefaultDataSet[0].length; a++) {

                if (DefaultDataSet[0][a]["ItemType"]["#text"] == "report") {
                    if (DefaultDataSet[0][a]["ReportUserTypeID"]["#text"] !== null) {
                        switch (parseInt(DefaultDataSet[0][a]["ReportUserTypeID"]["#text"])) {
                            case 5:
                                itemType = "biologist";
                                break;
                            default:
                                itemType = "public";
                                break;
                        }
                    }
                } else {
                    itemType = "alerts";
                }

                DefaultDataSet[0][a].ListItemType = { '#text': itemType };
            }
        });

        success = true;
    }

    function reportList_Failure(errString) {
        $("#report-list").html(errString);
    }
    return success;
}

function GetFormattedStringDate(d) {
    var dtmp = new Date(d); 
    var outDate = dtmp.getFullYear() +
        ('0' + (dtmp.getMonth() + 1)).slice(-2) +
        ('0' + dtmp.getDate()).slice(-2);
    return outDate;
}

function GetActiveDataSet() {

    if (CurrentDataSet.length == 0) {
        CurrentDataSet = (isFiltersChanged) ? FilteredDataSet : DefaultDataSet;
    }

    return CurrentDataSet;
}

//NWR:START
function AddNwrMarkers() {

    markerCount = 0;

    for (var m = 0; m < nwrNames.length; m++) {

        latlng = new google.maps.LatLng(nwrLats[m], nwrLons[m]);

        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            icon: resourcesImagePath + nwrIcon
        });

        markersNwr.push(marker);

        //AddToFlyway(marker, nwrFlyways[m], 'nwr');

        google.maps.event.addListener(marker, 'click', (function (marker, markerCount) {
            return function () {
                InfoBoxClose();
                PopulateInfoBoxNwr(marker, markerCount);
            };
        })(marker, markerCount));

        markerCount++;
        markerGlobalCount++;
    }
}

/*NWR frame start*/
function NWR(nwr, city, state, url) {

    $("#h4ModelHeaderGlobalModal").html("<div class='col-md-12'>" + nwr + " - " + city + ", " + state + "</div>");
    $("#divModalContentGlobalModal").html("<div class='col-md-12'><div align=\"center\"><br><a href=\"" + url + "\" target=\"_blank\">" + url + "</a><br><br></div></div>");
    $("#GlobalModal").modal('show');
    $('#divToolbarNavToggle').click();
    var nwrStr = nwr.replace(/ /g, "_");
    DoAnalyticsAndAds('NWR/' + nwrStr, 'view', '', '');
}
/*NWR frame stop*/

//NWR:END

//PROJECTS KMZ:START
function InitKmzLayers() {

    for (var k = 0; k < kmzUrls.length; k++) {
        kmzLayers[k] = new google.maps.KmlLayer(kmzUrls[k], { preserveViewport: true });
    }
    for (var i = 0; i < kmzLayers.length; i++) {
        kmzLayers[i].setMap(null);
    }
}
function ToggleKmzLayer(i, state) {
    try {
        if (state) {
            kmzLayers[i].setMap(map);
            isKmzActive = true;
            //$("#divPublicHuntingDisclaimer").css("display", "block");
            DoAnalyticsAndAds('projects/show' , 'view', '', '');
        }
        else {
            kmzLayers[i].setMap(null);
            isKmzActive = false;
            //$("#divPublicHuntingDisclaimer").css("display", "none");
            DoAnalyticsAndAds('projects/hide', 'view', '', '');
        }
    }
    catch (err) { // 
    }
}
//PROJECTS KMZ:END


//INFO BOX: START
function PopulatePublicInfoBox(mrkr, infoBoxIndex, markerType) {

    var contentString = new String();

    var reportLocation = mrkr.location;

    var markerID = new String(mrkr.id);

    var reportID = markerID.split("_")[1];

    contentString = "<div class='infoWindowWrapper'>";
    //contentString += "<div class='infoWindowPublicHeader'>";
    //contentString += mrkr.itemType.toUpperCase() + " REPORT";
    //contentString += "</div>"
    contentString += "<div id='infoContent" + infoBoxIndex + "' class='infoWindowContent'  onmouseover='Moused(true," + infoBoxIndex + ")' onmouseout='Moused(false," + infoBoxIndex + ")'>";
    contentString += "<p style=\"font-size:14pt\">" + reportLocation + "</p>";

    //var dateRange = GetRelevantDateRange(mrkr.reportDate); 
    var dateRange = GetRelevantDateRange(seasonStartMonth + "/1/" + seasonStartYear);

    //headerText, lat, lon, feWebID, startDate, endDate, seasonYear, zip, showReportDetailModalDropDown, flywayIndex

    contentString += "<div style='width:100%'><a class=\"button\" href='javascript:GetLocationReports(\"" + mrkr.location + "\", \"" + mrkr.position.lat() + "\",\"" + mrkr.position.lng() + "\",\"" + mrkr.webID + "\",\"" + dateRange[0] + "\",\"" + dateRange[1] + "\",\"" + mrkr.reportYear + "\",\"" + mrkr.zip + "\",true,0, " + reportID + ")'>View Reports</a></div>";

    contentString += "</div>";

    boxText = document.createElement("div");
    boxText.innerHTML = contentString;

    infoboxOptions = {
        content: boxText
        , disableAutoPan: false
        , maxWidth: 0
        , pixelOffset: new google.maps.Size(10, -40)
        , zIndex: null
        , boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
            , opacity: 1
            , width: "350px"
        }
        , closeBoxMargin: "5px 8px 2px 2px"
        , closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        , infoBoxClearance: new google.maps.Size(1, 1)
        , isHidden: false
        , pane: "floatPane"
        , enableEventPropagation: false
    };

    infobox = new InfoBox(infoboxOptions);
    infobox = new google.maps.InfoWindow({ content: contentString });
    infobox.open(map, mrkr);
    infoBoxExists = true;
}

function PopulateBiologistInfoBox(mrkr, infoBoxIndex, markerType) {

    var contentString = new String();

    var reportLocation = mrkr.location;

    var markerID = new String(mrkr.id);

    var reportID = markerID.split("_")[1];

    contentString = "<div class='infoWindowWrapper'>";
    contentString += "<div class='infoWindowPublicHeader'>";
    contentString += mrkr.itemType.toUpperCase() + " REPORT";
    contentString += "</div>"
    contentString += "<div id='infoContent" + infoBoxIndex + "' class='infoWindowContent'  onmouseover='Moused(true," + infoBoxIndex + ")' onmouseout='Moused(false," + infoBoxIndex + ")'>";
    contentString += "<p style=\"font-size:14pt\">" + reportLocation + "</p>";

    var dateRange = GetRelevantDateRange(seasonStartMonth + "/1/" + seasonStartYear);

    //contentString += "<div style='width:100%'><a class=\"button\" href='javascript:GetLocationReports(\"" + mrkr.location + "\", \"" + mrkr.position.lat() + "\",\"" + mrkr.position.lng() + "\",\"" + mrkr.webID + "\",\"" + dateRange[0] + "\",\"" + dateRange[1] + "\",\"" + mrkr.reportYear + "\",\"" + mrkr.zip + "\",true,0, " + reportID+")'>View Report</a></div>";

    contentString += "<div style='width:100%'><a class=\"button\" href='javascript:ViewReportDetailsBiologist(\"" + mrkr.location + "\",\"" + mrkr.position.lat() + "\",\"" + mrkr.position.lng() + "\",\"" + mrkr.zip + "\",true)'>View Reports</a></div>";
    contentString += "</div>";

    boxText = document.createElement("div");
    boxText.innerHTML = contentString;

    infoboxOptions = {
        content: boxText
        , disableAutoPan: false
        , maxWidth: 0
        , pixelOffset: new google.maps.Size(10, -40)
        , zIndex: null
        , boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
            , opacity: 1
            , width: "350px"
        }
        , closeBoxMargin: "5px 8px 2px 2px"
        , closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        , infoBoxClearance: new google.maps.Size(1, 1)
        , isHidden: false
        , pane: "floatPane"
        , enableEventPropagation: false
    };

    infobox = new InfoBox(infoboxOptions);
    infobox = new google.maps.InfoWindow({ content: contentString });
    infobox.open(map, mrkr);
    infoBoxExists = true;
}

function PopulateAlertInfoBox(mrkr, infoBoxIndex, markerType) {

    var contentString = new String();

    var reportLocation = mrkr.location;

    contentString = "<div class='infoWindowWrapper'>";
    contentString += "<div class='infoWindowPublicHeader'>";
    contentString += "MIGRATION ALERT";
    contentString += "</div>";
    contentString += "<div id='infoContent" + infoBoxIndex + "' class='infoWindowContent'  onmouseover='Moused(true," + infoBoxIndex + ")' onmouseout='Moused(false," + infoBoxIndex + ")'>";
    contentString += "<p style=\"font-size:14pt\">" + reportLocation + "</p>";


    contentString += "<div style='width:100%'><a class=\"button\" href='javascript:OpenWindow(\""+mrkr.alertUrl+"\")'>View Alert</a></div>";

    contentString += "</div>";

    boxText = document.createElement("div");
    boxText.innerHTML = contentString;

    infoboxOptions = {
        content: boxText
        , disableAutoPan: false
        , maxWidth: 0
        , pixelOffset: new google.maps.Size(10, -40)
        , zIndex: null
        , boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
            , opacity: 1
            , width: "350px"
        }
        , closeBoxMargin: "5px 8px 2px 2px"
        , closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        , infoBoxClearance: new google.maps.Size(1, 1)
        , isHidden: false
        , pane: "floatPane"
        , enableEventPropagation: false
    };

    infobox = new InfoBox(infoboxOptions);
    infobox = new google.maps.InfoWindow({ content: contentString });
    infobox.open(map, mrkr);
    infoBoxExists = true;
}

function PopulateInfoBoxNwr(mrkr, infoBoxIndex) {

    var contentString = new String();
    var name, url, city, state, lat, lon;

    name = nwrNames[infoBoxIndex];
    url = nwrUrls[infoBoxIndex];
    city = nwrCities[infoBoxIndex];
    state = nwrStates[infoBoxIndex];
    lat = nwrLats[infoBoxIndex];
    lon = nwrLons[infoBoxIndex];

    contentString = "<div class='infoWindowWrapper'>";
    contentString += "<div class='infoWindowNwrHeader'>";
    contentString += nwrCallOutTitle; // + ((isFlywayView) ? " - " + flyways[mrkr.flywayIndex] + " Flyway" : "");
    contentString += "</div>"
    contentString += "<div id='infoContentNwr" + infoBoxIndex + "' class='infoWindowContent'  onmouseover='Moused(true," + infoBoxIndex + ")' onmouseout='Moused(false," + infoBoxIndex + ")'>"
    contentString += "<div ID=\"infoBoxNwr" + infoBoxIndex + "\" class=\"divInfoBox public\"><img align=\"right\" hspace=\"10\" height=\"35\" src=\"resources/images/fws_nwr_logos.png\"/><big><b>" + name + "</b></big><br><br><big>" + city + ", " + state + "</big><br><br>";
    contentString += "<a href=\"javascript:NWR('" + name + "','" + city + "','" + state + "','" + url + "')\">Learn more</a><br><div class=\"callOutHoverText\" id=\"spanInfoBoxNwr" + infoBoxIndex + "CalloutTip\"></div></div><div class=\"divInfoBoxArrow\"></div>";
    contentString += "<br><br>";
    //contentString += "<a href='javascript:ViewForecast(\"" + lat + "\",\"" + lon + "\",\"" + name + "\"," + mrkr.flywayIndex + ")'>" + calloutWeatherIcon + "</a>";
    contentString += "</div>";
    contentString += "</div>";

    boxText = document.createElement("div");
    boxText.innerHTML = contentString;

    infoboxOptions = {
        content: boxText
        , disableAutoPan: false
        , maxWidth: 0
        , pixelOffset: new google.maps.Size(10, -40)
        , zIndex: null
        , boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
            , opacity: 1
            , width: "300px"
        }
        , closeBoxMargin: "5px 8px 2px 2px"
        , closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        , infoBoxClearance: new google.maps.Size(1, 1)
        , isHidden: false
        , pane: "floatPane"
        , enableEventPropagation: false
    };

    //infobox = new InfoBox(infoboxOptions);
    infobox = new google.maps.InfoWindow({ content: contentString });
    infobox.open(map, mrkr);
    infoBoxExists = true;
}

function CreateGoogleAnalyticsString(markerType, action, value) {
    var gaStringDynamic = gaStringBase;
    gaStringDynamic += "/" + markerType + "/" + action + "/" + value;
    return gaStringDynamic;
}

function GetRelevantDateRange(d) {
    var fromDate = ($("#report_panel_search_date_from").val() == "") ? d : $("#report_panel_search_date_from").val();
    var dNow = new Date();
    dNow.setDate(dNow.getDate() + 1);
    var dNowStr = dNow.getMonth() + 1 + "/" + dNow.getDate() + "/" + dNow.getFullYear();
    var toDate = ($("#report_panel_search_date_to").val() == "") ? dNowStr : $("#report_panel_search_date_to").val();
    return [fromDate, toDate];
}

function InfoBoxClose() {
    if (infoBoxExists) {
        infobox.close();
        infoBoxExists = false;
        isInfoBoxHovering = false;
    }
}

function Moused(bool, index) {
    if (!bool) {
        isInfoBoxHovering = false;
    } else {
        isInfoBoxHovering = true;
    }
}
//INFO BOX: END

//SEARCH: START


//SEARCH: END

//GLOBAL MODEL: START

function ToggleGlobalModal(modalDesc, visibility) { //"show", "hide"
    $("#divModalContent" + modalDesc).modal(visibility);

}

//GLOBAL MODEL: END

function GetBreakpoint() {
    width = $(window).width();

    var breakpoint = "xs";

    if (width >= 768) {
        breakpoint = "sm";
    }

    if (width >= 992) {
        breakpoint = "md";
    }

    if (width >= 1200) {
        breakpoint = "lg";
    }

    return breakpoint;
}

function ToggleListVisibility() {
    console.log($(".column-2").width());
    if ($(".column-2").width() > 50) {
        //$(".column-2").hide();

        $(".column-2").animate({
            maxWidth: "5"
        }, 50, function () {
        });
    }
    else {
        //$(".column-2").show();
        $(".column-2").animate({
            maxWidth: "500"
        }, 50, function () {
        });
    }
}

function GetMapStyle() {

    var mapStyle = new google.maps.StyledMapType(
        [
            {
                "featureType": "water",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#b5cbe4"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "stylers": [
                    {
                        "color": "#efefef"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#83a5b0"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#bdcdd3"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e3eed3"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 33
                    }
                ]
            },
            {
                "featureType": "road"
            },
            {
                "featureType": "poi.park",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {},
            {
                "featureType": "road",
                "stylers": [
                    {
                        "lightness": 20
                    }
                ]
            }
        ]
    );

    return mapStyle;
}

function ClearInput(input) {
    if (input.length > 0) {
        $(input).val('');
        $(input).focus();
    }
}

function ConvertActivityLevelDisplay(strLevel) {

    switch (strLevel.toLowerCase()) {
        case "no migration; few local birds":
            strLevel = "Incoming: low numbers";
            break;
        case "low numbers; migration starting":
            strLevel = "Incoming: low numbers";
            break;
        case "increasing numbers & migrations":
            strLevel = "Incoming: increasing numbers";
            break;
        case "near peak numbers & migration":
            strLevel = "Peak numbers";
            break;
        case "peak numbers":
            strLevel = "Peak numbers";
            break;
        case "declining numbers":
            strLevel = "Outgoing: decreasing numbers";
            break;
        case "substantially lower numbers":
            strLevel = "Outgoing: low numbers";
            break;
        case "only a few local birds remain":
            strLevel = "Outgoing: low numbers";
            break;
        case "no ducks remain":
            strLevel = "Outgoing: low numbers";
            break;
    }

    return strLevel;
}