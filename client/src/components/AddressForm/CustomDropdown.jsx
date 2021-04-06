import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-dropdown';

import classes from './AddressForm.module.scss';
import 'react-dropdown/style.css';

const customDomainValue = 'addCustomDomain';

const CustomDropdown = props => {
  const { toggle, input, options } = props;
  const { onChange } = input;

  const styledOptions = options
    .map((item) => ({
      value: item,
      label: item,
      className: [classes.optionItem],
    }))
    .sort((a, b) => a.value.localeCompare(b.value));

  styledOptions.push({
    value: customDomainValue,
    label: 'Add Custom Domain',
    className: [classes.optionButton],
  });

  const onDropdownChange = (value) => {
    const { value: itemValue } = value || {};
    if (itemValue === customDomainValue) {
      onChange('');
      return toggle(true);
    }

    onChange(itemValue);
  };

  return (
    <Dropdown
      options={styledOptions}
      onChange={onDropdownChange}
      placeholder='Select Domain'
      className={classes.dropdown}
      controlClassName={classes.control}
      placeholderClassName={classes.placeholder}
      menuClassName={classes.menu}
      arrowClosed={
        <FontAwesomeIcon icon='chevron-down' className={classes.icon} />
      }
      arrowOpen={<FontAwesomeIcon icon='chevron-up' className={classes.icon} />}
    />
  );
};

export default CustomDropdown;
