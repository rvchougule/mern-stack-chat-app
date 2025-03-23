import { useNavigate, useParams } from "react-router";
import MessagePageHeader from "../components/MessagePageHeader";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import useSocket from "../hooks/useSocket";

const MessagePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { socketConnection } = useSocket();
  const user = useSelector((state) => state.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_img: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (!socketConnection) {
      navigate("/login");
    }
  });

  const handleUploadImage = () => {};
  const handleUploadVideo = () => {};

  const handleSendMessage = () => {};

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        console.log(data);
        setDataUser(data);
      });

      socketConnection?.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative bg-bgImg bg-cover bg-center h-full w-full">
      {/* Header */}
      <MessagePageHeader user={dataUser} />

      {/**send message */}
      <section className="h-16 bg-white flex items-center px-4 absolute bottom-0 w-full">
        <div className="relative">
          <button
            onClick={() => setOpenImageVideoUpload(!openImageVideoUpload)}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-secondaryGreen hover:text-slate-100"
          >
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {openImageVideoUpload && (
            <div className="bg-primary shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            name="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primaryGreenOne hover:text-secondary">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
