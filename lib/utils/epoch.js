function getNow() {

    return new Date().getTime();
}

function getYearsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var years = Math.floor((now - then) / 31536000000);
    return years;
}

function addMinutes(epoch, m) {

    var da = epoch + (m * 60000);
    return da;
}

function addSeconds(epoch, m) {

    var da = epoch + (m * 1000);
    return da;
}

function subtractMinutes(epoch, m) {

    var da = epoch - (m * 60000);
    return da;
}

function subtractDays(epoch, _d) {
    // 1 day = 1440 mins as per google :)
    var da = subtractMinutes(epoch, (_d * 1440));
    return da;
}

function addDays(epoch, _d) {
    // 1 day = 1440 mins as per google :)
    var da = addMinutes(epoch, (_d * 1440));
    return da;
}

function addYears(epoch, m) {

    var da = epoch + (m * 31536000000);
    return da;
}

function isInFuture(epoch) {

    var now = getNow();
    if (now < epoch) {
        return true;
    }
    else {
        return false;
    }
}

function isInPast(epoch) {

    var now = getNow();
    if (now >= epoch) {
        return true;
    }
    else {
        return false;
    }
}

function getMillisecondsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var seconds = now - then;
    return seconds;
}

function getSecondsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var seconds = Math.floor((now - then) / 1000);
    return seconds;
}

function getMinutesSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var minutes = Math.floor((now - then) / 60000);
    return minutes;
}

function getHoursSince(utcDate) {

    var now = getNow();
    var then = new Date(utcDate);
    var hours = Math.floor((now - then) / 3600000);
    return hours;
}

function getDaysSince(utcDate) {

    var now = getNow();
    var then = new Date(utcDate);
    var days = Math.floor((now - then) / 86400000);
    return days;
}

function getMinDate() {
    var now = getNow();
    var then = now - (10 * 31536000000);
    return then;
}

function getMaxDate() {
    var now = getNow();
    var then = now + (10 * 31536000000);
    return then;
}

function fromEpoch(epoch) {

    return epoch * 1000;
}

function toEpoch(hammerTime) {

    return Math.floor(hammerTime / 1000);
}

function getEpochBeforeMinutes(minutes) {
    var now = getNow();
    var then = subtractMinutes(now, minutes); // addMinutes(minutes);
    //then = toEpoch(then);
    return then;
}

exports.now = getNow;
exports.addSeconds = addSeconds;
exports.addMinutes = addMinutes;
exports.addDays = addDays;
exports.subtractDays = subtractDays;
exports.subtractMinutes = subtractMinutes;
exports.addYears = addYears;
exports.isInFuture = isInFuture;
exports.isInPast = isInPast;
exports.getMillisecondsSince = getMillisecondsSince;
exports.getSecondsSince = getSecondsSince;
exports.getMinutesSince = getMinutesSince;
exports.getHoursSince = getHoursSince;
exports.getDaysSince = getDaysSince;
exports.getYearsSince = getYearsSince;
exports.getMinDate = getMinDate;
exports.getMaxDate = getMaxDate;
exports.fromEpoch = fromEpoch;
exports.toEpoch = toEpoch;
exports.getEpochBeforeMinutes = getEpochBeforeMinutes;
