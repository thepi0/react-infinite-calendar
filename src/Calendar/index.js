import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {debounce, emptyFn, range, ScrollSpeed} from '../utils';
import {defaultProps} from 'recompose';
import defaultDisplayOptions from '../utils/defaultDisplayOptions';
import defaultLocale from '../utils/defaultLocale';
import defaultTheme from '../utils/defaultTheme';
import Today, {DIRECTION_UP, DIRECTION_DOWN} from '../Today';
import Header from '../Header';
import MonthList from '../MonthList';
import Weekdays from '../Weekdays';
import Years from '../Years';
import Day from '../Day';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import startOfDay from 'date-fns/start_of_day';

const styles = {
  container: require('./Container.scss'),
  day: require('../Day/Day.scss'),
};

let lastUpdateDate = new Date();

export const withDefaultProps = defaultProps({
  autoFocus: true,
  DayComponent: Day,
  display: 'days',
  displayOptions: {},
  HeaderComponent: Header,
  height: 500,
  keyboardSupport: true,
  max: new Date(2050, 11, 31),
  maxDate: new Date(2050, 11, 31),
  min: new Date(1980, 0, 1),
  preselected: {},
  originalDisabledDates: {},
  lastSelectableDate: new Date(),
  lastUpdate: new Date(),
  minDate: new Date(1980, 0, 1),
  onHighlightedDateChange: emptyFn,
  onScroll: emptyFn,
  onScrollEnd: emptyFn,
  onSelect: emptyFn,
  passThrough: {},
  rowHeight: 56,
  tabIndex: 1,
  width: 400,
  YearsComponent: Years,
});

