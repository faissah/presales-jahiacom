var objRevert = new Object();
var arrModalLinks = ["Reports", "Weather", "Subscribe"];
var adStrout = "<div style=\"width:100%;margin-bottom:15px\" class=\"divReportsColumn1Ad visible-sm visible-xs hidden-md hidden-lg text-center\"><iframe id='iframeEmbedAdReportDetailBottom1' frameborder='0' width='300' height='250' scrolling='no'></iframe></div><div style=\"clear:both\"></div>";
var arrReportsComments = [];

/*REPORT MODALS: start*/
function GetLocationReports(headerText, lat, lon, feWebID, startDate, endDate, seasonYear, zip, showReportDetailModalDropDown, flywayIndex, reportID)
{
    //if user aborts contact modal - we will re-show the location reports modal using these parameters:
    objRevert.headerText = headerText;
    objRevert.lat = lat;
    objRevert.lon = lon;
    objRevert.feWebID = feWebID;
    objRevert.startDate = startDate;
    objRevert.endDate = endDate;
    objRevert.seasonYear = seasonYear;
    objRevert.zip = zip;
    objRevert.showReportDetailModalDropDown = showReportDetailModalDropDown;
    objRevert.reportID = reportID;

    //clear some values
    $("#divTargetReport").html('');
   

    var dataString;
    if (feWebID == null || feWebID == "") {
        dataString = "lat=" + lat + "&lon=" + lon + "&startDate=" + startDate + "&endDate=" + endDate + "&seasonYear=" + seasonYear + "&zip=" + zip + "&reportID="+reportID+"&isMobile="+isMobile+"&action=reportsDetailsLocationPublic";
    } else {
        dataString = "lat=" + lat + "&lon=" + lon + "&startDate=" + startDate + "&endDate=" + endDate + "&seasonYear=" + seasonYear + "&webID=" + feWebID + "&zip=" + zip + "&isMobile=" + isMobile + "&reportID=" + reportID +"&action=reportsDetailsLocationBiologist";
    }

            $("#h4ModelHeaderGlobalModal").html(headerText);
            $("#divModalContentGlobalModal").html('<div style=\"padding:30px\"><img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING...</div>');

            $.ajax({
                type: "GET",
                url: "resources/aspx/proxy.aspx",
                data: dataString,
                success: function (msg) {

                    arrReportsComments[0] = msg;
                    //console.log(arrReportsComments[0]);

                    if (isSmallDevice) {
                    //    $("#iframeEmbedAdReportDetailBottom1").attr("src", "resources/aspx/AdFrameEmbed1.aspx");

                    } else {
                     //   $('#iframeEmbedAd1').attr('src', 'resources/aspx/AdFrameEmbed1.aspx');
                    }

                    if (showReportDetailModalDropDown) {
                        PopulateReportDetailModalSeasonDrop(seasonYear, lat, lon, feWebID, headerText, zip, reportID);
                    }

                    //$("#divModalContentGlobalModal").html("<div class=\"row\">" + msg + adStrout + "</div>");
                    $("#divModalContentGlobalModal").html("<div class=\"row\">" + msg + "</div>");
                    $('#iframeEmbedAd1').attr('src', 'resources/aspx/AdFrameEmbed1.aspx');
                },
                error: function (err) {
                    $("#divModalContentGlobalModal").html(err.responseText);
                }
            });
            /*
            setTimeout(function () {
                $("#divReportScroller").css("height", $(".modal-body").css("height"));           
            }, 1000);*/

        //if (toolbarDisplayState) { $('#divToolbarNavToggle').click(); }

    var city_state = headerText.replace(", ", "_");
    reloadAd = false;
    DoAnalyticsAndAds("GetLocationReports/" + city_state, 'view', '', '');
    DoAnalyticsAndAds("reportDetail/" + city_state, 'view', '', '');

    //switchLinks("Reports");
    $("#GlobalModal").modal('show');
}

function ViewReportDetailsBiologist(headerText, lat, lon, zip, flywayIndex) {

    var dataString;

    dataString = "lat=" + lat + "&lon=" + lon + "&zip=" + zip + "&isMobile=" + isMobile+"&action=reportsDetailsLocationBiologist";

    $("#h4ModelHeaderGlobalModal").html(headerText);
    $("#divModalContentGlobalModal").html('<div style=\"padding:30px\"><img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING...</div>');
    $("#GlobalModal").modal('show');

        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: dataString,
            success: function (msg) {

                $("#divModalContentGlobalModal").html("<div class=\"row\">" + msg + "</div>");

                $('#iframeEmbedAd1').attr('src', 'resources/aspx/AdFrameEmbed1.aspx');
            },
            error: function (err) {
                //alert(err.responseText);
            }
        });


    var city_state = headerText.replace(", ", "_");
    DoAnalyticsAndAds('ViewReportDetailsBiologist/' + city_state, 'view', '', '');

   // if (toolbarDisplayState) { $('#divToolbarNavToggle').click(); }
}

function biolImgOver(imgId) {

    $('#' + imgId).animate({
        height: "100%",
        width: "100%",
        left: "-=50",
        top: "-=50"
    }, "fast");
}
function biolImgOut(imgId) {

    $('#' + imgId).animate({
        height: "90",
        width: "120",
        left: "-=50",
        top: "-=50"
    }, "fast");
}

