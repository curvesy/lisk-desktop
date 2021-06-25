import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { routes } from '@constants';
import { transactionBroadcasted } from '@actions';
import { PrimaryButton } from '@toolbox/buttons';
import TransactionResult from '@shared/transactionResult';
import styles from './status.css';
import displayTemplate from './displayTemplate';

const Status = ({
  t, history, transactionInfo, error,
}) => {
  const transactions = useSelector(state => state.transactions);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(!error ? 'pending' : 'fail');
  const success = status !== 'fail';

  const template = displayTemplate(
    t,
    success,
    () => {
      history.push(routes.wallet.path);
    },
  );

  useEffect(() => {
    if (transactionInfo) {
      const confirmed = transactions.confirmed
        .filter(tx => tx.id === transactionInfo.id);

      if (confirmed.length) setStatus('ok');
      if (transactions.txBroadcastError) setStatus('fail');
    }
  }, [transactions]);

  useEffect(() => {
    if (transactionInfo) dispatch(transactionBroadcasted(transactionInfo));
  }, [transactionInfo]);

  return (
    <div className={`${styles.wrapper} transaction-status`}>
      <TransactionResult
        t={t}
        illustration={success ? 'transactionSuccess' : 'transactionError'}
        success={success}
        title={template.title}
        message={template.message}
        className={styles.content}
        primaryButon={template.button}
        error={JSON.stringify(error)}
      >
        {template.button && (
          <PrimaryButton
            onClick={template.button.onClick}
            className={`${template.button.className} dialog-close-button`}
          >
            {template.button.title}
          </PrimaryButton>
        )}
      </TransactionResult>
    </div>
  );
};

export default compose(
  withRouter,
  withTranslation(),
)(Status);
