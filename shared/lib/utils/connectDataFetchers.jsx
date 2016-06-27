import React from 'react';

export default function connectDataFetchers(Component, actionCreators) {
  return class DataFetchersWrapper extends React.Component {
    static propTypes = {
      dispatch: React.PropTypes.func.isRequired,
      params: React.PropTypes.object.isRequired,
      location: React.PropTypes.object.isRequired
    };

    static fetchData(dispatch, params={}, query={}, authToken=null) {
      return Promise.all(
        actionCreators.map(actionCreator => dispatch(actionCreator({params, query, authToken})))
      );
    }

    componentDidMount() {
      DataFetchersWrapper.fetchData(
        this.props.dispatch,
        this.props.params,
        this.props.location ? this.props.location.query : {},
        this.props.authToken
      );
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  };
}
