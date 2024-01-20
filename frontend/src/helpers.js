//function to handle dates to display prettier
//SQL was providing times 6 hours ahead
//converting from GT to CST

//changing day and hour in helper function
const timeConverter = date => {
  const wrongDate = date.split(" ");
  let wrongTime = wrongDate[1].split(":");
  let wrongDay = wrongDate[0].split("-");
  let day = +wrongDay[2];
  let hour = +wrongTime[0] - 6;

  if (hour < 0) {
    hour += 24;
    day -= 1;
  }

  wrongTime[0] = hour.toString();
  wrongDay[2] = day.toString();
  wrongDay = wrongDay.join("-");
  wrongTime = wrongTime.join(":");
  const correctDate = [wrongDay, wrongTime].join(" ");
  return correctDate;
};

//function converts SQL date object "2000-01-01T12:00:00.786Z"
//to the format below:
//Sunday, January 1, 2000, 12:00AM
export function prettyDateMaker(SQLDate = new Date()) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  let date = new Date(SQLDate).toISOString().slice(0, 19).replace("T", " ");
  const newDate = timeConverter(date);
  date = new Date(newDate);
  return date.toLocaleDateString("en-US", options);
}

//match notebook dates
export const findUpdate = (id, notes) => prettyDateMaker(notes[id]?.updatedAt);
