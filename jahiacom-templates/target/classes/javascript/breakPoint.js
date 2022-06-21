var migMapBp = GetBreakpoint();

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