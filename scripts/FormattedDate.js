class FormattedDate {
  // yyyymmdd -> yyyy.mm.dd로 변환
  static getDate(date) {
    return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6)}`;
  }

  static getYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const year = String(yesterday.getFullYear());
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const date = String(yesterday.getDate()).padStart(2, "0");

    return year + month + date;
  }

  static getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));

    const year = String(tomorrow.getFullYear());
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const date = String(tomorrow.getDate()).padStart(2, "0");

    return year + month + date;
  }
}

export default FormattedDate;
