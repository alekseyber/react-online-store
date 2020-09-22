module.exports.addGet = (url, name, value, amp = true) => {

    if (url.indexOf('?') === -1) {
        url = url + "?" + name + "=" + value;
    } else {

        if (amp) {
            amp = "&amp;";
        } else {
            amp = "&";
        }
        url = url + amp + name + "=" + value;
    }
    return url
}






