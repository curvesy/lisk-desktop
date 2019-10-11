import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import BlockFilterDropdown from './blockFilterDropdown';
import Box from '../../../toolbox/box';
import FilterBar from '../../../shared/filterBar';
import IconlessTooltip from '../../../shared/iconlessTooltip';
import Illustration from '../../../toolbox/illustration';
import LiskAmount from '../../../shared/liskAmount';
import MonitorHeader from '../header';
import Table from '../../../toolbox/table';
import routes from '../../../../constants/routes';
import styles from './blocks.css';
import withFilters from '../../../../utils/withFilters';

const Blocks = ({
  t, blocks,
  filters, applyFilters, clearFilter, clearAllFilters,
  sort, changeSort,
}) => {
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    address: value => `${t('Generated by')}: ${value}`,
  };

  const handleLoadMore = () => {
    blocks.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: blocks.data.length,
      sort,
    }));
  };

  return (
    <div>
      <MonitorHeader />
      <Box isLoading={blocks.isLoading} width="full" main>
        <Box.Header>
          <h2>{t('All blocks')}</h2>
          <BlockFilterDropdown filters={filters} applyFilters={applyFilters} />
        </Box.Header>
        <FilterBar {...{
          clearFilter, clearAllFilters, filters, formatters, t,
        }}
        />
        {!blocks.isLoading && blocks.data.length === 0
          ? (
            <Box.Content>
              <Box.EmptyState>
                <Illustration name="emptyWallet" />
                <h3>{`${blocks.error || t('No search results in given criteria.')}`}</h3>
              </Box.EmptyState>
            </Box.Content>
          )
          : (
            <React.Fragment>
              <Box.Content className={styles.content}>
                <Table
                  getRowLink={block => `${routes.blocks.path}/${block.id}`}
                  data={blocks.data}
                  sort={sort}
                  onSortChange={changeSort}
                  columns={[{
                    /* eslint-disable react/display-name */
                    id: 'height',
                    header: t('Height'),
                    className: grid['col-xs-2'],
                    isSortable: true,
                  }, {
                    id: 'timestamp',
                    header: t('Date'),
                    className: `${grid['col-md-2']} ${grid['col-xs-3']}`,
                    getValue: block => <DateTimeFromTimestamp time={block.timestamp * 1000} token="BTC" />,
                  }, {
                    id: 'numberOfTransactions',
                    header: t('Transactions'),
                    className: `${grid['col-xs-2']} hidden-m`,
                  }, {
                    id: 'generatorUsername',
                    header: t('Generated by'),
                    className: grid['col-xs-3'],
                  }, {
                    id: 'totalAmount',
                    header: t('Amount'),
                    className: grid['col-xs-2'],
                    getValue: block => (
                      <IconlessTooltip
                        tooltipContent={<p>{block.numberOfTransactions}</p>}
                        title={t('Transactions')}
                        className="showOnBottom"
                        tooltipClassName="show-m"
                        size="s"
                      >
                        <LiskAmount val={block.totalAmount} token={tokenMap.LSK.key} />
                      </IconlessTooltip>
                    ),
                  }, {
                    id: 'totalForged',
                    header: t('Forged'),
                    className: `${grid['col-md-1']} ${grid['col-xs-2']}`,
                    getValue: block => (
                      <LiskAmount val={block.totalForged} token={tokenMap.LSK.key} />
                    ),
                    /* eslint-enable react/display-name */
                  }]}
                />
              </Box.Content>
              {!!blocks.data.length && blocks.data.length % DEFAULT_LIMIT === 0 && (
              <Box.FooterButton
                className="load-more"
                onClick={handleLoadMore}
              >
                {t('Load more')}
              </Box.FooterButton>
              )}
            </React.Fragment>
          )
      }
      </Box>
    </div>
  );
};

Blocks.propTypes = {
  t: PropTypes.func.isRequired,
  blocks: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  height: '',
  address: '',
};
const defaultSort = 'height:desc';

export default withFilters('blocks', defaultFilters, defaultSort)(Blocks);
