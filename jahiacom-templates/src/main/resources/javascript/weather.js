var showForecast = true;
var checkedItemID = new String();
var checkedItemValue = new String();
var dataType = new String();
var timeSpan = new String();
var weatherLabel;
var accumDaySelected = 1;
var selectedSnowMapDate;
var weatherStoreApiTileBaseUrl = "https://api.weather.com/v3/TileServer/"
var tsRadar, tsRadarArr, tsTemp, tsWind, tsClouds, tsPrecipFcst, ftsPrecipFcst, tsSnowFcst, ftsSnowFcst, tsRadarFcst, ftsRadarFcst, tsTempFcst, ftsTempFcst;
var ftsTempArray = [];
var ftsPrecip24FtsArray = [];
var ftsRadarFcstFtsArray = [];
var ftsSnow24FtsArray = [];
var ftsTempFcstFtsArray = [];
var dayOfWeekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var timer;
var weatherLoopCounter = 0;
var tileObjArr = [];
var layouts = new Object();
var targetLat, targetLon;

function PreloadWeather() {
    if (url.indexOf("?radar") >= 0) {
        CreateWeatherTileLayer("radar", "reflectivity_w_wintermask");
    }
    if (url.indexOf("?temperature") >= 0) {
        CreateWeatherTileLayer("forecast", "temperature");
    }
}

function DisplayCityForecast(mrkr, index) {
    var reportLocation, last, lon;
    reportLocation = weatherCitiesText[index];
    lat = weatherCitiesDataLat[index];
    lon = weatherCitiesDataLon[index];
    ViewForecast(lat, lon, reportLocation);
}

function ViewForecast(lat, lon, locationName)
{
    targetLat = lat;
    targetLon = lon;
    var wUrl = "https://api.weather.gov/points/" + lat + "," + lon + "/forecast";
    $("#divReportScroller").html('<div style=\"padding:30px\"><img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING...</div>');

    $.ajax({
        type: "GET",
        url: wUrl,
        dataType: "html",
        success: function (data) {
            ViewForecastSuccess(data);
            DoAnalyticsAndAds("weather/" + locationName, "view", "", "");
        },
        error: function (data) {
            ViewForecastError(data);
        }
    });

    //$("#seasonDropDown").css("display", "none");
    $("#reportsHeader").css("display", "none");

    
    
}
function ViewForecastSuccess(result)
{
    switchLinks("Weather");
    var json = $.parseJSON(result);
    DrawWeatherForecastGrid($(json.properties.periods));
}
function ViewForecastError(result) {
    $("#divReportScroller").html('<div style=\"padding:30px\">Sorry, weather data currently unavailable.</div>');
}
function DrawWeatherForecastGrid(wData) {
    var temperatureType;

    var wStrout = new String();

    //HIDE WEATHER RADAR - NOTE ALSO - LAST STATEMENT OF THIS METHOD WHICH LOADS DATA
    /*
    wStrout += "<h4>Current Radar</h4>";
    wStrout += "<iframe id='iframeReportLocationWeather'>";
    wStrout += "</iframe>";
	*/

    wStrout += "<h4>Forecast</h4><hr/>";

    $.each(wData, function (index, item) {
        if (index < 10) {

            wStrout += "<div class='clsNwsWthrFrctWrapper'>";
                wStrout += "<div class='clsNwsWthrFrctItemHeader'>";
                wStrout += item.name + "<hr/>";
                //wStrout += "<div class='clsNwsWthrFrctItemHeaderRight'>" + ConvertToFriendlyDate(item.startTime) + "</div>";
                wStrout += "</div>";
                wStrout += "<div class='clsNwsWthrFrctItemIcon'>";
                wStrout += "<img src='" + item.icon + "'/>";
                wStrout += "</div>";
                wStrout += "<div class='clsNwsWthrFrctItemBody'>";
                //wStrout += "<span class='clsSpanWthrFrctItemSubHead'>" + item.shortForecast + "</span>";
                wStrout += "<p>" + item.temperature + " &deg;<br/>" + item.detailedForecast + "<p>";
                wStrout += "</div>";
                //wStrout += "<div class='clsNwsWthrFrctItemFooter'>";
                //wStrout += "<hr>";
                //wStrout += "</div>";
                wStrout += "</div>";

            temperatureType = item.temperatureUnit;
        }
    });

    wStrout += "<sup>&deg; = "+temperatureType+"</sup>";
    $("#divReportScroller").html(wStrout);

    //now load weather map iframe
    $("#iframeReportLocationWeather").attr("src", "resources/aspx/reportLocationWeatherFrame.aspx?lat=" + targetLat + "&lon=" + targetLon);

}
function ConvertToFriendlyDate(hostileDate)
{
    var fDateItems = new String(new String(hostileDate).split("T")[0]).split("-");
    return parseInt(fDateItems[1]) + "-" + parseInt(fDateItems[2]) + "-" + parseInt(fDateItems[0]);
}