function ViewReportDetailsForRadius(headerText, lat, lon, feWebID, startDate, endDate, seasonYear, zip, showReportDetailModalDropDown) {

    startDate = "8/1/2008 12:00:00 AM";

    var dataString;
    if (feWebID == null || feWebID == "") {
        dataString = "lat=" + lat + "&lon=" + lon + "&startDate=" + startDate + "&endDate=" + endDate + "&zip=" + zip + "&action=reportsDetailsLocationPublicWithRadius";
    }

    $("#GlobalModal").modal('show');
    $("#divModalContentGlobalModal").html("<img src=\"resources/images/ring.gif\">&nbsp;LOADING...");

    $.ajax({
        type: "GET",
        url: "resources/aspx/proxy.aspx",
        data: dataString,
        success: function (msg) {

            $("#h4ModelHeaderGlobalModal").html("<div style='float:left;width:450px;'>Reports For " + headerText + "<br>(and nearby locations)</div><div id='seasonDropDown' style='float:right;margin-right:0px;'></div>");
            $("#divModalContentGlobalModal").html(msg);

            if (showReportDetailModalDropDown) {
                PopulateReportDetailModalSeasonDrop(seasonYear, lat, lon, feWebID, headerText, zip);
            }
        },
        error: function (err) {
            //alert(err.responseText);
        }
    });
    var city_state = headerText.replace(", ", "_");
    DoAnalyticsAndAds('searchResults/'+city_state, 'view', '', '');
}

function PopulateReportDetailModalSeasonDrop(selectedSeasonYear, lat, lon, feWebID, headerText, zip) {

    dataString = "lat=" + lat + "&lon=" + lon + "&feWebID=" + feWebID + "&headerText=" + headerText + "&seasonYear=" + selectedSeasonYear + "&zip=" + zip + "&action=reportsDetailsSeasonYearDropDown";

    $.ajax({
        type: "GET",
        url: "resources/aspx/proxy.aspx",
        data: dataString,
        success: function (msg) {
            if (msg.length > 0) {
                $("#seasonDropDown").html(msg);
            }
        },
        error: function (err) {
            //alert(err.responseText);
        }
    });
}

function SwitchSeason(seasonYear, lat, lon, feWebID, headerText, zip) {
    var stringStartDate = new String(seasonStartMonth + "/1/" + seasonYear + " 00:00:00 AM");
    var stringEndDate = new String(seasonEndMonth + "/1/" + (parseInt(seasonYear) + 1) + " 00:00:00 AM");
    GetLocationReports(headerText, lat, lon, new String(feWebID), stringStartDate, stringEndDate, seasonYear, zip, true, 0, 0);

}
/*REPORT MODALS: end*/

/*SUBSCRIBE: start*/
function Subscribe(cityState, lat, lon, webID, feName) {
    /*
    $("#divSubscribeFormWrapper").fadeIn('fast', function () { });
    */

    document.getElementById("hiddenSubscribeLat").value = lat;
    document.getElementById("hiddenSubscribeLon").value = lon;
    document.getElementById("hiddenSubscribeWebID").value = webID;
    document.getElementById("spanSubscriptionTypeHead").innerHTML = (webID == "") ? "this location" : feName;
    document.getElementById("spanSubscriptionTypeContent").innerHTML = (webID == "") ? cityState : feName;
    
    $("#divReportScroller").html($("#divSubscribeFormPage").html());
    $("#divTextBoxContainer").html('<input type="text" id="TextBoxReportSubscribeEmail" maxlength="50" />');
    //$("#seasonDropDown").html("");
    $('#iframeEmbedAd1').attr('src', 'resources/aspx/AdFrameEmbed1.aspx');
    switchLinks("Subscribe");

    $("#reportsHeader").css("display", "none");

    DoAnalyticsAndAds("subscribe/" + cityState, "view", "", "");
}

function SubscribeReport(emailFldID) {
    var errorStrout = new String();
    var eml = document.getElementById(emailFldID).value;
    var lat = document.getElementById("hiddenSubscribeLat").value;
    var lon = document.getElementById("hiddenSubscribeLon").value;
    var webID = document.getElementById("hiddenSubscribeWebID").value;
    var modalWrapper = document.getElementById("divSubscribeFormWrapper");
    var modalContent = document.getElementById("divSubscriptionFormHtml");
    var modalHeader = document.getElementById("divSubscribeFormHeader");
    var subscribeWrapper = document.getElementById("divSubscribeFormWrapper");
    if (eml.length == 0) {
        errorStrout += "&nbsp;&nbsp;please provide email address";

    }
    else {
        var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

        if (!pattern.test(eml)) {
            errorStrout += "&nbsp;&nbsp;check email address spelling";
        }
    }
    if (errorStrout.length > 0) {

        $("#subscribeEmailRequired").html(errorStrout);


    } else {

        var dataString;
        if (webID == "null" || webID == "") {
            dataString = "lat=" + lat + "&lon=" + lon + "&eml=" + eml + "&action=subscribeLocation";
        } else {
            dataString = "lat=" + lat + "&lon=" + lon + "&eml=" + eml + "&feWebID=" + webID + "&action=subscribeFieldEditor";
        }
        $("#spanSubscribeProgress").html('<img src=\"resources/images/ring.gif\">&nbsp;&nbsp;LOADING');
        //send the report to server

        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: dataString,
            success: function (msg) {

                $("#divReportScroller").html("Thank you. The subscription is successful.");
                //setTimeout(function () { $("#GlobalModal").modal('hide'); }, 5000);

            },
            error: function (err) {
                //alert(err.responseText);
            }
        });
    }
}
/*SUBSCRIBE: stop*/

/*MISC: start*/
function switchLinks(activeLink)
{
    for(var l = 0; l<arrModalLinks.length;l++)
    {
        if (activeLink == arrModalLinks[l]) {
            $("#divReportsColumn1" + arrModalLinks[l]).removeClass("divReportsColumn1LinkOff").addClass("divReportsColumn1LinkOn");
        } else {
            $("#divReportsColumn1" + arrModalLinks[l]).removeClass("divReportsColumn1LinkOn").addClass("divReportsColumn1LinkOff");
        }
    }
}
/*MISC: end*/

