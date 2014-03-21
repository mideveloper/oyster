/**
* This is the description for Epoch class.
* 
* @module Util
* @class Epoch
* @constructor
*/

/**
 * Description
 * @method abc
 * @return Current DateTime in Epoch
 * @constructor
 */

/**
 * Description
 * @method cde
 * @return Current DateTime in Epoch
 * @constructor
 */

/**
 * Description
 * @method lmg
 * @return Current DateTime in Epoch
 * @constructor
 */

/**
 * Description
 * @method asdfasdfasdf
 * @return Current DateTime in Epoch
 * @constructor
 */
function getNow() {

    return new Date().getTime();
}

/**
 * Description
 * @method getYearsSince
 * @param {Number (should be datetime in epoch)} epoch
 * @return years
 */
function getYearsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var years = Math.floor((now - then) / 31536000000);
    return years;
}

/**
 * Description
 * @method addMinutes
 * @param {} epoch
 * @param {} m
 * @return da
 */
function addMinutes(epoch, m) {

    var da = epoch + (m * 60000);
    return da;
}

/**
 * Description
 * @method addSeconds
 * @param {} epoch
 * @param {} m
 * @return da
 */
function addSeconds(epoch, m) {

    var da = epoch + (m * 1000);
    return da;
}

/**
 * Description
 * @method subtractMinutes
 * @param {} epoch
 * @param {} m
 * @return da
 */
function subtractMinutes(epoch, m) {

    var da = epoch - (m * 60000);
    return da;
}

/**
 * Description
 * @method subtractDays
 * @param {} epoch
 * @param {} _d
 * @return da
 */
function subtractDays(epoch, _d) {
    // 1 day = 1440 mins as per google :)
    var da = subtractMinutes(epoch, (_d * 1440));
    return da;
}

/**
 * Description
 * @method addDays
 * @param {} epoch
 * @param {} _d
 * @return da
 */
function addDays(epoch, _d) {
    // 1 day = 1440 mins as per google :)
    var da = addMinutes(epoch, (_d * 1440));
    return da;
}

/**
 * Description
 * @method addYears
 * @param {} epoch
 * @param {} m
 * @return da
 */
function addYears(epoch, m) {

    var da = epoch + (m * 31536000000);
    return da;
}

/**
 * Description
 * @method isInFuture
 * @param {} epoch
 * @return 
 */
function isInFuture(epoch) {

    var now = getNow();
    if (now < epoch) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Description
 * @method isInPast
 * @param {} epoch
 * @return 
 */
function isInPast(epoch) {

    var now = getNow();
    if (now >= epoch) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Description
 * @method getMillisecondsSince
 * @param {} epoch
 * @return seconds
 */
function getMillisecondsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var seconds = now - then;
    return seconds;
}

/**
 * Description
 * @method getSecondsSince
 * @param {} epoch
 * @return seconds
 */
function getSecondsSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var seconds = Math.floor((now - then) / 1000);
    return seconds;
}

/**
 * Description
 * @method getMinutesSince
 * @param {} epoch
 * @return minutes
 */
function getMinutesSince(epoch) {

    var now = getNow();
    var then = new Date(epoch);
    var minutes = Math.floor((now - then) / 60000);
    return minutes;
}

/**
 * Description
 * @method getHoursSince
 * @param {} utcDate
 * @return hours
 */
function getHoursSince(utcDate) {

    var now = getNow();
    var then = new Date(utcDate);
    var hours = Math.floor((now - then) / 3600000);
    return hours;
}

/**
 * Description
 * @method getDaysSince
 * @param {} utcDate
 * @return days
 */
function getDaysSince(utcDate) {

    var now = getNow();
    var then = new Date(utcDate);
    var days = Math.floor((now - then) / 86400000);
    return days;
}

/**
 * Description
 * @method getMinDate
 * @return then
 */
function getMinDate() {
    var now = getNow();
    var then = now - (10 * 31536000000);
    return then;
}

/**
 * Description
 * @method getMaxDate
 * @return then
 */
function getMaxDate() {
    var now = getNow();
    var then = now + (10 * 31536000000);
    return then;
}

/**
 * Description
 * @method fromEpoch
 * @param {} epoch
 * @return BinaryExpression
 */
function fromEpoch(epoch) {

    return epoch * 1000;
}

/**
 * Description
 * @method toEpoch
 * @param {} hammerTime
 * @return CallExpression
 */
function toEpoch(hammerTime) {

    return Math.floor(hammerTime / 1000);
}

/**
 * Description
 * @method getEpochBeforeMinutes
 * @param {} minutes
 * @return then
 */
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
