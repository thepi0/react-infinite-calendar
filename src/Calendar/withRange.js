import {compose, withProps, withPropsOnChange, withState} from 'recompose';
import classNames from 'classnames';
import {withDefaultProps} from './';
import {withImmutableProps} from '../utils';
import isBefore from 'date-fns/is_before';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import eachDay from 'date-fns/each_day'
import differenceInDays from 'date-fns/difference_in_days';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import isWithinRange from 'date-fns/is_within_range';
import isWeekend from 'date-fns/is_weekend';
import isSaturday from 'date-fns/is_saturday';
import isSunday from 'date-fns/is_sunday';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import styles from '../Day/Day.scss';

let isTouchDevice = is_touch_device();
let preSelectedSelected = false;
let touchDate = null;
let selectedArrayFinal = [];
let lastSelectionBeforeLastDisabled = false;

export const EVENT_TYPE = {
  END: 3,
  HOVER: 2,
  START: 1,
};

const PositionTypes = {
  START: 'START',
  RANGE: 'RANGE',
  END: 'END',
};

// Enhance Day component to display selected state based on an array of selected dates
export const enhanceDay = withPropsOnChange(['selected'], ({date, selected, selectionArray, originalDisabledDates, preselected}) => {
    let isSelected = false;
    let isArraySelected = false;
    let isStart = false;
    let isEnd = false;
    let isRange = false;
    let isArrayStart = false;
    let isArrayEnd = false;
    let isArrayRange = false;
    let isWeekend = false;
    if (selected && selected.start_time && selected.end_time) {
        isSelected = date >= selected.start_time && date <= selected.end_time;
        isStart = date === selected.start_time;
        isEnd = date === selected.end_time;
        isRange = !(isStart && isEnd);
    }
    if (selectionArray && selectionArray.length) {
        isArraySelected = selectionArray.includes(format(date, 'YYYY-MM-DD'));
        isArrayStart = !selectionArray.includes(format(subDays(date, 1), 'YYYY-MM-DD'));
        isArrayEnd = !selectionArray.includes(format(addDays(date, 1), 'YYYY-MM-DD'));
        isArrayRange = !(isArrayStart && isArrayEnd);
    }
    isWeekend = isSaturday(date) || isSunday(date);
  const positionOfDate = determineIfDateAlreadySelected(date, preselected, originalDisabledDates);
  const isPreSelected = !!positionOfDate.value;
  const isPreStart = positionOfDate.value === PositionTypes.START;
  const isPreEnd = positionOfDate.value === PositionTypes.END;
  const isNextSelected = positionOfDate.nextselected;
  const isPrevSelected = positionOfDate.prevselected;
  const isNextPreSelected = positionOfDate.nextpreselected;
  const isPrevPreSelected = positionOfDate.prevpreselected;
  const isNextCountDifferent = positionOfDate.nextcountdifferentiates;
  const isPrevCountDifferent = positionOfDate.prevcountdifferentiates;
  const isPreSelectedValue = preSelectedSelected;
  const isNextPreDifferent = isNextPreSelected;
  const isPrevPreDifferent = isPrevPreSelected;
  const vacationObject = {
      vacation: positionOfDate.vacation,
      vacation_type: positionOfDate.vacation_type,
  }

  const dayClasses =
    isSelected && isRange && classNames(styles.range, {
      [styles.start]: isStart,
      [styles.betweenRange]: !isStart && !isEnd,
      [styles.end]: isEnd,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected,
      [styles.nextdifferentiates]: isNextCountDifferent,
      [styles.prevdifferentiates]: isPrevCountDifferent,
      [styles.nextpreselected]: (isPreSelectedValue && isNextPreDifferent),
      [styles.prevpreselected]: (isPreSelectedValue && isPrevPreDifferent),
      [styles.nextnotpreselected]: (isPreSelectedValue && !isNextPreDifferent),
      [styles.prevnotpreselected]: (isPreSelectedValue && !isPrevPreDifferent)
    })
    ||
    isArraySelected && isArrayRange && classNames(styles.range, {
      [styles.start]: isArrayStart,
      [styles.betweenRange]: !isArrayStart && !isArrayEnd,
      [styles.end]: isArrayEnd,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected,
      [styles.nextdifferentiates]: isNextCountDifferent,
      [styles.prevdifferentiates]: isPrevCountDifferent,
      [styles.nextpreselected]: (isPreSelectedValue && isNextPreDifferent),
      [styles.prevpreselected]: (isPreSelectedValue && isPrevPreDifferent),
      [styles.nextnotpreselected]: (isPreSelectedValue && !isNextPreDifferent),
      [styles.prevnotpreselected]: (isPreSelectedValue && !isPrevPreDifferent)
    })
    ||
    isPreSelected && classNames(styles.range, {
      [styles.prestart]: isPreStart,
      [styles.preend]: isPreEnd,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected,
      [styles.nextdifferentiates]: isNextCountDifferent,
      [styles.prevdifferentiates]: isPrevCountDifferent
    });

  return {
    className: dayClasses,
    isPreSelected,
    isSelected,
    isArraySelected,
    isWeekend,
    vacationObject
  };
});

