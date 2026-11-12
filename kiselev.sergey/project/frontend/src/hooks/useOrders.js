import {useCallback, useEffect, useState} from 'react';

import {fetchOrders} from '../api/index.js';

export function useOrders() {
  const [state, setState] = useState({
    orders: [],
    isLoading: true,
    error: null,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchOrders()
      .then((orders) => {
        if (isActive) {
          setState({orders, isLoading: false, error: null});
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({orders: [], isLoading: false, error: error.message});
        }
      });

    return () => {
      isActive = false;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return {...state, reload};
}
