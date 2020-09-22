

module.exports = (value = false, timeTrue = true) => {
    let inputDate
    if (value) {
        inputDate = new Date(value);
    } else {
        inputDate = new Date();
    }

    const day = ('0' + inputDate.getDate()).slice(-2);
    const year = inputDate.getFullYear();
    const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
    const hours = ('0' + inputDate.getHours()).slice(-2);
    const minutes = ('0' + inputDate.getMinutes()).slice(-2);
    let rezult = day + '.' + month + '.' + year;
    if (timeTrue) {
        rezult += ` ${hours}:${minutes}`
    }
    return rezult;
    // const inputDate = new Date(value);
    // const day = ('0' + inputDate.getDate()).slice(-2);
    // const year = inputDate.getFullYear();
    // const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
    // return day + '.' + month + '.' + year;
};