/*SUBMISSION FORMS: start*/
function SubmitFieldEditorReport(cntryFldID, cityFldID, stateFldID, provFldID, weathFldID, migFldID, huntFldID, commentFldID, webIdFldID, screenFldID, browserFldID, ipFldID, zipFldID, latFldID, lonFldID, fNameFldID, lNameFldID, flywayFldID) {
    var reportStateProvID;
    var errorStrout = new String();
    //var reportDate = document.getElementById(new String(dateFldID)).value;
    var reportCountryID = document.getElementById(new String(cntryFldID)).value;
    var reportCity = document.getElementById(new String(cityFldID)).value;
    var reportStateID = document.getElementById(new String(stateFldID)).value;
    var reportProvID = document.getElementById(new String(provFldID)).value;
    var reportWeather = document.getElementById(new String(weathFldID)).value;
    var reportMig = document.getElementById(new String(migFldID)).value;
    var reportHunt = document.getElementById(new String(huntFldID)).value;
    var reportComment = document.getElementById(new String(commentFldID)).value;
    reportComment = reportComment.replace("&", "and");
    var webId = document.getElementById(new String(webIdFldID)).value;
    var screen = document.getElementById(new String(screenFldID)).value;
    var brow = document.getElementById(new String(browserFldID)).value;
    var ip = document.getElementById(new String(ipFldID)).value;
    var zip = document.getElementById(new String(zipFldID)).value;
    var lat = document.getElementById(new String(latFldID)).value;
    var lon = document.getElementById(new String(lonFldID)).value;
    var fName = document.getElementById(new String(fNameFldID)) ? document.getElementById(new String(fNameFldID)).value : "";
    var lName = document.getElementById(new String(lNameFldID)) ? document.getElementById(new String(lNameFldID)).value : "";
    reportStateProvID = (reportCountryID == 1) ? reportStateID : reportProvID;
    var flywayId = document.getElementById(new String(flywayFldID)).value;

    var isMobileApp = "0"; //document.getElementById("hiddenIsMobileApp").value;

    if (reportCity.length == 0) {
        errorStrout += "- City<br>";
    }

    if (errorStrout.length > 0) {
        $("#divFieldEditorSubmitAlert").html("<h4 style=\"color:red\">Please check the required items:</h4>" + errorStrout);
    } else {

        //send the report to server
        $("#spanFieldEditorSubmitProgressImage").html("<img src=\"resources/images/ring.gif\">");
        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: "rCou=" + reportCountryID + "&rCit=" + reportCity + "&rStaProv=" + reportStateProvID + "&rWea=" + reportWeather + "&rMig=" + reportMig + "&rHun=" + reportHunt + "&rCom=" + reportComment + "&webid=" + webId + "&scr=" + screen + "&brow=" + brow + "&ip=" + ip + "&zip=" + zip + "&lat=" + lat + "&lon=" + lon + "&fname=" + fName + "&lname=" + lName + "&isMob=" + isMobileApp + "&flywayID=" + flywayId + "&action=submitFieldEditorReport",
            success: function (msg) {

                ResetSubmissionForm();
                $("#spanFieldEditorSubmitProgressImage").html("Thank you. The report was submitted successfully.");
                setTimeout(function () {
                    $("#modalFieldEditorSubmission").modal('hide');
                }, 5000);
            },
            error: function (err) {
                //alert(err.responseText);
            }
        });
    }
}

function SubmitBiologistReport(cntryFldID, cityFldID, stateFldID, provFldID, weathFldID, migFldID, huntFldID, commentFldID, webIdFldID, screenFldID, browserFldID, ipFldID, zipFldID, latFldID, lonFldID, fNameFldID, lNameFldID, photoFldID, flywayFldID) {
    var reportStateProvID;
    var errorStrout = new String();
    //var reportDate = document.getElementById(new String(dateFldID)).value;
    var reportCountryID = document.getElementById(new String(cntryFldID)).value;
    var reportCity = document.getElementById(new String(cityFldID)).value;
    var reportStateID = document.getElementById(new String(stateFldID)).value;
    var reportProvID = document.getElementById(new String(provFldID)).value;
    var reportWeather = document.getElementById(new String(weathFldID)).value;
    var reportMig = document.getElementById(new String(migFldID)).value;
    var reportHunt = document.getElementById(new String(huntFldID)).value;
    var reportComment = document.getElementById(new String(commentFldID)).value;
    reportComment = reportComment.replace("&", "and");
    var webId = document.getElementById(new String(webIdFldID)).value;
    var screen = document.getElementById(new String(screenFldID)).value;
    var brow = document.getElementById(new String(browserFldID)).value;
    var ip = document.getElementById(new String(ipFldID)).value;
    var zip = document.getElementById(new String(zipFldID)).value;
    var lat = document.getElementById(new String(latFldID)).value;
    var lon = document.getElementById(new String(lonFldID)).value;
    var fName = document.getElementById(new String(fNameFldID)) ? document.getElementById(new String(fNameFldID)).value : "";
    var lName = document.getElementById(new String(lNameFldID)) ? document.getElementById(new String(lNameFldID)).value : "";
    var photoFld = document.getElementById(new String(photoFldID));
    var photoValue = new String(photoFld.value);
    var flywayId = document.getElementById(new String(flywayFldID)).value;
    reportStateProvID = (reportCountryID == 1) ? reportStateID : reportProvID;

    var isMobileApp = "0"; //document.getElementById("hiddenIsMobileApp").value;

    if (reportCity.length == 0) {
        errorStrout += "- City<br>";
    }

    if (errorStrout.length > 0) {
        $("#divBiologistSubmitAlert").html("<h4 style=\"color:red\">Please check the required items:</h4>" + errorStrout);

    } else {

        //send the report to server
        document.getElementById("spanBiologistSubmitProgressImage").innerHTML = "<img src=\"resources/images/ring.gif\">";

        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: "rCou=" + reportCountryID + "&rCit=" + reportCity + "&rStaProv=" + reportStateProvID + "&rWea=" + reportWeather + "&rMig=" + reportMig + "&rHun=" + reportHunt + "&rCom=" + reportComment + "&webid=" + webId + "&scr=" + screen + "&brow=" + brow + "&ip=" + ip + "&zip=" + zip + "&lat=" + lat + "&lon=" + lon + "&fname=" + fName + "&lname=" + lName + "&isMob=" + isMobileApp + "&flywayID=" + flywayId + "&action=submitBiologistReport",
            success: function (msg) {

                if (photoValue.length > 0) {
                    UploadBiologistReportPhoto(msg, photoFld);
                } else {
                    //HideSubmissionForm();
                    ResetSubmissionForm();
                    document.getElementById("spanBiologistSubmitProgressImage").innerHTML = "Thank you. The report was submitted successfully.";
                    setTimeout(function () {
                        $("#modalBiologistSubmission").modal('hide');
                    }, 5000);

                }
            },
            error: function (err) {
                //alert(err.responseText);
            }
        });
        DoAnalyticsAndAds("submission/biologist/" + reportCity + "_" + reportStateProvID, "event", "", "click");
    }
}

