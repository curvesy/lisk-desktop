import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import { truncateAddress } from '@utils/account';
import { TertiaryButton } from '@toolbox/buttons';
import AccountVisual from '@toolbox/accountVisual';
import LiskAmount from '@shared/liskAmount';
import { Input } from '@toolbox/inputs';
import Icon from '@toolbox/icon';
import Tooltip from '@toolbox/tooltip/tooltip';
import styles from './selectAccount.css';

const AccountCard = ({
  account,
  index,
  onSaveNameAccounts,
  onSelectAccount,
  t,
}) => {
  const [inputTitle, setInputTitle] = useState(account.name);
  const [accountOnEditMode, setAccountOnEditMode] = useState(false);

  useEffect(() => {
    if (!accountOnEditMode) {
      setInputTitle(account.name);
    }
  }, [accountOnEditMode]);

  return (
    <div
      id={account.summary?.address}
      className={`${styles.account} hw-account select-account`}
      onClick={() => onSelectAccount(account, index)}
      onMouseLeave={() => setAccountOnEditMode(false)}
    >
      <div className={styles.content}>
        <div>
          <AccountVisual
            address={account.summary?.address || ''}
            size={40}
          />
        </div>
        <div>
          <header className={styles.header}>
            { accountOnEditMode
              ? (
                <div className={styles.editAccountTitle}>
                  <Input
                    value={inputTitle}
                    size="s"
                    onClick={e => e.stopPropagation()}
                    onChange={e => setInputTitle(e.target.value)}
                    className="account-name"
                    placeholder={t('Account name')}
                    autoFocus
                  />
                  <TertiaryButton
                    className={`${styles.saveBtn} save-account`}
                    onClick={e => {
                      e.stopPropagation();
                      onSaveNameAccounts(inputTitle, account.summary?.address);
                      setAccountOnEditMode(false);
                    }}
                  >
                    {t('Save')}
                  </TertiaryButton>
                </div>
              )
              : (
                <>
                  <p className={`${styles.accountTitle} account-name`}>
                    {!account.name ? t('Unnamed account') : account.name}
                    <Icon
                      className={`${styles.editBtn} edit-account`}
                      onClick={e => {
                        e.stopPropagation();
                        setAccountOnEditMode(true);
                      }}
                      name="edit"
                    />
                  </p>
                  <p className={`${styles.accountAddress} row-address`}>{truncateAddress(account.summary?.address)}</p>
                </>
              )}
          </header>
          <div className={`${styles.accountBalance} row-balance`}>
            <p>{t('Balance:')}</p>
            <p>
              <LiskAmount val={account.summary?.balance} token={tokenMap.LSK.key} />
            </p>
          </div>
          {account.legacy && (
            <Tooltip
              className={styles.legacyWarning}
              tooltipClassName={styles.tooltip}
              size="m"
              position="bottom"
              content={<Icon name="warningIconBlue" />}
            >
              <>
                <p>{t('This account needs to be reclaimed')}</p>
                <br />
                <p>{t('Balance after reclaiming:')}</p>
                <p className={styles.reclaimBalance}>
                  <LiskAmount val={account.legacy.balance} token={tokenMap.LSK.key} />
                </p>
              </>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AccountCard);
