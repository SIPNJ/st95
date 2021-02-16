/**
 * @class CalendarPicker.
 * @description Provides a simple way to get a minimalistic calender in your DOM.
 * @author Mathias Picker - 29 July 2020.
 */

class CalendarPicker {
  constructor(element, options) {
    // Core variables.
    this.date = new Date();
    this._formatDateToInit(this.date);

    this.day = this.date.getDay();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    // Storing the todays date for practical reasons.
    this.today = this.date;

    // The calendars value should always be the current date.
    this.value = this.date;

    // Ranges for the calendar (optional).
    this.min = options.min;
    this.max = options.max;
    this._formatDateToInit(this.min);
    this._formatDateToInit(this.max);

    // Element to insert calendar in.
    this.userElement = document.querySelector(element);

    // Destructuring current date as readable text.
    [
      this.dayAsText,
      this.monthAsText,
      this.dateAsText,
      this.yearAsText,
    ] = this.date.toString().split(" ");

    // The elements used to build the calendar.
    this.calendarWrapper = document.createElement("div");
    this.calendarElement = document.createElement("div");
    this.calendarHeader = document.createElement("header");
    this.calendarHeaderTitle = document.createElement("div");
    this.previousMonthArrow = document.createElement("button");
    this.nextMonthArrow = document.createElement("button");
    this.calendarGridDays = document.createElement("section");
    this.calendarGrid = document.createElement("section");
    this.calendarDayElementType = "time";

    // Hard-coded list of all days.
    this.listOfAllDaysAsText = ["M", "T", "W", "T", "F", "S", "S"];

    // Hard-coded list of all months.
    this.listOfAllMonthsAsText = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Creating the calendar
    this.calendarWrapper.id = "calendar-wrapper";
    this.calendarElement.id = "calendar";
    this.calendarGridDays.id = "calendar-days";
    this.calendarGrid.id = "calendar-grid";
    this.previousMonthArrow.id = "previous-month";
    this.nextMonthArrow.id = "next-month";

    this._insertHeaderIntoCalendarWrapper();
    // this._insertNavigationButtons();
    this._insertCalendarGridDaysHeader();
    this._insertDaysIntoGrid();
    this._insertCalendarIntoWrapper();

    this.userElement.appendChild(this.calendarWrapper);
  }

