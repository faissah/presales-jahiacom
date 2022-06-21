/*PLACE AUTOCOMPLETE:START*/

// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
//?key=YOUR_API_KEY&libraries=places"
var dNowStr, dThenStr;
var isLocationSearch = false;
var isDateRangeSearch = false;
var predictionsArr = [];

$(document).ready(function () {
    initSearchAutocomplete();
    initSearchDate();
});

var placeSearch, autocomplete, isPlaceChange = false;

var componentForm = {
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name'
};

function initSearchAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('report_panel_search_location'), {
          types: ['(regions)'],
          componentRestrictions: { country: ["us","can"] }
      });

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
    autocomplete.setFields(['address_components','geometry']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
    
    autocomplete.addListener('place_changed', fillInAddress);

}

function CheckForPlaceChanged(el) {
    //console.log("check for place changed");
}

function fillInAddress() {

    isFiltersChanged = true;

    $("#reset-filters").css("visibility", "visible");

    $("#div-no-prediction-used-alert").css("display", "none");

    strout = "";

    //results from api
    if ($("#report_panel_search_location").val() != "") {

        var place = autocomplete.getPlace();

        var placeStr = new String(place);
        
        searchResultSelected.length = 0;

        if (placeStr != "undefined") {
            if (!place.address_components) {
                strout = place.name;
            } else {
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressObj = place.address_components[i];
                    for (var j = 0; j < addressObj.types.length; j += 1) {
                        if (addressObj.types[j] === 'country' || addressObj.types[j] === 'locality' || addressObj.types[j] === 'administrative_area_level_1') {

                            if (addressObj.types[j] === 'locality') {
                                searchResultSelected[0] = addressObj.short_name;
                            }
                            if (addressObj.types[j] === 'administrative_area_level_1') {
                                searchResultSelected[1] = addressObj.short_name;
                            }
                        }
                    }
                }

                var cityTmp = new String(searchResultSelected[0]);
                strout = searchResultSelected[0] + " " + searchResultSelected[1];

                if (cityTmp == "undefined") {
                    strout = searchResultSelected[1];
                }
                predictionsArr.push(strout);

                DoAnalyticsAndAds("search/" + strout.replace(" ", "_"), 'event', '', 'place_changed');

                //CreateRecentCookie(strout, strout);
            }

            //picked result
            //$("#div-autocomplete-result").html(strout.substring(0, strout.length - 1));
            $("#report-search").val(strout);
            $("#div-front-search-box").addClass("search-active");
        }
    }
}

function SearchQuery() {

    var command = new String();
    var dataString = new String();

    if (searchResultSelected.length == 0) {
        searchResultSelected[0] = "";
        searchResultSelected[1] = "";
        isLocationSearch = false;
    } else {
        isLocationSearch = true;
    }

    var cityTmp = new String(searchResultSelected[0]);
    var isStateOnlySearch = (cityTmp == "undefined" && searchResultSelected[1] != "");
    var rDate = GetRelevantDateRange(seasonStartMonth + "/1/" + seasonStartYear);

    if ($("#report_panel_search_location").val() != "" && predictionsArr.length == 0) {
        $("#div-no-prediction-used-alert").css("display", "inline-block");
       //$("#report_panel_search_location").val('');
        $("#report_panel_search_location").focus();
    }
    else {
        if (isStateOnlySearch) {
            command = "GetLatestMigrationReportsMigrationALertsCombinedByState";
            dataString = "state=" + searchResultSelected[1] + "&startDate=" + GetFormattedStringDate(rDate[0]) + "&endDate=" + GetFormattedStringDate(rDate[1]);
        } else {
            command = "GetLatestMigrationReportsByCityStateRadiusCombined";
            dataString = "city=" + searchResultSelected[0] + "&state=" + searchResultSelected[1] + "&radius=100&startDate=" + GetFormattedStringDate(rDate[0]) + "&endDate=" + GetFormattedStringDate(rDate[1]);
        }

        var promise = $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx?action=" + command,
            data: dataString,
            dataType: "xml",
            async: false,
            error: function (err) {
                reportList_Failure("Sorry. The data could not be retrieved at this time");
            }
        });

        promise.done(function (data) {
            searchStateList_Success(data);
        });
    }
}