/*ORIGINAL:START*/
/*
function ViewForecast(lat, lon, locationName) {

    console.log(lat + "_" + lon + "_" + locationName);

    var flyway = new String();
    if (flywayIndex != null) {
        flyway = ((isFlywayView) ? " - " + flyways[flywayIndex] + " Flyway" : "");
    }
    var city_state = locationName.replace(", ", "_");

    var duKey = "wg409p7y6t5r4e";
    strLocationName = locationName;

    $("#divReportScroller").html('<div style=\"padding:30px\"><img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING...</div>');

    $("#seasonDropDown").html("");

    $.ajax({
        type: "GET",
        url: "resources/svc/weather.svc/GetForecastHtml?r=" + Math.random(),
        dataType: "html",
        data: "key=" + duKey + "&lat=" + lat + "&lon=" + lon + "&locationName=" + strLocationName,
        success: function (data) {
            ViewForecastSuccess(data);
        },
        error: function (data) {
            ViewForecastError(data);
        }
    });

    switchLinks("Weather");
    $('#iframeEmbedAd1').attr('src', 'resources/aspx/AdFrameEmbed1.aspx')
}

function ViewForecastSuccess(result) {
    result = result.replace('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">', '');
    result = result.replace("</string>", '');

    if (showForecast) {
        $("#divReportScroller").html($('<div>').html(result).text());

    } else {
        $("#divReportScroller").html("<div style=\"padding:30px\">We're sorry, but five-day forecasts for Canadian cities are not available at this time.</div>");
    }

}

function ViewForecastError(result) {
    //alert(result);
    $("#divReportScroller").html('<div style=\"padding:30px\">Sorry, weather data currently unavailable.</div>' + result.responseText);
}
*/
/*ORIGINAL:END*/
function CheckWeatherItem(itemName) {
    if (document.getElementById(itemName)) {
        document.getElementById(itemName).checked = true;
    }
    document.getElementById("divWeatherControlsClear").style.display = "";
}

function ClearWeatherTileLayer() {
    map.overlayMapTypes.clear();
    //ClearWeather();
}

function ClearWeather() {
    for (var n = 0; n < navRadioGroups.length; n++) {
        $('#wthrRadio' + navRadioGroups[n]).attr("checked", false);
    }
    SetMapType(defaultMapTypeIndex);
    //$("#divAccumDaysSelector").css("display", "none");
    $("#divForecastEpochSelector").css("display", "none");
    $("#selectAccumDays")[0].selectedIndex = 0;
    accumDaySelected = 1;
    $("#divWeatherLabel").css("display", "none");
    document.getElementById("divWeatherLabel").innerHTML = "";
    StopAnimateLayer();
    $("#spanStartRadar").css("display", "none");
    $("#spanStopRadar").css("display", "none");
}