export default class Calendar extends Component {
  constructor(props) {
    super(...arguments);

    this.updateYears(props);
    this.updatePreSelected(props);
    this.updateLastUpdated(props);
    this.updateOriginalDisabledDates(props);
    this.updatelastSelectableDate(props);

    this.state = {
      display: props.display
    };
  }
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    DayComponent: PropTypes.func,
    lastSelectableDate: PropTypes.instanceOf(Date),
    disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    originalDisabledDates: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    disabledDays: PropTypes.arrayOf(PropTypes.number),
    display: PropTypes.oneOf(['years', 'days']),
    displayOptions: PropTypes.shape({
      hideYearsOnSelect: PropTypes.bool,
      layout: PropTypes.oneOf(['portrait', 'landscape']),
      overscanMonthCount: PropTypes.number,
  		shouldHeaderAnimate: PropTypes.bool,
      showHeader: PropTypes.bool,
      showMonthsForYears: PropTypes.bool,
  		showOverlay: PropTypes.bool,
  		showTodayHelper: PropTypes.bool,
  		showWeekdays: PropTypes.bool,
      todayHelperRowOffset: PropTypes.number,
    }),
    height: PropTypes.number,
    keyboardSupport: PropTypes.bool,
    locale: PropTypes.shape({
      blank: PropTypes.string,
      headerFormat: PropTypes.string,
      todayLabel: PropTypes.shape({
        long: PropTypes.string,
        short: PropTypes.string,
      }),
      weekdays: PropTypes.arrayOf(PropTypes.string),
      weekStartsOn: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    }),
    max: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    min: PropTypes.instanceOf(Date),
    preselected: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    minDate: PropTypes.instanceOf(Date),
    lastUpdate: PropTypes.instanceOf(Date),
    onScroll: PropTypes.func,
    onScrollEnd: PropTypes.func,
    onSelect: PropTypes.func,
    rowHeight: PropTypes.number,
    tabIndex: PropTypes.number,
    theme: PropTypes.shape({
      floatingNav: PropTypes.shape({
        background: PropTypes.string,
        chevron: PropTypes.string,
        color: PropTypes.string,
      }),
      headerColor: PropTypes.string,
      selectionColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      textColor: PropTypes.shape({
        active: PropTypes.string,
        default: PropTypes.string,
      }),
      todayColor: PropTypes.string,
      weekdayColor: PropTypes.string,
      weekdaysHeight: PropTypes.string,
    }),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    YearsComponent: PropTypes.func,
  };
  componentDidMount() {
    let {autoFocus} = this.props;

    if (autoFocus) {
      this.node.focus();
    }
  }
  componentWillUpdate(nextProps, nextState) {
      console.log('componentWillUpdate()');
    //let {min, minDate, max, maxDate, preselected} = this.props;

    /*if (nextProps.min !== min || nextProps.minDate !== minDate || nextProps.max !== max || nextProps.maxDate !== maxDate) {
      this.updateYears(nextProps);
    }*/

    //let {lastUpdate} = this.props;

    /*if (nextProps.display !== this.props.display) {
      this.setState({display: nextProps.display});
    }

    if (nextProps.preselected !== this.props.preselected) {
        this.updatePreSelected(nextProps);
    }

    if (nextProps.originalDisabledDates !== this.props.originalDisabledDates) {
        this.updateOriginalDisabledDates(nextProps);
    }

    if (nextProps.lastSelectableDate !== this.props.lastSelectableDate) {
        this.updatelastSelectableDate(nextProps);
    }*/

    //console.log('ComponentDidUpdate');
    //console.log(this.props.lastUpdate);
    //console.log(nextProps.lastUpdate);

    if (nextProps.display !== this.props.display) {
      this.setState({display: nextProps.display});
    }

    if (nextProps.lastUpdate !== this.state.lastUpdate) {
        console.log('lastUpdate is not the same as before - update everything');
        this.updateLastUpdated(nextProps);
        this.updatePreSelected(nextProps);
        this.updateOriginalDisabledDates(nextProps);
        this.updatelastSelectableDate(nextProps);
    }


  }
  updateLastUpdated(props = this.props) {
    const lastUpdate = props.lastUpdate;
    this.lastUpdate = lastUpdate;
  }
  updatePreSelected(props = this.props) {
    const preselected = props.preselected;
    this.preselected = preselected;
  }
  updateOriginalDisabledDates(props = this.props) {
    const originalDisabledDates = props.originalDisabledDates;
    this.originalDisabledDates = originalDisabledDates;
  }
  updatelastSelectableDate(props = this.props) {
    const lastSelectableDate = props.lastSelectableDate;
    this.lastSelectableDate = lastSelectableDate;
  }
  updateYears(props = this.props) {
    this._min = parse(props.min);
    this._max = parse(props.max);
    this._minDate = parse(props.minDate);
    this._maxDate = parse(props.maxDate);

    const min = this._min.getFullYear();
    const minMonth = this._min.getMonth();
    const max = this._max.getFullYear();
    const maxMonth = this._max.getMonth();

    const months = [];
    let year, month;
    for (year = min; year <= max; year++) {
      for (month = 0; month < 12; month++) {
        if (
          year === min && month < minMonth ||
          year === max && month > maxMonth
        ) {
          continue;
        }

        months.push({month, year});
      }
    }

    this.months = months;
  }
  getDisabledDates(disabledDates) {
    return disabledDates && disabledDates.map((date) => format(parse(date.date), 'YYYY-MM-DD'));
  }
  _displayOptions = {};
  getDisplayOptions(displayOptions = this.props.displayOptions) {
    return Object.assign(this._displayOptions, defaultDisplayOptions, displayOptions);
  }
  _locale = {};
  getLocale() {
    return Object.assign(this._locale, defaultLocale, this.props.locale);
  }
  _theme = {};
  getTheme() {
    return Object.assign(this._theme, defaultTheme, this.props.theme);
  }
  getCurrentOffset = () => {
    return this.scrollTop;
  }
  getDateOffset = (date) => {
    return this._MonthList && this._MonthList.getDateOffset(date);
  };
  scrollTo = (offset) => {
    return this._MonthList && this._MonthList.scrollTo(offset);
  }
  scrollToDate = (date = new Date(), offset, shouldAnimate) => {
    const {display} = this.props;

    return this._MonthList &&
      this._MonthList.scrollToDate(
        date,
        offset,
        shouldAnimate && display === 'days',
        () => this.setState({isScrolling: false}),
      );
  };
  getScrollSpeed = new ScrollSpeed().getScrollSpeed;
  handleScroll = (scrollTop, e) => {
    const {onScroll, rowHeight} = this.props;
    const {isScrolling} = this.state;
    const {showTodayHelper, showOverlay} = this.getDisplayOptions();
    const scrollSpeed = this.scrollSpeed = Math.abs(this.getScrollSpeed(scrollTop));
    this.scrollTop = scrollTop;

    if (showTodayHelper) {
      this.updateTodayHelperPosition(scrollSpeed);
    }

    onScroll(scrollTop, e);
    this.handleScrollEnd();
  };
  handleScrollEnd = debounce(() => {
    const {onScrollEnd} = this.props;
    const {isScrolling} = this.state;
    const {showTodayHelper} = this.getDisplayOptions();

    if (isScrolling) {
      this.setState({isScrolling: false});
    }

    if (showTodayHelper) {
      this.updateTodayHelperPosition(0);
    }

    onScrollEnd(this.scrollTop);
  }, 150);
  updateTodayHelperPosition = (scrollSpeed) => {
    const today = this.today;
    const scrollTop = this.scrollTop;
    const {showToday} = this.state;
    const {height, rowHeight} = this.props;
    const {todayHelperRowOffset} = this.getDisplayOptions();
    let newState;

    if (!this._todayOffset) {
      this._todayOffset = this.getDateOffset(today);
    }

    // Today is above the fold
    if (scrollTop >= this._todayOffset + (height - rowHeight) / 2 + rowHeight * todayHelperRowOffset) {
      if (showToday !== DIRECTION_UP) newState = DIRECTION_UP;
    }
    // Today is below the fold
    else if (scrollTop <= this._todayOffset - height / 2 - rowHeight * (todayHelperRowOffset + 1)) {
      if (showToday !== DIRECTION_DOWN) newState = DIRECTION_DOWN;
    } else if (showToday && scrollSpeed <= 1) {
      newState = false;
    }

    if (scrollTop === 0) {
      newState = false;
    }

    if (newState != null) {
      this.setState({showToday: newState});
    }
  };
  setDisplay = (display) => {
    this.setState({display});
  }

  render() {
    let {
			className,
      passThrough,
      DayComponent,
			disabledDays,
            originalDisabledDates,
      displayDate,
			height,
      HeaderComponent,
      rowHeight,
      scrollDate,
      selected,
      preselected,
			tabIndex,
			width,
      YearsComponent,
		} = this.props;
    const {
      hideYearsOnSelect,
      layout,
      overscanMonthCount,
      shouldHeaderAnimate,
      showHeader,
      showMonthsForYears,
      showOverlay,
      showTodayHelper,
      showWeekdays,
    } = this.getDisplayOptions();
    const {display, isScrolling, showToday} = this.state;
    const disabledDates = this.getDisabledDates(this.props.disabledDates);
    const locale = this.getLocale();
    const theme = this.getTheme();
    const today = this.today = startOfDay(new Date());

    return (
      <div
        tabIndex={tabIndex}
        className={classNames(className, styles.container.root, {
          [styles.container.landscape]: layout === 'landscape',
        })}
        style={{color: theme.textColor.default, width}}
        aria-label="Calendar"
        ref={node => {
          this.node = node;
        }}
        {...passThrough.rootNode}
      >
        {showHeader &&
          <HeaderComponent
            selected={selected}
            shouldAnimate={Boolean(shouldHeaderAnimate && display !== 'years')}
            layout={layout}
            theme={theme}
            locale={locale}
            scrollToDate={this.scrollToDate}
            setDisplay={this.setDisplay}
            dateFormat={locale.headerFormat}
            display={display}
            displayDate={displayDate}
            {...passThrough.Header}
          />
        }
        <div className={styles.container.wrapper}>
          {showWeekdays &&
            <Weekdays weekdays={locale.weekdays} weekStartsOn={locale.weekStartsOn} theme={theme} />
          }
          <div className={styles.container.listWrapper}>
            {showTodayHelper &&
              <Today
                scrollToDate={this.scrollToDate}
                show={showToday}
                today={today}
                theme={theme}
                todayLabel={locale.todayLabel.long}
              />
            }
            {  this.months && this.months.length &&
            <MonthList
              ref={instance => {
                this._MonthList = instance;
              }}
              DayComponent={DayComponent}
              disabledDates={disabledDates}
              lastUpdate={this.lastUpdate}
              originalDisabledDates={this.originalDisabledDates}
              lastSelectableDate={this.lastSelectableDate}
              disabledDays={disabledDays}
              height={height}
              isScrolling={isScrolling}
              locale={locale}
              maxDate={this._maxDate}
              min={this._min}
              minDate={this._minDate}
              months={this.months}
              onScroll={this.handleScroll}
              overscanMonthCount={overscanMonthCount}
              passThrough={passThrough}
              theme={theme}
              today={today}
              rowHeight={rowHeight}
              selected={selected}
              preselected={this.preselected}
              scrollDate={scrollDate}
              showOverlay={showOverlay}
              width={width}
            />
            }
          </div>
        </div>
      </div>
    );
  }
};
