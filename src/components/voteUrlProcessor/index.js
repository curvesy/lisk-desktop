import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import {
  urlVotesFound,
  voteLookupStatusCleared,
  votePlaced,
  voteToggled,
  votesAdded,
} from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const filterObjectPropsWithValue = (object = {}, value) => (
  Object.keys(object).filter(key => object[key] === value)
);

const mapStateToProps = state => ({
  votes: state.voting.votes,
  urlVoteCount: Object.keys(state.voting.voteLookupStatus || {}).length,
  pending: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'pending'),
  downvotes: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'downvotes'),
  upvotes: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'upvotes'),
  alreadyVoted: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'alreadyVoted'),
  notVotedYet: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notVotedYet'),
  notFound: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notFound'),
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
  voteToggled: data => dispatch(voteToggled(data)),
  votesAdded: data => dispatch(votesAdded(data)),
  urlVotesFound: data => dispatch(urlVotesFound(data)),
  clearVoteLookupStatus: () => dispatch(voteLookupStatusCleared()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    translate()(VoteUrlProcessor),
  ),
);
