function addZero(m) {
    return m < 10 ? '0' + m : m;
}

function handleFilename(filename) {
    const filenameArr = filename.split('.');
    const fileType = filenameArr[filenameArr.length-1];
    const time = new Date()
    const year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = addZero(month);
    let day = time.getDate();
    day = addZero(day);
    const randomNum = Math.floor(Math.random() * 10000000);
    return `${year}-${month}-${day}/${randomNum}.${fileType}`;
  }

  module.exports = {handleFilename, addZero};