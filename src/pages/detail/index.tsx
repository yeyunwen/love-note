import { useEffect, useState } from "react";

const Detail = () => {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const getW = () => {
    if (count === 0) {
      return 0;
    }
    return count;
  };
  const w = getW();

  useEffect(() => {
    console.log(w);

    setList([{ a: 1 }, 2]);
  }, []);
  useEffect(() => {
    console.log(w);

    console.log("listChange", list);
  }, [list, count]);
  return (
    <div>
      Detail
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

export default Detail;