// Enhancer to handle selecting and displaying multiple dates
export const withRange = compose(
  withDefaultProps,
  withState('scrollDate', 'setScrollDate', getInitialDate),
  withState('displayKey', 'setDisplayKey', getInitialDate),
  withState('updateFromController', 'setUpdateFromController', new Date()),
  withState('selectionStart', 'setSelectionStart', null),
  withState('selectionArray', 'setSelectionArray', []),
  withState('preselectedDates', 'setPreselectedDates', []),
  withState('selectionType', 'setSelectionType', 'none'),
  withState('selectionDone', 'setSelectionDone', false),
  withImmutableProps(({
    DayComponent,
  }) => ({
    DayComponent: enhanceDay(DayComponent),
  })),
  withProps(({displayKey, passThrough, selected, preselected, originalDisabledDates, setDisplayKey, ...props}) => ({
    /* eslint-disable sort-keys */
    passThrough: {
      ...passThrough,
      Day: {
        onClear: (date) => clearSelect(date, {selected, ...props}),
        onClick: (date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) => !isTouchDevice ? handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {selected, preselected, ...props}) : null,
        onTouchStart: (date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) => isTouchDevice ? handleTouchStart(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {selected, preselected, ...props}) : null,
        onTouchEnd: (date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop) => isTouchDevice ? handleTouchEnd(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {selected, preselected, ...props}) : null,
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart
            ? (e) => handleMouseOver(e, {selected, preselected, ...props})
            : null,
          onTouchMove: isTouchDevice && props.selectionStart
            ? (e) => handleTouchMove(e, {selected, preselected, ...props})
            : null,
        },
      },
      selectionArray: props.selectionArray,
      preselectedDates: props.preselectedDates,
      selectionType: props.selectionType,
      selectionDone: props.selectionDone,
      updateFromController: props.updateFromController
    },
    preselected: preselected && preselected.length ? handlePreselected(preselected) : [],
    startDays: preselected && preselected.length ? getStartDays(preselected) : [],
    selected: {
      start_time: selected && format(selected.start_time, 'YYYY-MM-DD'),
      end_time: selected && format(selected.end_time, 'YYYY-MM-DD'),
    }
  })),
);

function getStartDays(preselected) {

    const starts = [];

    preselected = preselected ? preselected : [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        if (!starts.includes(dayStart)) {
            starts.push(dayStart);
        }
    }

    return starts;
}

