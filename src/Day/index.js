import React, {PureComponent} from 'react';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import styles from './Day.scss';

let isPreSelection = false;

export default class Day extends PureComponent {

  handleClick = () => {
    let {date, beforeLastDisabled, disabledDays, isDisabled, isPreSelected, onClick, originalDisabledDates} = this.props;

    console.log('handleClick()');
    console.log(disabledDays);

    isPreSelection = isPreSelected;

    if (beforeLastDisabled && !isPreSelected && typeof onClick === 'function') {
      //onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates);
    } else if (!isDisabled && typeof onClick === 'function') {
      onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates, disabledDays);
    }
  };

  renderSelection(selectionColor) {
    const {
      day,
      date,
      isToday,
      isDisabled,
      locale: {todayLabel},
      monthShort,
      theme: {textColor},
      selectionStyle,
    } = this.props;

    return (
      <div
        className={styles.selection}
        data-date={date}
        data-disabled={isDisabled ? isDisabled : false}
      >
      </div>
    );
  }

  render() {
    const {
      className,
      currentYear,
      date,
      day,
      beforeLastDisabled,
      originalDisabledDates,
      disabledDays,
      handlers,
      selected,
      isDisabled,
      isHighlighted,
      isToday,
      isSelected,
      isPreSelected,
      prevDisabled,
      nextDisabled,
      monthShort,
    } = this.props;

    return (
      <li
        className={classNames(styles.root, {
          [styles.today]: isToday,
          [styles.highlighted]: isHighlighted,
          [styles.selected]: isSelected,
          [styles.preselected]: isPreSelected,
          [styles.prevdisabled]: prevDisabled,
          [styles.nextdisabled]: nextDisabled,
          [styles.disabled]: isDisabled || (beforeLastDisabled && !isPreSelected),
          [styles.enabled]: !isDisabled,
          [styles.beforelast]: beforeLastDisabled
        }, className)}
        onClick={this.handleClick}
        data-date={date}
        data-disabled={isDisabled ? isDisabled : false}
        {...handlers}
      >
        {day}
        {isSelected && this.renderSelection()}
      </li>
    );
  }
}
