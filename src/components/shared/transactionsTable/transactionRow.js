import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import { tokenMap } from '../../../constants/tokens';
import transactionTypes from '../../../constants/transactionTypes';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import Icon from '../../toolbox/icon';
import LiskAmount from '../liskAmount';
import Tooltip from '../../toolbox/tooltip/tooltip';
import DialogLink from '../../toolbox/dialog/link';
import styles from './transactionsTable.css';

const roundSize = 101;

const TransactionRow = ({ data, className, t }) => (
  <DialogLink
    className={`${grid.row} ${className}`}
    component="transactionDetails"
    data={{ transactionId: data.id, token: 'LSK' }}
  >
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-md-3']}>
      <AccountVisualWithAddress
        address={data.recipientId}
        transactionSubject="recipientId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-md-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.amount} token={tokenMap.LSK.key} />
    </span>
    <span className={grid['col-md-1']}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<LiskAmount val={data.fee} token={tokenMap.LSK.key} />}
        size="s"
      >
        <p>{`${data.type} - ${transactionTypes.getByCode(data.type).title}`}</p>
      </Tooltip>
    </span>
    <span className={grid['col-md-1']}>
      <Tooltip
        title={data.confirmations > roundSize ? t('Confirmed') : t('Pending')}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.confirmations > roundSize ? 'approved' : 'pending'} />}
        size="s"
      >
        <p>{`${data.confirmations}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  </DialogLink>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