function handlePreselected(preselected) {

    preselected = preselected ? preselected : [];

    const days = [];
    const starts = [];
    const colors = [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        let dayEnd = format(preselected[i].end_time, 'YYYY-MM-DD');
        let dayChild = preselected[i].child;

        let pushThis = {
            color: preselected[i].color,
            start_time: dayStart,
            end_time: dayEnd,
            child: preselected[i].child,
            original_start: preselected[i].start_time,
            original_end: preselected[i].end_time,
            count: 1,
            nextselected: false,
            prevselected: false,
            nextpreselected: false,
            prevpreselected: false,
            nextcountdifferentiates: false,
            prevcountdifferentiates: false,
            nextpreselecteddifferentiates: false,
            prevpreselecteddifferentiates: false,
            preselected: true
        }

        if (starts.includes(dayStart)) {
            for (var y = 0, dayy = days.length; y < dayy; ++y) {
                if (days[y].start_time == dayStart && days[y].child !== dayChild) {
                    pushThis.count += 1;
                    days[y].count += 1;
                }
            }
        }

        colors.push({date: dayStart, colors: preselected[i].color });
        starts.push(dayStart);
        days.push(pushThis);
    }

    let colorArray = [];

    if (colors && colors.length) {
        colors.forEach(function (a) {
            if (!this[a.date]) {
                this[a.date] = { date: a.date, colors: [] };
                colorArray.push(this[a.date]);
            }
            this[a.date].colors.push(a.colors);
        }, Object.create(null));
    }

    for (var x = 0, day = days.length; x < day; ++x) {
        for (var m = 0, col = colorArray.length; m < col; ++m) {
            if (days[x].start_time === colorArray[m].date) {
                days[x].colors = colorArray[m].colors;
            }
        }
    }

    for (var x = 0, day = days.length; x < day; ++x) {
        let dayStart = format(days[x].start_time, 'YYYY-MM-DD');
        let nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
        let prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            days[x].nextselected = true;
            let nextday = days.filter(date => date.start_time === nextDayStart);

            if (nextday && nextday[0] && nextday[0].count && (nextday[0].count !== days[x].count || !areArraysEqual(nextday[0].colors, days[x].colors))) {
                days[x].nextcountdifferentiates = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected) {
                days[x].nextpreselected = true;
            }

            if (nextday && nextday[0] && nextday[0].preselected && nextday[0].preselected !== days[x].preselected) {
                days[x].nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            days[x].prevselected = true;
            let prevday = days.filter(date => date.end_time === prevDayStart);

            if (prevday && prevday[0] && prevday[0].count && (prevday[0].count !== days[x].count || !areArraysEqual(prevday[0].colors, days[x].colors))) {
                days[x].prevcountdifferentiates = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected) {
                days[x].prevpreselected = true;
            }

            if (prevday && prevday[0] && prevday[0].preselected && prevday[0].preselected !== days[x].preselected) {
                days[x].prevpreselecteddifferentiates = true;
            }
        }
    }

    return days;
}

function areArraysEqual(a, b) {
  if (a === b) {
      return true;
  }
  if (a == null || b == null) {
      return false;
  }
  if (a.length != b.length) {
      return false;
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
        return false;
    }
  }
  return true;
}

function getSortedSelection({start_time, end_time}) {
  return isBefore(start_time, end_time)
    ? {start_time: start_time, end_time: end_time}
    : {start_time: end_time, end_time: start_time};
}

function clearSelect(date, {onSelect, selected, setSelectionType, setSelectionDone, setSelectionStart, setSelectionArray}) {
    console.log('clearSelect');
    selected = null;
    touchDate = null;
    selectedArrayFinal = [];
    setSelectionStart(null);
    setSelectionType('none');
    setSelectionDone(false);
    setSelectionArray([]);
    /*onSelect({
        eventType:EVENT_TYPE.END,
        start_time: null,
        end_time: null,
        before_last: false,
        eventProp: 'click'
    });*/
}