function PopulateWeatherCoreData()
{
    var dataString = "apiKey=" + theWeatherStoreApiKey;
    $.ajax({
        type: "GET",
        url: weatherStoreApiTileBaseUrl + "series/productSet/PPAcore",
        crossDomain: true,
        data: dataString,
        dataType: "json",
        async: false,
        success: function (msg) {
            var d = msg.seriesInfo;

            tsRadar = parseInt(d.radar.series[0].ts);

            //note: animation testing.
            //the d.radar.series is an array of radar set snapshot times (epochs).
            //first index is most recent. increasing indexes move backward in time.
            //this is the key to animation. so, we should be able to loop
            //through a list of sets to create an animation
            tsRadarArr = d.radar.series;

            tsTemp = parseInt(d.temp.series[0].ts);
            tsWind = parseInt(d.windSpeed.series[0].ts);
            tsClouds = parseInt(d.satrad.series[0].ts);
            tsPrecipFcst = parseInt(d.precip24hrFcst.series[0].ts);
            ftsPrecipFcst = parseInt(d.precip24hrFcst.series[0].fts[12]);
            tsSnowFcst = parseInt(d.snow24hrFcst.series[0].ts);
            ftsSnowFcst = parseInt(d.snow24hrFcst.series[0].fts[12]);
            tsRadarFcst = parseInt(d.radarFcst.series[0].ts);
            ftsRadarFcst = parseInt(d.radarFcst.series[0].fts[12]);
            tsTempFcst = parseInt(d.tempFcst.series[0].ts);
            ftsTempFcst = parseInt(d.tempFcst.series[0].fts[12]);

            ftsPrecip24FtsArray = d.precip24hrFcst.series[0].fts;
            ftsSnow24FtsArray = d.snow24hrFcst.series[0].fts;
            ftsRadarFcstFtsArray = d.radarFcst.series[0].fts;
            ftsTempFcstFtsArray = d.radarFcst.series[0].fts;

            //console.log("INDEX 0: " + d.radar.series[0].ts + "(" + GetEpochDate(d.radar.series[0].ts,'') + ")");
            //console.log("LAST INDEX: " + d.radar.series[d.radar.series.length - 1].ts + "(" + GetEpochDate(d.radar.series[d.radar.series.length - 1].ts, '') + ")");

 
        },
        error: function (err) {
            alert("weather data unreachable");
        }
    });
}

function PopulateForecastFtsDropDown(arr,sourceItem)
{
    $('#selectForecastDays').empty();
    for (var i = arr.length; i--;) {
        if (IsEpochInTheFuture(arr[i])) {
            $('#selectForecastDays').append($('<option>', {
                value: arr[i],
                text: GetEpochDate(arr[i], sourceItem)
            }));
        }
    }
}
function CreateWeatherTileLayer(dataType, dataVariable, isTileLayer, sourceItemId) {

    var ts;

    StopAnimateLayer();

    $("#spanStartRadar").css("display", "none");
    $("#spanStopRadar").css("display", "none");

    switch(dataType)
    {
        case "radar":
            ts = tsRadar;
            break;
        case "temp":
            ts = tsTemp;
            break;
        case "windSpeed":
            ts = tsWind;
            break;
        case "satrad":
            ts = tsClouds;
            break;
    }

    if (isTileLayer && ts != null) {
        ClearWeatherTileLayer();
        var layerOptions = {
            getTileUrl: function (coord, zoom) {
                return weatherStoreApiTileBaseUrl + "tile/" + dataType + "?ts=" + ts + "&xyz=" + coord.x + ":" + coord.y + ":" + zoom + "&apiKey=" + theWeatherStoreApiKey;
            },
            tileSize: new google.maps.Size(256, 256),
            opacity: 0.5
        };
        map.overlayMapTypes.insertAt(0, new google.maps.ImageMapType(layerOptions));
    } else {
        map.overlayMapTypes.setAt(0, null);
    }

    var legendString = new String();
    switch (dataType) {
        case "radar":
            legendString = CreateLegend([wthrLgndRain, wthrLgndMix, wthrLgndSnow], ['rain', 'mix', 'snow']);
            $("#spanStartRadar").css("display", "inline");
            $("#spanStopRadar").css("display", "none");
            break;
        case "temp":
            legendString = CreateLegend([wthrLgndTemp], ['temp']);
            break;
        case "windSpeed":
            legendString = CreateLegend([wthrLgndWindSpeed], ['speed']);
            break;
        case "satrad":
            legendString = CreateLegend([wthrLgndRain, wthrLgndMix, wthrLgndSnow, wthrLgndClouds], ['rain', 'mix', 'snow', 'clouds']);
            break;
    }
    $("#divWeatherLabel").css("display", "block");
    document.getElementById("divWeatherLabel").innerHTML = legendString;
}

