import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import "ojs/ojformlayout";
import "oj-c/input-text";
import { CInputTextElement } from "oj-c/input-text";
import "ojs/ojdatetimepicker";
import { InputDateElement } from "ojs/ojdatetimepicker";
import "ojs/ojselectsingle";
import "ojs/ojbutton";
import "ojs/ojtoolbar";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import { ojSelectSingle } from "ojs/ojselectsingle";
import { KeySetImpl, KeySet } from "ojs/ojkeyset";

type Event = {
  name: string;
  startTime: string;
};

type Time = {
  value: string;
  label: string;
};

const generateArray = (size: number, base: number) => {
  let fullArray: Array<object> = [];
  let x = base;
  let value = "";
  while (x < size + base) {
    value = x < 10 ? "0" + x : x.toString();
    fullArray.push({ value: value, label: value });
    x++;
  }
  return fullArray;
};

const stringBuilder = (name?, date?, hour?, min?, sec?) => {
  let obj: Partial<Event> = {};
  let output = "";
  let event = "";
  let datetime = "";
  event = name ? name : "Event";
  datetime = date ? date + "T" : "12-25-2022T";
  datetime = datetime += hour
    ? (hour + 1).toString().padStart(2, "0") + ":"
    : "00:";
  datetime = datetime += min ? min.toString().padStart(2, "0") + ":" : "00:";
  datetime = datetime += sec ? sec.toString().padStart(2, "0") : "00";
  obj.name = event;
  obj.startTime = datetime;
  //  {"name":"my event", "startTime":"YYYY-MM-DDTHH:MM:SS"}
  return obj;
};

const hours = generateArray(24, 1);
const hourDP = new MutableArrayDataProvider(hours);

const minutes = generateArray(60, 0);
const minuteDP = new MutableArrayDataProvider(minutes);

const seconds = generateArray(60, 0);
const secondDP = new MutableArrayDataProvider(seconds);

export const Content = () => {
  const [eventName, setEventName] = useState<string>();
  const [eventDateTime, setEventDateTime] = useState<string>(); // isoDateString
  const [hourValue, setHourValue] = useState<any>();
  const [minuteValue, setMinuteValue] = useState<any>();
  const [secondValue, setSecondValue] = useState<any>();
  const [output, setOutput] = useState<object>();
  const [publish, setPublish] = useState([]);

  const eventNameChangeHandler = (
    event: CInputTextElement.valueChanged<Event["name"]>
  ) => {
    if (event.detail.value) setEventName(event.detail.value);
  };

  const datechangehandler = (event: InputDateElement.valueChanged) => {
    if (event.detail.updatedFrom === "internal") {
      console.log(event.detail.value);
      setEventDateTime(event.detail.value);
    }
  };

  const hourchangehandler = (
    event: ojSelectSingle.valueChanged<Time["value"], Time>
  ) => {
    if (event.detail.updatedFrom === "internal") {
      setHourValue(event.detail.value);
    }
  };
  const minutechangehandler = (
    event: ojSelectSingle.valueChanged<Time["value"], Time>
  ) => {
    if (event.detail.updatedFrom === "internal") {
      setMinuteValue(event.detail.value);
    }
  };
  const secondchangehandler = (
    event: ojSelectSingle.valueChanged<Time["value"], Time>
  ) => {
    if (event.detail.updatedFrom === "internal") {
      setSecondValue(event.detail.value);
    }
  };

  const actionHandler = () => {
    setOutput(
      stringBuilder(
        eventName,
        eventDateTime,
        hourValue,
        minuteValue,
        secondValue
      )
    );
  };

  useEffect(() => {
    let tempArray = [...publish];
    if (output) {
      tempArray.push(output);
    }
    setPublish(tempArray);
  }, [output]);

  const clearHandler = () => {
    setPublish([]);
    setOutput(null);
  };
  const publishHandler = () => {
    // TODO:  compete method of publishing the schedule
  };

  return (
    <div class="oj-web-applayout-max-width oj-web-applayout-content">
      <h1>Schedule Builder</h1>
      <oj-form-layout>
        <oj-c-input-text
          value={eventName}
          onvalueChanged={eventNameChangeHandler}
          labelHint="Event name"></oj-c-input-text>
        <oj-input-date
          labelHint="Date"
          value={eventDateTime}
          onvalueChanged={datechangehandler}></oj-input-date>
        <oj-select-single
          data={hourDP}
          value={hourValue}
          labelHint="Hour"
          onvalueChanged={hourchangehandler}></oj-select-single>
        <oj-select-single
          data={minuteDP}
          value={minuteValue}
          labelHint="Minute"
          onvalueChanged={minutechangehandler}></oj-select-single>
        <oj-select-single
          data={secondDP}
          value={secondValue}
          labelHint="Second"
          onvalueChanged={secondchangehandler}></oj-select-single>
        <oj-toolbar>
          <oj-button onojAction={actionHandler}>Add Event</oj-button>
          <oj-button onojAction={publishHandler}>Publish Schedule</oj-button>
          <oj-button onojAction={clearHandler}>Clear Schedule</oj-button>
        </oj-toolbar>
      </oj-form-layout>
      <h4 class="oj-typography-subheading-sm">Current Schedule</h4>
      <div>{JSON.stringify(publish)}</div>
    </div>
  );
};