function handleSelect(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {onSelect, selected, preselected, preselectedDates, setPreselectedDates, selectionType, setSelectionType, selectionDone, setSelectionDone, selectionStart, setSelectionStart, setSelectionArray, setUpdateFromController}) {

    if (lastSelectionBeforeLastDisabled) {
        selected = null;
        touchDate = null;
        selectedArrayFinal = [];
        setSelectionStart(null);
        setSelectionType('none');
        setSelectionDone(false);
        setSelectionArray([]);
        /*onSelect({
            eventType:EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            eventProp: 'click'
        });*/
        lastSelectionBeforeLastDisabled = false;
    }

    preselected = preselected && preselected[0] ? preselected : [];

    let includeDate = selectedArrayFinal.indexOf(format(date, 'YYYY-MM-DD'));

    if (includeDate !== -1 && !beforeLastDisabled) {
        if (selectionType === 'preselected') {
            selectedArrayFinal.splice(includeDate, 1);
            setUpdateFromController(new Date());
            onSelect({
                eventType:EVENT_TYPE.END,
                ...getSortedSelection({
                  start_time: null,
                  end_time: null,
                }),
                before_last: false,
                selected_array: selectedArrayFinal,
                selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
                date_offset: fromTop,
                eventProp: 'click'
            });
            return;
        } else {
            selectedArrayFinal.splice(includeDate, 1);
            setUpdateFromController(new Date());
            onSelect({
                eventType:EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selected_array: selectedArrayFinal,
                selections: null,
                date_offset: fromTop,
                eventProp: 'click'
            });
            return;
        }
    }

    if (!isPreSelected) {
        if (preselected && preselected[0]) {
            let returnable = preselected.map((dateObj) => ({ date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' }));
            setPreselectedDates(returnable);
        }
        setSelectionType('not_preselected');
    } else {
        setPreselectedDates([]);
        setSelectionType('preselected');
    }

    if (beforeLastDisabled) {


        selected = null;
        touchDate = null;
        selectedArrayFinal = [];
        setSelectionStart(null);
        setSelectionType('none');
        setSelectionDone(false);
        setSelectionArray([]);
        /*onSelect({
            eventType:EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            eventProp: 'click'
        });*/


        /* TODO: This doesn't work */
        selectedArrayFinal = selectedArrayFinal.concat(format(date, 'YYYY-MM-DD'));
        setSelectionArray(selectedArrayFinal);
        selected = null;
        touchDate = null;
        setSelectionStart(null);
        setSelectionDone(true);
        setSelectionType('none');
        onSelect({
            eventType:EVENT_TYPE.END,
            start_time: null,
            end_time: null,
            before_last: false,
            selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
            selected_array: selectedArrayFinal,
            date_offset: fromTop,
            eventProp: 'click'
        });

        lastSelectionBeforeLastDisabled = true;

        setUpdateFromController(new Date());
    } else if (selectionStart) {

        if (selectionType === 'preselected') {
            let daysArray = [];
            let daysBetween = isBefore(date, selectionStart) ? eachDay(date, selectionStart, 1) : eachDay(selectionStart, date, 1);
            for (var i = 0, length = daysBetween.length; i < length; ++i) {
                let shouldRemove = isSaturday(daysBetween[i]) || isSunday(daysBetween[i]);
                daysBetween[i] = format(daysBetween[i], 'YYYY-MM-DD');
                let alreadyIncluded = selectedArrayFinal.includes(daysBetween[i]);
                if (!shouldRemove && !alreadyIncluded) {
                    for (var b = 0, length = preselected.length; b < length; ++b) {
                        if (format(preselected[b].start_time, 'YYYY-MM-DD') === daysBetween[i]) {
                            daysArray.push(daysBetween[i]);
                            break;
                        }
                    }
                }
            }

            selectedArrayFinal = selectedArrayFinal.concat(daysArray);

            selectedArrayFinal.sort((a, b) => {
                return a.replace(/-/g,"") - b.replace(/-/g,"");
            });

            setSelectionArray(selectedArrayFinal);

            selected = null;
            touchDate = null;
            setSelectionStart(null);
            setSelectionDone(true);
            onSelect({
                eventType:EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selections: getPreselectedWithinRange(selectedArrayFinal, preselected),
                selected_array: selectedArrayFinal,
                date_offset: fromTop,
                eventProp: 'click'
            });

        } else {

            let daysArray = [];
            let daysBetween = isBefore(date, selectionStart) ? eachDay(date, selectionStart, 1) : eachDay(selectionStart, date, 1);
            for (var i = 0, length = daysBetween.length; i < length; ++i) {
                let shouldRemove = isSaturday(daysBetween[i]) || isSunday(daysBetween[i]);
                let formattedDate = format(daysBetween[i], 'YYYY-MM-DD');
                let alreadyIncluded = selectedArrayFinal.includes(formattedDate);
                if (!shouldRemove && !alreadyIncluded) {
                    daysArray.push(formattedDate);
                }
            }

            for (var y = 0, length = daysArray.length; y < length; ++y) {
                for (var j = 0, length = preselectedDates.length; j < length; ++j) {
                    if (daysArray[y] === preselectedDates[j].date) {
                        daysArray.splice(y, 1);
                        --y;
                    }
                }
            }

            for (var y = 0, length = daysArray.length; y < length; ++y) {
                for (var j = 0, length = originalDisabledDates.length; j < length; ++j) {
                    if (daysArray[y] === originalDisabledDates[j].date && originalDisabledDates[j].type === 'holiday') {
                        daysArray.splice(y, 1);
                        --y;
                    }
                }
            }

            selectedArrayFinal = selectedArrayFinal.concat(daysArray);

            selectedArrayFinal.sort((a, b) => {
                return a.replace(/-/g,"") - b.replace(/-/g,"");
            });

            setSelectionArray(selectedArrayFinal);

            selected = null;
            touchDate = null;
            setSelectionStart(null);
            setSelectionDone(true);
            onSelect({
                eventType:EVENT_TYPE.END,
                start_time: null,
                end_time: null,
                before_last: false,
                selections: null,
                selected_array: selectedArrayFinal,
                date_offset: fromTop,
                eventProp: 'click'
            });
        }

    } else {
        onSelect({
            eventType:EVENT_TYPE.START,
            start_time: date,
            end_time: date,
            before_last: beforeLastDisabled,
            eventProp: 'click'
        });
        setSelectionStart(date);
        if (isPreSelected) {
            preSelectedSelected = true;
        } else {
            preSelectedSelected = false;
        }
        setSelectionDone(false);
    }
}

function handleMouseOver(e, {onSelect, selectionStart}) {
  const dateStr = e.target.getAttribute('data-date');
  const isDisabled = e.target.getAttribute('data-disabled');
  const date = dateStr && parse(dateStr);

  if (!date) { return; }

  if (isDisabled != 'true') {
      onSelect({
        eventType: EVENT_TYPE.HOVER,
        ...getSortedSelection({
          start_time: selectionStart,
          end_time: date
        }),
        eventProp: 'hover'
      });
  }
}

function handleTouchStart(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {onSelect, selected, preselected, preselectedDates, setPreselectedDates, selectionType, setSelectionType, selectionDone, setSelectionDone, selectionStart, setSelectionStart}) {

    if (!date) { return; }

    touchDate = date;

    preselected = preselected && preselected[0] ? preselected : [];

    if (!isPreSelected) {
        if (preselected && preselected[0]) {
            let returnable = preselected.map((dateObj) => ({ date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' }));
            setPreselectedDates(returnable);
        }
        setSelectionType('not_preselected');
    } else {
        setPreselectedDates([]);
        setSelectionType('preselected');
    }

    if (beforeLastDisabled) {
        onSelect({
            eventType:EVENT_TYPE.END,
            ...getSortedSelection({
              start_time: date,
              end_time: date,
            }),
            before_last: true,
            selections: getPreselectedWithinDate(date, preselected),
            date_offset: fromTop,
            eventProp: 'touchend'
        });
        setSelectionStart(null);
        setSelectionDone(true);
    } else {
        onSelect({
          eventType: EVENT_TYPE.START,
          ...getSortedSelection({
            start_time: date,
            end_time: date
          }),
          before_last: beforeLastDisabled,
          eventProp: 'touchstart'
        });
        setSelectionStart(date);

        if (isPreSelected) {
            preSelectedSelected = true;
        } else {
            preSelectedSelected = false;
        }
        setSelectionDone(false);
    }
}

function handleTouchMove(e, {onSelect, selectionStart}) {
    let target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);

    if (!target) { return; }

    const targetDate = parse(target.getAttribute('data-date'));
    const isDisabled = target.getAttribute('data-disabled');


    let lastDate = format(touchDate, 'YYYY-MM-DD');
    let thisDate = format(targetDate, 'YYYY-MM-DD');

    if (lastDate !== thisDate && isDisabled != 'true') {

        touchDate = targetDate;

        onSelect({
          eventType: EVENT_TYPE.HOVER,
          ...getSortedSelection({
            start_time: selectionStart,
            end_time: touchDate
          }),
          eventProp: 'touchmove'
        });

    }

}

function handleTouchEnd(date, beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop, {onSelect, selected, preselected, preselectedDates, setPreselectedDates, selectionType, setSelectionType, selectionDone, setSelectionDone, selectionStart, setSelectionStart}) {

    if (!beforeLastDisabled) {
        onSelect({
          eventType: EVENT_TYPE.END,
          ...getSortedSelection({
            start_time: selectionStart,
            end_time: touchDate,
          }),
          before_last: beforeLastDisabled,
          selections: getPreselectedWithinRange(selectionStart, touchDate, preselected, selected, originalDisabledDates),
          date_offset: fromTop,
          eventProp: 'touchend'
        });
        setSelectionStart(null);
        setSelectionDone(true);
    }

}

function getPreselectedWithinDate(date, preselected) {
    let returnableDates = [];
    let thisDate = format(date, 'YYYY-MM-DD');
    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        if (thisDate === dayStart) {
            returnableDates.push(preselected[i]);
        }
    }

    return {days_count: 1, data: returnableDates};
}

function getPreselectedWithinRange(selectedArray, preselected) {
    let returnableDates = [];
    let days;

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        if (selectedArray.includes(format(preselected[i].start_time, 'YYYY-MM-DD'))) {
            returnableDates.push(preselected[i]);
        }
    }

    return {days_count: selectedArray.length, data: returnableDates};
}

/*function getPreselectedWithinRange(start_date, end_date, preselected, selected, originalDisabledDates) {
    let returnableDates;
    let startDate = format(start_date, 'YYYY-MM-DD');
    let endDate = format(end_date, 'YYYY-MM-DD');
    let days = 0;
    if (preSelectedSelected && preselected) {
        returnableDates = [];
        for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
            let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
            let withinRange = isBefore(startDate, endDate) ? isWithinRange(dayStart, startDate, endDate) : isWithinRange(dayStart, endDate, startDate);
            if (withinRange) {
                returnableDates.push(preselected[i]);
            }
        }

        let test = [];

        for (var j = 0, returnables = returnableDates.length; j < returnables; ++j) {
            let returnable_start = format(returnableDates[j].start_time, "YYYY-MM-DD");
            if (!test.includes(returnable_start)) {
                test.push(returnable_start);
            }
        }

        days = test.length;
    } else if (selected) {
        returnableDates = [];

        let start = isBefore(start_date, end_date) ? start_date : end_date;
        let end = isBefore(start_date, end_date) ? end_date : start_date;

        while (start <= end) {
            let thesame = false;
            for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
                let preselected_start = format(preselected[i].start_time, 'YYYY-MM-DD');
                if (preselected_start === format(start, 'YYYY-MM-DD')) {
                    thesame = true;
                    break;
                }
            }
            if (!thesame) {
                for (var i = 0, disabled = originalDisabledDates.length; i < disabled; ++i) {
                    let disabled_start = format(originalDisabledDates[i].date, 'YYYY-MM-DD');
                    if (disabled_start === format(start, 'YYYY-MM-DD') && originalDisabledDates[i].type === 'holiday') {
                        thesame = true;
                        break;
                    }
                }
            }
            if (!thesame && !isWeekend(start)) {
                returnableDates.push({start_time: format(start, 'YYYY-MM-DD'), end_time: format(start, 'YYYY-MM-DD')});
                days += 1;
            }
            start = addDays(start, 1);
        }
    }

    return {days_count: days, data: returnableDates};
}*/

function getInitialDate({selected, initialSelectedDate, scrollOffset}) {
    if (scrollOffset !== null) {
        return scrollOffset;
    } else {
        return initialSelectedDate || selected && selected.start_time || new Date();
    }
}

function determineIfDateAlreadySelected(date, selected, originalDisabledDates) {
  let returnVal ={
    index: -1,
    value: '',
    count: 1,
    nextselected: false,
    prevselected: false,
    nextpreselected: false,
    nextcountdifferentiates: false,
    prevcountdifferentiates: false,
    nextpreselecteddifferentiates: false,
    prevpreselecteddifferentiates: false,
    preselected: false,
    vacation: false,
    vacation_type: ''
  };

  let selected_date = date;
  let selected_array = selected;

  for (var i = 0, len = selected_array.length; i < len; ++i) {
    if (selected_date === selected_array[i].start_time) {
            returnVal.value = PositionTypes.START;
            returnVal.index = selected_array[i];
            returnVal.count = selected_array[i].count;
            returnVal.nextselected = selected_array[i].nextselected;
            returnVal.prevselected = selected_array[i].prevselected;
            returnVal.nextpreselected = selected_array[i].nextpreselected;
            returnVal.prevpreselected = selected_array[i].prevpreselected;
            returnVal.nextcountdifferentiates = selected_array[i].nextcountdifferentiates;
            returnVal.prevcountdifferentiates = selected_array[i].prevcountdifferentiates;
            returnVal.nextpreselecteddifferentiates = selected_array[i].nextpreselecteddifferentiates;
            returnVal.prevpreselecteddifferentiates = selected_array[i].prevpreselecteddifferentiates;
    }
  }

  for (var j = 0, len = originalDisabledDates.length; j < len; ++j) {
      if (date === originalDisabledDates[j].date) {
          returnVal.vacation = true;
          returnVal.vacation_type = originalDisabledDates[j].type;
      }
  }

  return returnVal;
}

function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}
