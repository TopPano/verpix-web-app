import Promise from 'lib/utils/promise';

export function fetchComponentsData(dispatch, components, params, query, authToken) {
  const promises = components.map(current => {
    const component = current.WrappedComponent ? current.WrappedComponent : current;

    return component.fetchData
      ? component.fetchData(dispatch, params, query, authToken)
      : null;
  });

  return Promise.all(promises);
}

export function getViewerPostId(url) {
  const startIndex = url.indexOf('@') + 1;
  const endIndex = url.indexOf('?');

  return (endIndex === -1) ? url.slice(startIndex) : url.slice(startIndex, endIndex);
}