function UploadBiologistReportPhoto(reportID, photoFld) {

    var frm1 = document.createElement("form");
    var inputFile = document.createElement("input");
    inputFile = photoFld;

    var inputText = document.createElement("input");
    inputText.name = "txtReportID";
    inputText.value = reportID;

    frm1.encoding = "multipart/form-data";
    frm1.target = "upload_frame";
    frm1.method = "POST";
    frm1.action = "resources/aspx/proxy.aspx?action=uploadBiologistReportImage";
    frm1.appendChild(inputFile);
    frm1.appendChild(inputText);
    document.body.appendChild(frm1);

    var selectedFileString = new String(inputFile.value);
    if (selectedFileString.length > 0) {
        frm1.submit();
    }

    document.body.removeChild(frm1);
}

function ShowBiologistReportCompleteModal() {
    var modalWrapper = document.getElementById("divCommonModalWrapper");
    var modalContent = document.getElementById("divCommonModalContent");
    var modalHeader = document.getElementById("divCommonModalHeader");
    var submissionForm = document.getElementById("divSubmissionForm");
    modalHeader.innerHTML = "Biologist Report Submitted";
    modalContent.innerHTML = "<div style=\"padding:40px\"><strong>Thank you.</strong> The report has been successfully submitted. Your report will be visible on the Migration Map within 10 minutes.</div>";
    $("#divCommonModalWrapper").fadeIn('fast', function () { });
}

function SubmitPublicReport(fNameFldID, lNameFldID, emailFldID, cntryFldID, cityFldID, stateFldID, provFldID, activityLevelFldID, timeFldID, tempFldID, weatherFldID, windDirectionFldID, windFldID, newsletterFldID, commentFldID, webIdFldID, screenFldID, browserFldID, ipFldID, zipFldID, latFldID, lonFldID, mobileTypeFldID, cellNumberFldID, allowContactFldID, flywayFldID) {
    var reportStateProvID;
    var errorStrout = new String();
    $("#divPublicSubmitAlert").hide();

    var fName = document.getElementById(new String(fNameFldID)) ? document.getElementById(new String(fNameFldID)).value : "";
    var lName = document.getElementById(new String(lNameFldID)) ? document.getElementById(new String(lNameFldID)).value : "";
    var email = document.getElementById(new String(emailFldID)) ? document.getElementById(new String(emailFldID)).value : "";

    var reportCountryID = document.getElementById(new String(cntryFldID)).value;
    var reportCity = document.getElementById(new String(cityFldID)).value;
    var reportStateID = document.getElementById(new String(stateFldID)).value;
    var reportProvID = document.getElementById(new String(provFldID)).value;
    reportStateProvID = (reportCountryID == 1) ? reportStateID : reportProvID;

    //var classification = document.getElementById(new String(classFldID)).value;
    var activityLevel = document.getElementById(new String(activityLevelFldID)).value;
    var time = (document.getElementById(new String(timeFldID)).value == "") ? "0" : document.getElementById(new String(timeFldID)).value;
    var temp = (document.getElementById(new String(tempFldID)).value == "") ? "0" : document.getElementById(new String(tempFldID)).value;
    var weather = (document.getElementById(new String(weatherFldID)).value == "") ? "0" : document.getElementById(new String(weatherFldID)).value;
    var windDirection = (document.getElementById(new String(windDirectionFldID)).value == "") ? "0" : document.getElementById(new String(windDirectionFldID)).value;
    var wind = (document.getElementById(new String(windFldID)).value == "") ? "0" : document.getElementById(new String(windFldID)).value;
    var newsletter = "off"; //document.getElementById(new String(newsletterFldID)).checked ? "on" : "off";

    var reportComment = document.getElementById(new String(commentFldID)).value;
    reportComment = reportComment.replace("&", "and");
    var allowContact = "off"; //document.getElementById(new String(allowContactFldID)).checked ? "on" : "off";

    var webId = document.getElementById(new String(webIdFldID)).value;
    var screen = document.getElementById(new String(screenFldID)).value;
    var brow = document.getElementById(new String(browserFldID)).value;
    var ip = document.getElementById(new String(ipFldID)).value;
    var zip = document.getElementById(new String(zipFldID)).value;
    var lat = document.getElementById(new String(latFldID)).value;
    var lon = document.getElementById(new String(lonFldID)).value;
    var flywayId = document.getElementById(new String(flywayFldID)).value;
    var mobileType = document.getElementById(new String(mobileTypeFldID)).value;
    var cellNumber = document.getElementById(new String(cellNumberFldID)).value;

    var isMobileApp = "0"; //document.getElementById("hiddenIsMobileApp").value;

    if (fName.length == 0) {
        errorStrout += "- First Name<br>";
    }
    if (lName.length == 0) {
        errorStrout += "- Last Name<br>";
    }
    if (email.length == 0) {
        errorStrout += "- Email<br>";
    }
    else {
        var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

        if (!pattern.test(email)) {
            errorStrout += "- Email - check spelling<br>";
        }
    }
    if (reportCity.length == 0) {
        errorStrout += "- City<br>";
    }
    /*if (parseInt(classification) == 0) {
    errorStrout += "- Classification<br>";
    }*/
    if (parseInt(activityLevel) == 0) {
        errorStrout += "- Activity Level<br>";
    }

    if (errorStrout.length > 0) {
        $("#divPublicSubmitAlert").html("The following is required:<br/>" + errorStrout).fadeIn();
        $("#modalPublicSubmission").animate({ scrollTop: 0 }, "fast");
    } else {
        //now start progress image.
        //$("#spanPublicSubmitProgressImage").html("<img src=\"resources/images/ring.gif\">");
        $("#spanPublicSubmitProgressImage").html("Please wait...");

        //send the report to server
        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: "rCou=" + reportCountryID + "&rCit=" + reportCity + "&rStaProv=" + reportStateProvID + "&rActLvl=" + activityLevel + "&rTime=" + time + "&rTemp=" + temp + "&rWea=" + weather + "&rWindDir=" + windDirection + "&rWind=" + wind + "&rNewsLtr=" + newsletter + "&rCom=" + reportComment + "&webid=" + webId + "&scr=" + screen + "&brow=" + brow + "&ip=" + ip + "&zip=" + zip + "&lat=" + lat + "&lon=" + lon + "&fname=" + fName + "&lname=" + lName + "&email=" + email + "&isMob=" + isMobileApp + "&mobType=" + mobileType + "&cellNumber=" + cellNumber + "&allowContact=" + allowContact + "&flywayID=" + flywayId + "&action=submitPublicReport",
            success: function (msg) {
                $("#spanPublicSubmitProgressImage").html("");

                ResetSubmissionForm();
                ResetForm([fNameFldID, lNameFldID, emailFldID, cntryFldID, cityFldID, stateFldID, provFldID, activityLevelFldID, timeFldID, tempFldID, weatherFldID, windDirectionFldID, windFldID, commentFldID, webIdFldID, screenFldID, browserFldID, ipFldID, zipFldID, latFldID, lonFldID]);

                //document.getElementById("spanPublicSubmitProgressImage").innerHTML = "Thank you. The report was submitted successfully.";

//c

                //$("#report-success-modal").modal("show");
                //setTimeout(function () {
                //    $("#report-success-modal").modal('hide');
                //}, 7000);

            },
            error: function (err) {
                //alert(err.responseText);
            }
        });

        $("#modalPublicSubmission").modal("hide");
        $("#report-success-modal").modal("show");
        setTimeout(function () {
            $("#report-success-modal").modal('hide');
        }, 7000);
        DoAnalyticsAndAds("submission/public/" + reportCity + "_" + reportStateProvID, "event", "", "click");
    }
}

