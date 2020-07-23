import React from "react";

export function getAgeFromDateString(datestring) {
  const todate = new Date();

  var age = [],
    fromdate = new Date(datestring),
    y = [todate.getFullYear(), fromdate.getFullYear()],
    ydiff = y[0] - y[1],
    m = [todate.getMonth(), fromdate.getMonth()],
    mdiff = m[0] - m[1],
    d = [todate.getDate(), fromdate.getDate()],
    ddiff = d[0] - d[1];

  if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
  if (mdiff < 0) mdiff += 12;
  if (ddiff < 0) {
    fromdate.setMonth(m[1] + 1, 0);
    ddiff = fromdate.getDate() - d[1] + d[0];
    --mdiff;
  }
  if (ydiff > 0) age.push(ydiff + " year" + (ydiff > 1 ? "s " : " "));
  if (mdiff > 0) age.push(mdiff + " month" + (mdiff > 1 ? "s" : ""));
  if (ddiff > 0) age.push(ddiff + " day" + (ddiff > 1 ? "s" : ""));
  if (age.length > 1) age.splice(age.length - 1, 0, " and ");
  return age.join("");
}

export function parseString(string, className) {
  const stringArray = string.split("/n");
  return stringArray.map((string) => {
    return (
      <p key={string.slice(10)} className={className}>
        {parseSuperScript(string)}
      </p>
    );
  });
}

function parseSuperScript(string) {
  if (string.indexOf("/^") === -1) return string;
  const strings = string.split("/^");

  const letters = [];
  strings.forEach((string) => {
    const firstSpaceIndex = string.indexOf(" ");
    if (firstSpaceIndex !== -1) {
      letters.push(<sup>{string.slice(0, firstSpaceIndex)}</sup>);
      string = string.slice(firstSpaceIndex);
    }
    for (const letter of string) {
      letters.push(letter);
    }
  });

  return letters;
}