function ForecastAccum(datatype, timeSpan, producttype) {

    datatype = "precip24hrFcst";

    var ts, fts;

    switch (datatype) {
        case "precip24hrFcst":
            ts = tsPrecipPast24;
            fts = ftsPrecipPast24;
            break;
    }

    accumDaySelected = timeSpan;
    dataType = datatype;
    timeSpan = timeSpan;

    if (producttype != null) {
        checkedItemID = "wthrRadio" + producttype;
        checkedItemValue = producttype;
    } else {
        checkedItemID = "wthrRadio" + checkedItemValue;
        checkedItemValue = checkedItemValue;
    }
    if (checkedItemID != "" && checkedItemValue != "") {
        

        if (timeSpan != "") {

            ClearWeatherTileLayer();
            setAllMap(null, markersWeatherCityTemp);
            setAllMap(null, markersWeatherCityWind);

            //weatherLabel = (timeSpan * 24) + " Hour " + checkedItemValue + " Forecast";
            timeSpan = "now+" + (timeSpan * 24) + ":00:00";
            //var weatherCentralRequestUrl = "http://datacloud.wxc.com/?datatype=" + datatype + "&vs=0.9&passkey=" + weatherCentralApiKey + "&type=legend&var=accum" + checkedItemValue.toLowerCase() + "total&format=default&range=0,20&steps=20&fontsize=8&orientation=vertical_ascending";
            document.getElementById("divWeatherLabel").innerHTML = GetEpochDate(fts) ;
            $("#divWeatherLabel").css("display","block");
            var layerOptions = {
                getTileUrl: function (coord, zoom) {
                    //return "http://datacloud.wxc.com/?type=tile&datatype=" + datatype + "&var=accum" + checkedItemValue.toLowerCase() + "total&time=" + timeSpan + "&x=" + coord.x + "&y=" + coord.y + "&z=" + zoom + "&vs=0.9&passkey=" + weatherCentralApiKey;

                    return weatherStoreApiTileBaseUrl + "tile/precip24hrFcst?ts="+ts+"&fts="+fts+"&xyz=" + coord.x + ":" + coord.y + ":" + zoom + "&apiKey=" + theWeatherStoreApiKey;

                },
                tileSize: new google.maps.Size(256, 256),
                opacity: 0.5
            };
            map.overlayMapTypes.insertAt(0, new google.maps.ImageMapType(layerOptions));

            DoAnalyticsAndAds('weather/' + checkedItemValue + timeSpan + 'day', 'view', '', '');
        }

        SelectForecastDay(accumDaySelected);
        $("#divAccumDaysSelector").css("display", "block");
    }
}

function ForecastDays(fts, producttype)
{
    var ts;
    var legendString = new String();
    var datatype = checkedItemValue;
    switch (datatype) {
        case "precip24hrFcst":
            ts = tsPrecipFcst;
            legendString = CreateLegend([wthrLgndRain24],['rain']);
            break;
        case "snow24hrFcst":
            ts = tsSnowFcst;
            legendString = CreateLegend([wthrLgndSnow24],['snow']);
            break;
        case "radarFcst":
            ts = tsRadarFcst;
            legendString = CreateLegend([wthrLgndRain,wthrLgndMix,wthrLgndSnow], ['rain', 'mix', 'snow']);
            break;
        case "tempFcst":
            ts = tsTempFcst;
            legendString = CreateLegend([wthrLgndTemp],['temp']);
            break;
    }
    if (producttype != null) {
        checkedItemID = "wthrRadio" + producttype;
        checkedItemValue = producttype;
    } else {
        checkedItemID = "wthrRadio" + checkedItemValue;
        checkedItemValue = checkedItemValue;
    }


    if (ts != "") {

        ClearWeatherTileLayer();
        setAllMap(null, markersWeatherCityTemp);
        setAllMap(null, markersWeatherCityWind);

        $("#divWeatherLabel").css("display", "block");
        document.getElementById("divWeatherLabel").innerHTML = GetEpochDate(fts, datatype) + legendString;

        $("#divWeatherLabel").css("display", "block");
        var layerOptions = {
            getTileUrl: function (coord, zoom) {
                return weatherStoreApiTileBaseUrl + "tile/" + datatype + "?ts=" + ts + "&fts=" + fts + "&xyz=" + coord.x + ":" + coord.y + ":" + zoom + "&apiKey=" + theWeatherStoreApiKey;
            },
            tileSize: new google.maps.Size(256, 256),
            opacity: 0.5
        };
        map.overlayMapTypes.insertAt(0, new google.maps.ImageMapType(layerOptions));

        DoAnalyticsAndAds('weather/' + checkedItemValue + timeSpan + 'day', 'view', '', '');
    }
        SelectForecastDay(accumDaySelected);
        $("#divForecastEpochSelector").css("display", "block");
}