function EnableSubmitButton(buttID) {
    var buttonID = new String(buttID);
    document.getElementById(buttonID).disabled = false;
}

function HideSubmissionForm() {
    $("#divSubmissionForm").fadeOut('fast', function () { });
}

function ResetSubmissionForm() {

    $("#divVerifyLocationStatus").html('');
    $("#divStateDropContainer").css("display", "inline");
    $("#divProvDropContainer").css("display", "none");
}

function ResetForm(arrFieldIDs)
{
    $("#" + arrFieldIDs[0]).val(""); //first
    $("#" + arrFieldIDs[1]).val(""); //last
    $("#" + arrFieldIDs[2]).val(""); //email
    $("#" + arrFieldIDs[3])[0].selectedIndex = 0; //country
    $("#" + arrFieldIDs[4]).val(""); //city
    $("#" + arrFieldIDs[5])[0].selectedIndex = 0; //state
    $("#" + arrFieldIDs[6])[0].selectedIndex = 0; //province
    $("#" + arrFieldIDs[7])[0].selectedIndex = 0; //activity
    $("#" + arrFieldIDs[8])[0].selectedIndex = 0; //time
    $("#" + arrFieldIDs[9])[0].selectedIndex = 0; //temp
    $("#" + arrFieldIDs[10])[0].selectedIndex = 0; //weather
    $("#" + arrFieldIDs[11])[0].selectedIndex = 0; //wind dir
    $("#" + arrFieldIDs[12])[0].selectedIndex = 0; //wind speed
    $("#" + arrFieldIDs[13]).val(""); //comments
    $("#" + arrFieldIDs[14]).val(""); //webID
    $("#" + arrFieldIDs[15]).val(""); //screensize
    $("#" + arrFieldIDs[16]).val(""); //browser
    $("#" + arrFieldIDs[17]).val(""); //ip
    $("#" + arrFieldIDs[18]).val(""); //zip
    $("#" + arrFieldIDs[19]).val(""); //lat
    $("#" + arrFieldIDs[20]).val(""); //lon

    $("#divStateDropContainer").css("display", "block");
    $("#divProvDropContainer").css("display", "none");
    $("#divPublicSubmitAlert").html("");
}

function CountCharacterLength(txtArea, outPanel, mxLen) {

    targArea = new String(txtArea);
    outArea = new String(outPanel);
    var maxLen = mxLen;
    var offsetVal = 0;
    lenStr = new String(document.getElementById(targArea).value);
    currLen = lenStr.length;
    offsetVal = (maxLen - currLen);
    if (currLen >= maxLen) {
        offsetVal = 0;
        document.getElementById(targArea).value = lenStr.substring(0, maxLen);
    }
    document.getElementById(outArea).innerHTML = "(" + offsetVal + ")";
}

