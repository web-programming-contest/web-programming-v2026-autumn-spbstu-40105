import {useEffect, useState} from 'react';

import {fetchGoods} from '../api/index.js';

export function useGoods() {
  const [state, setState] = useState({goods: [], isLoading: true, error: null});

  useEffect(() => {
    let isActive = true;

    fetchGoods()
      .then((goods) => {
        if (isActive) {
          setState({goods, isLoading: false, error: null});
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({goods: [], isLoading: false, error: error.message});
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