  /**
   * @param {Number} The month number, 0 based.
   * @param {Number} The year, not zero based, required to account for leap years.
   * @return {Array<Date>} List with date objects for each day of the month.
   * @author Juan Mendes - 30th October 2012.
   */
  _getDaysInMonth = (month, year) => {
    if ((!month && month !== 0) || (!year && year !== 0)) return;

    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  /**
   * @param {DateObject} date.
   * @description Sets the clock of a date to 00:00:00 to be consistent.
   */
  _formatDateToInit = (date) => {
    if (!date) return;
    date.setHours(0, 0, 0);
  };

  /**
   * @description Inserts the calendar into the wrapper and adds eventListeners for the calender-grid.
   */
  _insertCalendarIntoWrapper = () => {
    this.calendarWrapper.appendChild(this.calendarElement);

    /**
     * @param {Event} event An event from an eventListener.
     */
  //   const handleSelectedElement = (event) => {
  //     if (
  //       event.target.nodeName.toLowerCase() === this.calendarDayElementType &&
  //       !event.target.classList.contains("disabled")
  //     ) {
  //       // Removes the 'selected' class from all elements that have it.
  //       Array.from(document.querySelectorAll(".selected")).forEach((element) =>
  //         element.classList.remove("selected")
  //       );

  //       // Adds the 'selected'-class to the selected date.
  //       event.target.classList.add("selected");

  //       this.value = event.target.value;
  //     }
  //   };

  //   this.calendarGrid.addEventListener("click", handleSelectedElement, false);

  //   this.calendarGrid.addEventListener(
  //     "keydown",
  //     (keyEvent) => {
  //       if (keyEvent.key !== "Enter") return;

  //       handleSelectedElement(keyEvent);
  //     },
  //     false
  //   );
  };

  /**
   * @description Adds the "main" calendar-header.
   */
  _insertHeaderIntoCalendarWrapper = () => {
    this.calendarHeaderTitle.textContent = `${
      this.listOfAllMonthsAsText[this.month]
    } - ${this.year}`;

    // const arrowSvg =
    //   '<svg enable-background="new 0 0 386.257 386.257" viewBox="0 0 386.257 386.257" xmlns="http://www.w3.org/2000/svg"><path d="m0 96.879 193.129 192.5 193.128-192.5z"/></svg>';

    // this.previousMonthArrow.innerHTML = arrowSvg;
    // this.nextMonthArrow.innerHTML = arrowSvg;

    this.previousMonthArrow.setAttribute("aria-label", "Go to previous month");
    this.nextMonthArrow.setAttribute("aria-label", "Go to next month");

    const arrow_right = document.createElement("i");
    const arrow_left = document.createElement("i");
    arrow_right.classList.add("fas", "fa-long-arrow-alt-right");
    arrow_left.classList.add("fas", "fa-long-arrow-alt-left");

    this.previousMonthArrow.appendChild(arrow_left);
    this.nextMonthArrow.appendChild(arrow_right);
    this.previousMonthArrow.addEventListener("click", ()=>{
      if (this.month === 0) {
        this.month = 11;
        this.year -= 1;
      } else {
        this.month -= 1;
      }
      this._updateCalendar();
    });
    this.nextMonthArrow.addEventListener("click", ()=>{
      if (this.month === 11) {
        this.month = 0;
        this.year += 1;
      } else {
        this.month += 1;
      }
      this._updateCalendar();
    })

    this.calendarHeader.appendChild(this.previousMonthArrow);
    this.calendarHeader.appendChild(this.calendarHeaderTitle);
    this.calendarHeader.appendChild(this.nextMonthArrow);
    this.calendarWrapper.appendChild(this.calendarHeader);
  };

  /**
   * @description Inserts the calendar-grid header with all the weekdays.
   */
  _insertCalendarGridDaysHeader = () => {
    this.listOfAllDaysAsText.forEach((day) => {
      const dayElement = document.createElement("span");
      dayElement.textContent = day;
      this.calendarGridDays.appendChild(dayElement);
    });
    this.calendarElement.appendChild(this.calendarGridDays);
  };

  /**
   * @description Adds all the days for current month into the calendar-grid.
   * Takes into account which day the month starts on, so that "empty/placeholder" days can be added
   * in case the month for example starts on a Thursday.
   * Also disables the days that are not within the provided.
   */
  _insertDaysIntoGrid = () => {
    this.calendarGrid.innerHTML = "";

    let arrayOfDays = this._getDaysInMonth(this.month, this.year);
    let firstDayOfMonth = arrayOfDays[0].getDay();

    // Converting Sunday (0 when using getDay()) to 7 to make it easier to work with.
    firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    if (1 < firstDayOfMonth) {
      arrayOfDays = Array(firstDayOfMonth - 1)
        .fill(false, 0)
        .concat(arrayOfDays);
    }

    arrayOfDays.forEach((date) => {
      const dateElement = document.createElement(
        date ? this.calendarDayElementType : "span"
      );
      const [Day, Month, Date, Year] = date.toString().split(" ");

      const dateIsTheCurrentValue = this.value.toString() === date.toString();
      if (dateIsTheCurrentValue) this.activeDateElement = dateElement;

      const dateIsBetweenAllowedRange =
        (this.min || this.max) &&
        date.toString() !== this.today.toString() &&
        (date < this.min || date > this.max);
      if (dateIsBetweenAllowedRange) {
        dateElement.classList.add("disabled");
      } else {
        dateElement.tabIndex = 0;
        dateElement.value = date;
      }

      dateElement.textContent = date ? `${Date}` : "";
      this.calendarGrid.appendChild(dateElement);
    });

    this.calendarElement.appendChild(this.calendarGrid);
    this.activeDateElement.classList.add("selected");
  };

  /**
   * @description Updates the core-values for the calendar based on the new month and year
   * given by the navigation. Also updates the UI with the new values.
   */
  _updateCalendar = () => {
    this.date = new Date(this.year, this.month);

    [
      this.dayAsText,
      this.monthAsText,
      this.dateAsText,
      this.yearAsText,
    ] = this.date.toString().split(" ");
    this.day = this.date.getDay();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    window.requestAnimationFrame(() => {
      this.calendarHeaderTitle.textContent = `${
        this.listOfAllMonthsAsText[this.month]
      } - ${this.year}`;
      this._insertDaysIntoGrid();
    });
  };
}
// Let's use
const previousYear = new Date().getFullYear() - 10;
const nextYear = new Date().getFullYear() + 10;
const myCalender = new CalendarPicker("#myCalendarWrapper", {
  // If max < min or min > max then the only available day will be today.
  min: new Date(previousYear, 10),
  max: new Date(nextYear, 10), // NOTE: new Date(nextYear, 10) is "Sun Nov 01 <nextYear>"
});
