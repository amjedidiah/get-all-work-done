'use client';
import { useEffect, useState } from 'react';

export default function Index() {
  const [list, setList] = useState();

  useEffect(() => {
    fetch('http://localhost:8080/list')
      .then((res) => res.json())
      .then(setList);
  }, []);

  console.log(list);

  return <div className="">Hello</div>;
}
