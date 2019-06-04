import React from 'react';
import BoxV2Demo from '../boxV2/demo';
import ButtonDemo from './buttons/demo';
import CalendarDemo from './calendar/demo';
import CheckBoxDemo from './checkBox/demo';
import DropdownDemo from './dropdownV2/demo';
import IconDemo from './icon/demo';
import InputDemo from './inputsV2/demo';
import IllustrationDemo from './illustration/demo';
import OnboardingDemo from './onboarding/demo';
import TooltipDemo from './tooltip/demo';

const ToolboxDemo = () => (
  <React.Fragment>
    <BoxV2Demo/> { /* TODO move BoxV2 into toolbox folder */ }
    <ButtonDemo />
    <CalendarDemo />
    <CheckBoxDemo/>
    <DropdownDemo />
    <IconDemo/>
    <InputDemo />
    <IllustrationDemo/>
    <OnboardingDemo />
    <TooltipDemo/>
  </React.Fragment>
);

export default ToolboxDemo;
