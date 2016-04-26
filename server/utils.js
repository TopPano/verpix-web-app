import Promise from 'bluebird';

export function fetchComponentsData(dispatch, components, params, query, authToken) {
  const promises = components.map(current => {
    const component = current.WrappedComponent ? current.WrappedComponent : current;

    return component.fetchData
      ? component.fetchData(dispatch, params, query, authToken)
      : null;
  });

  return Promise.all(promises);
}
