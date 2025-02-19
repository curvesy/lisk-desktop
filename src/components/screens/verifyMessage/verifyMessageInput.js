import PropTypes from 'prop-types';
import React from 'react';

import { parseSearchParams } from '@utils/searchParams';
import { Input } from '@toolbox/inputs';
import { PrimaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import BoxInfoText from '@toolbox/box/infoText';
import Icon from '@toolbox/icon';
import Tooltip from '@toolbox/tooltip/tooltip';
import { regex } from '@constants';
import styles from './verifyMessage.css';

export default class VerifyMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { t } = props;
    const valuesFromNextStep = props.prevState.inputs || {};

    this.inputs = [
      {
        name: 'message',
        placeholder: t('Insert message'),
        label: t('Message'),
      }, {
        name: 'publicKey',
        placeholder: t('Insert public key'),
        label: t('Public key'),
      }, {
        name: 'signature',
        placeholder: t('Insert signature'),
        label: t('Signature'),
      },
    ];

    this.textarea = {
      name: 'signedMessage',
      placeholder: t('Insert entire signed message'),
      label: t('Signed message'),
      type: 'textarea',
    };

    this.state = {
      inputs: [...this.inputs, this.textarea].reduce((inputs, { name }) => ({
        ...inputs,
        [name]: {
          value: valuesFromNextStep[name] || parseSearchParams(props.history.location.search)[name] || '',
          feedback: '',
        },
      }), {}),
      isInputsView: false,
    };

    this.goNext = this.goNext.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeViewToInputs = this.changeView.bind(this, true);
    this.changeViewToTextarea = this.changeView.bind(this, false);
  }

  getInputError({ target: { name, value } }) {
    const { t } = this.props;
    const validators = {
      publicKey: () => {
        if (regex.publicKey.test(value)) {
          return '';
        }
        return t('This is not a valid public key. Please enter the correct public key.');
      },
      message: () => (
        value !== value.trim()
          ? t('The message can\'t contain whitespace at the beginning or end.')
          : ''
      ),
    };
    const input = [...this.inputs, this.textarea].find(({ name: n }) => name === n);
    const inputLabel = input && input.label.toLowerCase();
    const emptyError = value === '' ? t('The {{inputLabel}} can\'t be empty', { inputLabel }) : '';
    return validators[name] ? validators[name]() : emptyError;
  }

  handleChange({ target }) {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [target.name]: {
          value: target.value,
          feedback: this.getInputError({ target }),
        },
      },
    });
  }

  getInputs() {
    const { inputs, isInputsView } = this.state;
    if (isInputsView) {
      return {
        message: inputs.message.value,
        publicKey: inputs.publicKey.value,
        signature: inputs.signature.value,
      };
    }
    const separators = ['MESSAGE', 'PUBLIC KEY', 'SIGNATURE', 'END LISK SIGNED MESSAGE'].join('|');
    const parsedMessage = inputs.signedMessage.value.split(new RegExp(`\n?-----(${separators})-----\n?`));
    return {
      message: parsedMessage[2],
      publicKey: parsedMessage[4],
      signature: parsedMessage[6],
    };
  }

  goNext() {
    this.props.nextStep({ inputs: this.getInputs() });
  }

  changeView(isInputsView) {
    this.setState({ isInputsView });
  }

  get activeViewInputs() {
    const { isInputsView } = this.state;
    return isInputsView ? this.inputs : [this.textarea];
  }

  get canSubmit() {
    const { inputs } = this.state;
    return this.activeViewInputs.every(({ name }) => (
      inputs[name].value && !inputs[name].feedback
    ));
  }

  render() {
    const { t } = this.props;
    const { inputs, isInputsView } = this.state;

    return (
      <Box main>
        <BoxHeader>
          <h1>{t('Verify message')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <BoxInfoText>
            {t('Verify the integrity of a signed message')}
            <Tooltip position="bottom">
              <p>{t('To create a signed message use the "Sign message" tool in the sidebar.')}</p>
            </Tooltip>
          </BoxInfoText>
          <div className={styles.inputViewSwitcher}>
            {t('Input view')}
            <Icon
              className="textarea-view-icon"
              name={`verifyMessageTextareaView${isInputsView ? '' : 'Active'}`}
              onClick={this.changeViewToTextarea}
            />

            <Icon
              className="inputs-view-icon"
              name={`verifyMessageInputsView${!isInputsView ? '' : 'Active'}`}
              onClick={this.changeViewToInputs}
            />
          </div>
          {this.activeViewInputs.map(({
            name, placeholder, label, type,
          }) => (
            <Input
              key={name}
              name={name}
              className={`${[name, styles[name]].filter(Boolean).join(' ')} verify-message-input ${name}`}
              placeholder={placeholder}
              label={label}
              value={inputs[name].value}
              error={!!inputs[name].feedback}
              feedback={inputs[name].feedback}
              onChange={this.handleChange}
              type={type}
            />
          ))}
        </BoxContent>
        <BoxFooter direction="horizontal">
          <PrimaryButton
            onClick={this.goNext}
            disabled={!this.canSubmit}
            className="continue"
          >
            {t('Continue')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    );
  }
}

VerifyMessageInput.propTypes = {
  history: PropTypes.object.isRequired,
  nextStep: PropTypes.func,
  t: PropTypes.func.isRequired,
  prevState: PropTypes.object,
};

VerifyMessageInput.defaultProps = {
  prevState: {},
};
