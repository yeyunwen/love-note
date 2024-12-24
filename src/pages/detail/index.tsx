import { useParams } from "react-router-dom";

const Detail: React.FC = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default Detail;
