'use client';
import { getWorld } from '@get-all-work-done/shared/utils';
import { useEffect, useState } from 'react';

const name = getWorld();
export default function Index() {
  const [list, setList] = useState();

  useEffect(() => {
    fetch('http://localhost:8008/list')
      .then((res) => res.json())
      .then(setList);
  }, []);

  console.log(list);

  return <div className="">Hello {name}</div>;
}
