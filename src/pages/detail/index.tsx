import { useEffect, useState } from "react";

const Detail = () => {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  useEffect(() => {
    setList([{ a: 1 }, 2]);
  }, []);
  useEffect(() => {
    console.log("listChange", list);
  }, [list]);
  return (
    <div>
      Detail
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

export default Detail;