function DoStateProvDropDowns(countryID, stateDivID, provDivID, stateDropID, provDropID, cityTextID, clearValues) {

    var sd = new String(stateDivID);
    var pd = new String(provDivID);

    switch (parseInt(countryID)) {
        case 1:
            document.getElementById(sd).style.display = "";
            document.getElementById(pd).style.display = "none";
            break;
        case 2:
            document.getElementById(pd).style.display = "";
            document.getElementById(sd).style.display = "none";
            break;
    }
    if (clearValues) {
        document.getElementById(new String(stateDropID)).selectedIndex = 0;
        document.getElementById(new String(provDropID)).selectedIndex = 0;
        document.getElementById(new String(cityTextID)).value = "";
    }
}
function VerifyLocation(city, state, prov, country, zip, lat, lon, submitButtonID) {

    $("#divVerifyLocationStatus").hide();
    var city = document.getElementById(new String(city));
    var state = document.getElementById(new String(state));
    var prov = document.getElementById(new String(prov));
    var country = document.getElementById(new String(country));
    var zip = document.getElementById(new String(zip));
    var lat = document.getElementById(new String(lat));
    var lon = document.getElementById(new String(lon));
    var buttonID = document.getElementById(new String(submitButtonID));
    var cityVal = city.value;
    var countryVal = parseInt(country.options[country.selectedIndex].value);
    var stateProvVal = (countryVal == 1) ? state.options[state.selectedIndex].text : prov.options[prov.selectedIndex].text;
    var locationValid = false;
    document.getElementById("divVerifyLocationStatus").innerHTML = ""
    if (cityVal != "") {
        buttonID.disabled = true;
        document.getElementById("divVerifyLocationStatus").innerHTML = "verifying..."
        //send to server
        $.ajax({
            type: "GET",
            url: "resources/aspx/proxy.aspx",
            data: "rCou=" + countryVal + "&rCit=" + cityVal + "&rStaProv=" + stateProvVal + "&action=verifyLocation",
            success: function (msg) {
                if (msg != "") {
                    msg = msg.toString().split("|");
                    document.getElementById("divVerifyLocationStatus").innerHTML = "";
                    locationValid = "true";
                    city.value = msg[0];
                    zip.value = msg[1];
                    lat.value = msg[2];
                    lon.value = msg[3];
                    document.getElementById("txtFlywayID").value = msg[4];
                    buttonID.disabled = false;
                } else {
                    document.getElementById("divVerifyLocationStatus").innerHTML = "We aren't able to validate the location you provided. Check your spelling or enter a location nearby.";
                    $("#divVerifyLocationStatus").fadeIn();
                    buttonID.disabled = true;
                }
                document.getElementById("locationValid").value = locationValid;
            },
            error: function (err) {
                //alert(err.responseText);
                //alert("The ducks have flown.");
            }
        });
    }
}
/*SUBMISSION FORMS: end*/

/*small device list view work: start*/