function CreateLegend(legendRgbArrs, labelArr)
{
    var lgnd = "<div class='clsWeatherLegend'>";
    for (var l = 0; l < legendRgbArrs.length; l++)
    {
        if(labelArr.length > 0)
            lgnd += "<div class='clsWeatherLegendLayerTypeLabel'>" + labelArr[l]+ "</div>";

        lgnd += "<div class='clsWeatherLegendPlusMinus'>-</div>";
        for (var l2 = 0; l2 < legendRgbArrs[l].length; l2++) {
            lgnd += "<div class='clsWeatherLegendColorBox' style='background-color: rgb(" + legendRgbArrs[l][l2] + ");'></div>";
        }
        lgnd += "<div class='clsWeatherLegendPlusMinus'>+</div>";
        lgnd += "<div class='clsWeatherLegendSpacer'></div>";
    }
    lgnd += "</div>";
    return lgnd;
}
function GetEpochDate(ed,srcItem)
{
    var helperDate = new String();
    var d = new Date(ed * 1000);
    if (srcItem == "wthrRadioSnow" || srcItem == "wthrRadioRain" || srcItem == "precip24hrFcst" || srcItem == "snow24hrFcst")
    {
        helperDate = "- " + (d.getMonth() + 1) + "/" + d.getDate() + " -";
    }
    return dayOfWeekArr[d.getDay()] + " " + helperDate + " " + ConvertTo12HourTime(d.getHours(), d.getMinutes());
}
function IsEpochInTheFuture(e)
{
    var epoch = new Date(e * 1000);
    var today = new Date();
    if(parseInt(epoch.getTime()) > parseInt(today.getTime()))
    {
        return true;
    }
    return false;
}
function ConvertTo12HourTime(h,m)
{
    var hOut = h;
    var mOut = new String(m);
    var amPmOut = new String("AM");
    if (h > 12) { hOut = (h - 12); amPmOut = "PM"; }
    //if (m == 0) { mOut = "00"; }
    if (mOut.length == 1) { mOut = "0"+mOut; }
    return hOut + ":" + mOut + " " + amPmOut;
}

function AnimateLayer(layerType)
{
    $("#spanStartRadar").css("display", "none");
    $("#spanStopRadar").css("display", "inline");

    var tsArr = [];
    var layerOptions = new Object();

    switch(layerType)
    {
        case "radar":
            tsArr = tsRadarArr;
            weatherLoopCounter = (weatherLoopCounter < tsArr.length) ? weatherLoopCounter : tsArr.length - 1;
            break;
    }

    timer = setInterval(function () { WeatherLoop(tsArr, layerType); }, 1000);
}

function WeatherLoop(tsarr,lyrType)
{
    $("#divWeatherLabel").css("display", "block");
    document.getElementById("divWeatherLabel").innerHTML = "Last 3 Hours:<br>"+GetEpochDate(tsarr[weatherLoopCounter].ts, '');
    
    if (tsarr[weatherLoopCounter].ts != null) {
        //$("#radarEpochDisplay").html(GetEpochDate(tsarr[weatherLoopCounter].ts, null));
        layerOptions = {
            getTileUrl: function (coord, zoom) {
                return weatherStoreApiTileBaseUrl + "tile/" + lyrType + "?ts=" + tsarr[weatherLoopCounter].ts + "&xyz=" + coord.x + ":" + coord.y + ":" + zoom + "&apiKey=" + theWeatherStoreApiKey;
            },
            tileSize: new google.maps.Size(256, 256),
            opacity: 0.5
        };

        //map.overlayMapTypes.clear();
        map.overlayMapTypes.setAt(0, new google.maps.ImageMapType(layerOptions));

        weatherLoopCounter--;
        if (weatherLoopCounter == -1) { weatherLoopCounter = tsarr.length - 1;}
    }
}

function StopAnimateLayer()
{
    clearInterval(timer);
    $("#spanStartRadar").css("display", "inline");
    $("#spanStopRadar").css("display", "none");
}

function CheckWeatherItem(itemName) {
    if (document.getElementById(itemName)) {
        document.getElementById(itemName).checked = true;
    }
    document.getElementById("divWeatherControlsClear").style.display = "";
}
function SelectForecastDay(itemValue) {
    $('#selectAccumDays').val(itemValue);

    if (document.getElementById("forecastDayPluralAware")) {
        document.getElementById("forecastDayPluralAware").innerHTML = (itemValue == 1) ? "" : "s";
    }
}

/*SNOW COVER MAP: START*/
$(function () {
    $('#snowMapDatePicker').datepicker({
        changeYear: true,
        onSelect: function (date) { GetSnowMapSelectedDate(date); }
    });
});

