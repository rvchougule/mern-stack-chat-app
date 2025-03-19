import { useParams } from "react-router";
import MessagePageHeader from "../components/MessagePageHeader";
import { useSelector } from "react-redux";

const MessagePage = () => {
  const userId = useParams();
  const user = useSelector((state) => state.user);
  return (
    <div className="bg-bgImg bg-cover bg-center w-full">
      <MessagePageHeader user={user} />
    </div>
  );
};

export default MessagePage;