function PopulateSearchReportsListView(cntry, cty, stPrv) {
    $.ajax({
        type: "GET",
        url: "resources/aspx/proxy.aspx",
        data: "rCou=" + cntry + "&rCit=" + cty + "&rStaProv=" + stPrv + "&action=mobileWebReportListSearch",
        success: function (msg) {
            //_country = cntry;
            //_cty = cty;
            //_stPrv = stPrv;
            reportList_Success(msg, null);
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}

function buildReportsListView() {
    console.log("buildReportsListView: " + listViewLoadCnt);
    StartProgress($("#divList"));
    $.ajax({
        type: "GET",
        url: "resources/aspx/proxy.aspx",
        data: "action=mobileWebReportList",
        success: function (msg) {
            reportList_Success(msg);
            EndProgress($("#divList"));
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}

function reportList_Success(data, lastViewedReportID) {

    /*
    reportID~city~stateName~submitDate~veLat~veLong~webID~migrationMapUserTypeID|
 
    */

    arrReportIDs.length = 0;

    var reportWrapperClass = new String();
    var reportsListHtml = new String();
    var reportsDataString = new String(data);
    var reportsDataItemsString = new String();
    reportsDataArr = reportsDataString.split("|");
    var reportsDataItemsArr = new Array();
    var reportIndex = 0;
    var currentSelectedReportTypes = [];
    if (data.length > 0) {

        currentSelectedReportTypes.length = 0;

        //1=biologist, 2=field, 3=public
        if ($('#navTogglerBiologist').bootstrapSwitch()[0].checked) {
            currentSelectedReportTypes.push(5);
            currentSelectedReportTypes.push(6);
        }
        if ($('#navTogglerField').bootstrapSwitch()[0].checked) {
            currentSelectedReportTypes.push(1);
            currentSelectedReportTypes.push(2);
            currentSelectedReportTypes.push(3);
        }
        if ($('#navTogglerPublic').bootstrapSwitch()[0].checked) {
            currentSelectedReportTypes.push(0);
        }

        for (var r = 0; r < reportsDataArr.length; r++) {

            reportsDataItemsString = new String(reportsDataArr[r]);
            reportsDataItemsArr = reportsDataItemsString.split("~");

            for (var rt = 0; rt < currentSelectedReportTypes.length; rt++) {

                if ((currentSelectedReportTypes[rt] == parseInt(reportsDataItemsArr[7])) || (reportsDataItemsArr[7] == "" && currentSelectedReportTypes[rt] == 0) || isSearching) {

                    reportWrapperClass = "divReportListItemWrapper";
                    reportIcon = "bulletBlue.png";
                    reportType = "Public Report";
                    if (reportsDataItemsArr[6] != "") { //webID exists
                        reportWrapperClass = "divReportListFldEdtrItemWrapper";
                        reportIcon = "bulletPurple.png";
                        reportType = "Field Report";
                        if (reportsDataItemsArr[7] == "5" || reportsDataItemsArr[7] == "6") { //biologist
                            reportIcon = "bulletOrange.png";
                            reportType = "Biologist Report";
                        }
                    }

                    reportsListHtml += "<a name='report" + reportsDataItemsArr[0] + "'></a>";
                    reportsListHtml += "<div class='" + reportWrapperClass + "' id='report" + reportsDataItemsArr[0] + "' onclick='reportDetail(" + reportsDataItemsArr[0] + ")'>"

                    reportsListHtml += "<div class='divReportListItemLeft'>";
                    reportsListHtml += "<p class='mwReportListLocation'>" + reportsDataItemsArr[1] + ", " + reportsDataItemsArr[2] + "</p>";
                    reportsListHtml += "<div class='mwReportListSubmitDate'>Posted on " + reportsDataItemsArr[3] + "</div>";
                    reportsListHtml += "<div class='mwReportListType'><img src='https://c3405147.ssl.cf0.rackcdn.com/migrationmap/images/" + reportIcon + "'/>" + reportType + "</div>";
                    reportsListHtml += "</div>";

                    reportsListHtml += "<div class='divReportListItemRight'></div>";
                    reportsListHtml += "<div style='clear:both'/>";

                    reportsListHtml += "</div>";
                    reportIndex++;

                    /*if (!isMapPlotted) {
                        arrReportIDs[reportIndex] = [reportIndex, reportsDataItemsArr[0]];
                    }*/
                    break;
                }
            }
        }

        reportsListHtml += "<iframe id='iframeEmbedAdMobileListviewBottom' frameborder='0' width='300' height='250' scrolling='no'></iframe>";

        reportsListHtml += "<div class='divReportListBottomSpacer'>&nbsp;</div";
    }

    $("#divList").html(reportsListHtml);

    isIframeListViewAdLoaded = false;

    setTimeout(function () {
        DoAnalyticsAndAds('reportList', 'view', '', '');
    }, 1000);


    initialListViewLoad = false;
    listViewLoadCnt++;
}

function reportDetail(reportID) {
    $.ajax({
        type: "GET",
        url: "resources/aspx/proxy.aspx",
        data: "rid=" + reportID + "&action=mobileWebReportDetail",
        success: function (msg) {
            reportDetail_Success(msg);
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}

function reportDetail_Success(data) {

    $("#GlobalModal").modal('show');

    var reportDetailHtml = new String();
    var reportDataString = new String(data);
    var reportDataArr = new Array();
    var isPublicReport = true;

    reportDataArr = reportDataString.split("~");

    if (data.length > 0) {

        //reportID,city,stateName,submitDate,submittedBy,comments,activityLevelDesc,facebookUrl, isvalidated, lat, lon, webID, validationCount, migrationMapUserTypeID,feReportWeather,feReportMigSpecNum,feReportHunting;

        reportDetailHtml += "<div class='mwReportDetailWrapper'>";

        reportIcon = "bulletBlue.png";
        reportType = "Public Report";
        if (reportDataArr[11] != "") { //webID exists
            isPublicReport = false;
            reportIcon = "bulletPurple.png";
            reportType = "Field Report";
            if (reportDataArr[13] == "5" || reportDataArr[13] == "6") { //biologist
                reportIcon = "bulletOrange.png";
                reportType = "Biologist Report";
            }
        }
        reportDetailHtml += "<div class=\"mwReportListType\"><img src='https://c3405147.ssl.cf0.rackcdn.com/migrationmap/images/" + reportIcon + "'/>" + reportType + "</div>";
        reportDetailHtml += "<div class='mwReportDetailLocation'>"
        reportDetailHtml += "<h4 class='mwReportListLocation'>";
        reportDetailHtml += reportDataArr[1] + ", " + reportDataArr[2];
        reportDetailHtml += "</h4>";
        reportDetailHtml += "</div>";

        reportDetailHtml += "Submitted";
        reportDetailHtml += "<div class='mwReportDetailCommon'>"
        reportDetailHtml += reportDataArr[3] + " by " + reportDataArr[4];
        reportDetailHtml += "</div>";

        if (isPublicReport) {
            if (reportDataArr[5] != "") {
                reportDetailHtml += "Report";
                reportDetailHtml += "<div class='mwReportDetailCommon'>"
                reportDetailHtml += reportDataArr[5];
                reportDetailHtml += "</div>";
            }

            reportDetailHtml += "Activity level";
            reportDetailHtml += "<div class='mwReportDetailCommon'>"
            reportDetailHtml += reportDataArr[6];
            reportDetailHtml += "</div>";
        }
        else
        {
            if (reportDataArr[16] != "") {
                reportDetailHtml += "Hunting";
                reportDetailHtml += "<div class='mwReportDetailCommon'>"
                reportDetailHtml += reportDataArr[16];
                reportDetailHtml += "</div>";
            }
            if (reportDataArr[15] != "") {
                reportDetailHtml += "Species/Numbers";
                reportDetailHtml += "<div class='mwReportDetailCommon'>"
                reportDetailHtml += reportDataArr[15];
                reportDetailHtml += "</div>";
            }
            if (reportDataArr[14] != "") {
                reportDetailHtml += "Weather";
                reportDetailHtml += "<div class='mwReportDetailCommon'>"
                reportDetailHtml += reportDataArr[14];
                reportDetailHtml += "</div>";
            }
            if (reportDataArr[5] != "") {
                reportDetailHtml += "Comments";
                reportDetailHtml += "<div class='mwReportDetailCommon'>"
                reportDetailHtml += reportDataArr[5];
                reportDetailHtml += "</div>";
            }

        }
        reportDetailHtml += "</div>";

        reportDetailHtml += "<div style=\"width:100%;margin-bottom:15px\" class=\"divReportsColumn1Ad visible-sm visible-xs hidden-md hidden-lg text-center\"><iframe align=\"center\" id='iframeEmbedAdReportDetailBottom2' frameborder='0' width='300' height='250' scrolling='no'></iframe></div><div style=\"clear:both\">";
    } else {
        reportDetailHtml = "no data for report id " + reportDetailHtml;
    }

    $("#h4ModelHeaderGlobalModal").html(reportType);
    $("#divModalContentGlobalModal").html(reportDetailHtml);
    $("#report" + reportDataArr[0]).css("background", "#efefef");

    $("#iframeEmbedAdReportDetailBottom2").attr("src", "resources/aspx/AdFrameEmbed1.aspx");

    reloadAd = false;
    DoAnalyticsAndAds('reportDetail/' + reportDataArr[0], 'view', '', '');
    reloadAd = true;
}
/*small device list view work: end*/

/*log in to My DU submission:start*/

function showLogin(state)
{
    $("#txtEml").val('');
    $("#txtPwd").val('');
    $("#divLoginResponse").html('');

    if (state) {
        $(".page-mask").fadeIn();
        $("#modal-login").fadeIn("fast", function () {
            $("#txtEml").focus();
        });

    } else {
        $(".page-mask").fadeOut();

        $("#modal-login").fadeOut("fast", function () {
            $("#TextBoxPublicSubmissionFormComments").fadeIn("fast");
        });
    }
}

function LogInViaMyDU()
{
    var destinationUrl = new String();

    destinationUrl += "/mydu/login.aspx?ReturnUrl=/migrationmap%3Fview=submissionForm%26activity=" + $("#DropDownListPublicSubmissionFormActivityLevel").val() + "%26";
    destinationUrl += "country=" + $("#DropDownListPublicSubmissionFormCountryID").val() + "%26state=" + $("#DropDownListPublicSubmissionFormStateID").val() + "%26";
    destinationUrl += "prov=" + $("#DropDownListPublicSubmissionFormProvinceID").val() + "%26city=" + $("#TextBoxPublicSubmissionFormCity").val() + "%26";
    destinationUrl += "time=" + $("#DropDownListPublicSubmissionFormTimeOfSighting").val() + "%26temp=" + $("#DropDownListPublicSubmissionFormTemp").val() + "%26";
    destinationUrl += "weather=" + $("#DropDownListPublicSubmissionFormWeather").val() + "%26dir=" + $("#DropDownListPublicSubmissionFormWindDirection").val() + "%26";
    destinationUrl += "speed=" + $("#DropDownListPublicSubmissionFormWindSpeed").val();

    console.log(destinationUrl);

    window.location = destinationUrl;

}

function btnLogInClick()
{
    var eml = new String($("#txtEml").val());
    var pwd = new String($("#txtPwd").val());

    if (isValidEmail(eml) && pwd.length > 0) {
        //$("#divLoginActionPending").css("display", "block");
        //$("#divLoginActionItems").css("display", "none");
        $.ajax({
            type: "POST",
            url: "resources/aspx/proxy.aspx?action=loginFromSubmission&ReturnUrl=migrationMap",
            data: "eml=" + eml + "&pwd=" + pwd,
            dataType: "text",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (req) {
                req.setRequestHeader("Access-Control-Allow-Origin", "*");
            },
            success: function (msg, status, xhr) {

                var msgData = JSON.parse(msg); 

                if (msgData.data.success == "1")
                {
                    //$("#TextBoxPublicSubmissionFormFirstName").val(msgData.data.firstName);
                    //$("#TextBoxPublicSubmissionFormFirstName").prop("disabled", true);

                    //$("#TextBoxPublicSubmissionFormLastName").val(msgData.data.lastName);
                    //$("#TextBoxPublicSubmissionFormLastName").prop("disabled", true);

                    //$("#TextBoxPublicSubmissionFormEmail").val(eml);
                    //$("#TextBoxPublicSubmissionFormEmail").prop("disabled", true);

                    loginSuccess();

                    console.log("xhr: " + xhr.getAllResponseHeaders());

                }
                else
                {
                    loginFailure();
                }
                //$("#divLoginActionPending").css("display", "none");
                //$("#divLoginActionItems").css("display", "block");
            },
            error: function (err) {
                console.log("err: " + err.responseText);
            }
        });
    } else {
        loginFailure();
    }
}

function loginSuccess()
{
    $("#txtEml").val('');
    $("#txtPwd").val('');
    $("#panelLogInToProvideComment").css("display", "none");
    $("#TextBoxPublicSubmissionFormComments").css({ "opacity": 1, "display": "block" });
    toggleDisabled(false);
    $("#TextBoxPublicSubmissionFormComments").focus();
    showLogin(false);
    $("#toast-login .toast").toast("show");
    DoAnalyticsAndAds('login_success/', 'view', '', '');
}

function loginFailure()
{
    //console.log("login failure");
    $("#txtPwd").val('');
    $("#divLoginResponse").fadeOut().html("Email or password incorrect").fadeIn();
}
function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function toggleDisabled(state)
{
    $("#TextBoxPublicSubmissionFormComments").prop("disabled", state);
}

function showInfoModal(infoType)
{
    var str = new String();
    switch (infoType) {
        case "login_submission":
            str = "<p>";
            str += "<img class='modal_icon' src='resources/images/excl_pt.png'/>";
            str += "<b>Why do I have to log in?</b>";
            str += "</p>";
            str += "<p>";
            str += "For quality assurance, you must login to your My DU account in order to include a comment with your report.";
            str += "</p>";
    }
    $("#divModalContentGlobalModal").html(str);
    $("#GlobalModal").modal('show');
}

/*log in from public submission:end*/

/*
$(document).ready(function () {

    var tmpReport = [];
    tmpReport[0] = ['35.557255', '-89.657223', 1, 'Covington', 'Tennessee', 'Tuesday, September 12', '', 'spanInfoBox1CalloutTip', '<img src=\"/migrationmap/resources/images/Husqvarna_86_39.png\" />', '9/11/2017 12:30:00 PM', '9/13/2017 12:30:00 PM', '', '2017', '38019', true, 'Mississippi'];
    tmpReport[1] = ['35.557255', '-89.657223', 2, 'Covington', 'Tennessee', 'Tuesday, September 12', '', 'spanInfoBox2CalloutTip', '<img src=\"/migrationmap/resources/images/Husqvarna_86_39.png\" />', '9/11/2017 12:30:00 PM', '9/13/2017 12:30:00 PM', '', '2017', '38019', true, 'Mississippi'];

    for (var r = 0; r < tmpReport.length; r++)
    {
        ap.push(tmpReport[r][0]);
        bp.push(tmpReport[r][1]);
        cp.push(tmpReport[r][2]);
        dpdu.push(tmpReport[r][3]);
        ep.push(tmpReport[r][4]);
        fp.push(tmpReport[r][5]);
        gp.push(tmpReport[r][6]);
        hp.push(tmpReport[r][7]);
        ip.push(tmpReport[r][8]);
        jp.push(tmpReport[r][9]);
        kp.push(tmpReport[r][10]);
        lp.push(tmpReport[r][11]);
        mp.push(tmpReport[r][12]);
        np.push(tmpReport[r][13]);
        op.push(tmpReport[r][14]);
        pp.push(tmpReport[r][15]);
    }

})
*/