function searchStateList_Success(d) {

    srchLocation = null;

    CurrentDataSet.length = 0;

    var stroutArr = [];
    stroutArr.length = 0;

    if (d) {
        xmlAsJsonObj = xmlToJson(d);
        var itemType;
        var cnt = 0;

        //console.log(isLocationSearch + ":" + isDateRangeSearch);

        $(xmlAsJsonObj).each(function (ind, val) {
            $.each(val, function (index, obj) {
                if (isLocationSearch || isDateRangeSearch) {
                    CurrentDataSet.push(obj.MigrationMapReportMigrationAlertCombined);
                } else {
                    CurrentDataSet.push(obj.MigrationReport);
                }
            });
        });
    }

    var tmpVal = new String(CurrentDataSet);

    if (tmpVal == "[object Object]") {
        CurrentDataSet[0] = [CurrentDataSet[0]]; // <-- don't get me started
    }

    //if (tmpVal != "undefined") {

        if (CurrentDataSet[0]) {

            for (var a = 0; a < CurrentDataSet[0].length; a++) {

                if (a == 0 && (searchResultSelected[0] != "" || searchResultSelected[1] != "")) {
                    srchLocation = new google.maps.LatLng(CurrentDataSet[0][a]["ReportLat"]["#text"], CurrentDataSet[0][a]["ReportLong"]["#text"]);
                }

                //if (IsAllowableDateRange(CurrentDataSet[0][a]["ReportSubmitDate"]["#text"])) {
                if (CurrentDataSet[0][a]["ItemType"]["#text"] == "report") {
                    if (CurrentDataSet[0][a]["ReportUserTypeID"]["#text"] !== null) {
                        switch (parseInt(CurrentDataSet[0][a]["ReportUserTypeID"]["#text"])) {
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

                CurrentDataSet[0][a].ListItemType = { '#text': itemType };

                ///stroutArr.push(CurrentDataSet[0][a]);
                cnt++;
                //}
            }
        }
    //}
   // CurrentDataSet.length = 0;
    //CurrentDataSet.push(stroutArr);


    $("#report-search-modal").modal('hide');
    //}
    if (srchLocation) {
        if (isMapLoaded) {
            map.setZoom(7);
            map.panTo(srchLocation);
        }
    }
}

    function reportList_Failure(d) {
        //alert(d); //don't alert errors, use console
    }


function IsAllowableDateRange(d) {

    var isAllowed = false;
    var aDate = new Date(d);

    var srchDateFrom, srchDateTo;

    if ($("#report_panel_search_date_from").val() != "") {
        srchDateFrom = new Date($("#report_panel_search_date_from").val());
        if (aDate > srchDateFrom) {
            isAllowed = true;
        } else {
            isAllowed = false;
        }
    }

    if ($("#report_panel_search_date_to").val() != "") {
        srchDateTo = new Date($("#report_panel_search_date_to").val());
        if (aDate < srchDateTo) {
            isAllowed = true;
        } else {
            isAllowed = false;
        }
    }


    if ($("#report_panel_search_date_from").val() == "" && $("#report_panel_search_date_to").val() == "" && aDate > new Date(seasonStartMonth + "/1/" + seasonStartYear)) {
        isAllowed = true;
    }

    //console.log(isAllowed + " " + aDate);
    return isAllowed;
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
        autocomplete.setBounds(circle.getBounds());
    });
  }
}

/*PLACE AUTOCOMPLETE:END*/

function initSearchDate()
{
    //var dNow = new Date();
    //var dThen = new Date();
    //dThen.setDate(dNow.getDate() - 2);
    //dNowStr = dNow.getMonth() + 1 + "/" + dNow.getDate() + "/" + dNow.getFullYear()
    //dThenStr = dThen.getMonth() + 1 + "/" + dThen.getDate() + "/" + dThen.getFullYear();

    $('#report_panel_search_date_from').datepicker("setDate", dThenStr);
    $('#report_panel_search_date_to').datepicker("setDate", dNowStr);

    $('#report_panel_search_date_from').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '09/01/2008',
        autoclose: true,
        container: "#div_datepicker_from"
    }).on("changeDate", function () { $("#reset-filters").css("visibility", "visible"); isDateRangeSearch = true;});

    $('#report_panel_search_date_to').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '09/01/2008',
        autoclose: true,
        container: "#div_datepicker_to"
    }).on("changeDate", function () { $("#reset-filters").css("visibility", "visible"); isDateRangeSearch = true;});

}