function GetSnowMapSelectedDate(d) {
    selectedSnowMapDate = d;
    SnowCoverMaps(selectedSnowMapDate);
}
function ShowSnowMapModal()
{
    $("#SnowMapModal").modal('show');
    $("#h4ModelHeaderSnowMapModal").html("Snow Cover Map");
    SnowCoverMaps(selectedSnowMapDate);
}
function ShowSnowMapDatePickerCalendar() {
    $("#snowMapDatePicker").datepicker("show");
}

//need to put this map in BS Global Modal

var dtSnowMapToday = new Date();
selectedSnowMapDate = dtSnowMapToday;

function SnowCoverMaps(dt) {
    
    //$("#SnowMapModal").modal('show');
    //$("#h4ModelHeaderSnowMapModal").html("Snow Depth");
    //$("#divModalContentSnowMapModal").html("<img src='resources/images/ring.gif'>");
    $("#divSnowMapModalDatePicker").css("display", "block");
    if (dt != null) {
        var dtStr = new String(dt);
        if (dtStr.length == 8) {
            dtStr = dtStr.substring(4, 6) + "/" + dtStr.substring(6, 8) + "/" + dtStr.substring(0, 4);
            dtSnowMapToday = new Date(dtStr);
        }
    } else {
        dt = dtSnowMapToday;
    }
    SetNoaaImgByDate(dt);
    //ToggleSnowMaps(dtSnowMapToday);
}
function ToggleSnowMaps(dt) {
}
function SnowMapDateSelected(sender, eventArgs) {

    if (eventArgs.get_newValue()) {
        dtSnowMapToday = eventArgs.get_newValue();
        SetNoaaImgByDate(eventArgs.get_newValue());
    }
}
function SnowMapDateSelectedFromDataPicker(dateText) {

    SetNoaaImgByDate(dateText);
}
function GetNoaaImgString(dt) {
    var selectedDate = new Date(dt);
    var noaaImg = new String();
    year = new String(selectedDate.getFullYear());
    var month = new String(selectedDate.getMonth() + 1);
    month = (month.length == 1) ? "0" + month : month;
    var day = new String(selectedDate.getDate());
    day = (day.length == 1) ? "0" + day : day;
    var gaStr = "ViewSnowCover" + year + month + day;
    dateObjTargetDate = new Date(year,(month - 1),day, 0, 0, 0);
    DoAnalyticsAndAds(gaStr, 'view', '', '');
    noaaImg = "http://www.nohrsc.noaa.gov/snow_model/images/full/National/nsm_depth/" + year + month + "/nsm_depth_" + year + month + day + "05_National.jpg";
    return noaaImg;
}
function SetNoaaImgByDate(targetDate) {

    var noaaImg = GetNoaaImgString(targetDate);
    if (dateObjTargetDate > dateToday) {
        alert("Please choose a date of today or in the past.");
        //$("#h4ModelHeaderSnowMapModal").html("Check the date.");
    } else {
        document.getElementById("imgNoaaSnowMap").src = noaaImg;
    }
}
function SnowMapLoadComplete() {
    //$("#h4ModelHeaderSnowMapModal").html("Snow Depth");
    //$("#divModalContentSnowMapModal").html("");
}
function GetSnowMapDate(datePickerId) {
    var pickerDay, pickerMonth, pickerYear;
    //we need to prepare the date
    var d = new String($('#'+datePickerId).val());
    var dSplit = d.split(" ");
    pickerDay = dSplit[0];
    pickerMonth = dSplit[1];
    pickerYear = dSplit[2];
    
    for(var m=0;m<arrMonths.length;m++)
    {
        if(pickerMonth == arrMonths[m])
        {
            pickerMonth = (m+1);
            break;
        }
    }
    SnowMapDateSelectedFromDataPicker(pickerMonth + "/" + pickerDay + "/" + pickerYear);
}

function bringCalendarToFront(elementID) {
    $("#" + elementID).css("position", "relative");
    $("#" + elementID).css("z-index", 4000);
}

function SetDefaultSnowMapDate() {
    var d = new Date();
    var dy = new String(d.getDate());
    dy = (dy.length == 1) ? "0"+dy:dy;
    var today = dy + " " + arrMonths[(d.getMonth())] + " " + d.getFullYear();
    $("#datepickerSnowMap").val(today);
}

function CloseSnowMap()
{
    $("#divSnowMapModalDatePicker").css("display", "none");
    $("#datepickerSnowMap").val("");
}
/*SNOW COVER MAP: STOP*/