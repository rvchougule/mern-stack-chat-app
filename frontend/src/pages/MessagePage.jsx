import { useNavigate, useParams } from "react-router";
import MessagePageHeader from "../components/MessagePageHeader";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import useSocket from "../hooks/useSocket";
import moment from "moment";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

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
  const currentMessageEndRef = useRef(null);

  const [selectedMessagesList, setSelectedMessageList] = useState([]);

  useEffect(() => {
    if (!socketConnection) {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection?.on("message", (data) => {
        // console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  useEffect(() => {
    if (currentMessageEndRef.current) {
      currentMessageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessage]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };
  const handleUploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      setLoading(true);
      setOpenImageVideoUpload(false);

      if (!file) return;

      const maxSize = 1 * 1024 * 1024; // 5MB

      if (file?.size > maxSize) {
        toast.error("Image size must be less than 1MB!");
        return;
      }

      reader.onload = () => {
        console.log("file load", file);
        socketConnection.emit("file-upload", {
          filename: file.name,
          data: reader.result, // Convert file to ArrayBuffer or Base64
        });
      };

      reader.readAsArrayBuffer(file);
      // Listen for upload success response
      socketConnection.on("upload-success", (response) => {
        console.log("Upload Success:", response);
        setMessage((preve) => {
          return {
            ...preve,
            imageUrl: response?.url,
          };
        });
      });

      // Listen for upload error
      socketConnection.on("upload-error", (error) => {
        console.error("Upload Error:", error);
        toast.error(error.message);
      });

      console.log(message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUploadVideo = (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      setLoading(true);
      setOpenImageVideoUpload(false);

      if (!file) return;

      const maxSize = 2 * 1024 * 1024; // 5MB

      if (file?.size > maxSize) {
        toast.error("Videos size must be less than 2MB!");
        return;
      }

      reader.onload = () => {
        console.log("file load", file);
        socketConnection.emit("file-upload", {
          filename: file.name,
          data: reader.result, // Convert file to ArrayBuffer or Base64
        });
      };

      reader.readAsArrayBuffer(file);
      // Listen for upload success response
      socketConnection.on("upload-success", (response) => {
        console.log("Upload Success:", response);
        setMessage((preve) => {
          return {
            ...preve,
            videoUrl: response?.url,
          };
        });
        setLoading(false);
      });

      // Listen for upload error
      socketConnection.on("upload-error", (error) => {
        console.error("Upload Error:", error);
        toast.error(error.message);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleMsgDblClick = (event) => {
    console.log(event.target.closest(".message"));
    const messageId = event.target.closest(".message")?.dataset.id;
    if (messageId) {
      // const id = Number(messageId);
      setSelectedMessageList((prev) =>
        prev.includes(messageId)
          ? prev.filter((msgId) => msgId !== messageId)
          : [...prev, messageId]
      );
    }
  };

  const handleSelectedChat = (e) => {
    const val = e.target.value;
    setSelectedMessageList((prev) =>
      prev.includes(val)
        ? prev.filter((msgId) => msgId !== val)
        : [...prev, val]
    );
  };

  const handleDeleteChat = () => {
    if (socketConnection) {
      socketConnection.emit("delete-chat", selectedMessagesList);

      socketConnection?.on("delete-message", (data) => {
        console.log("delte-message", data);
        setSelectedMessageList([]);
        if (data) {
          socketConnection.emit("message-page", params.userId);
          socketConnection?.on("message", (data) => {
            setAllMessage(data);
          });
        }
      });
    }
  };

  // console.log(allMessage);
  console.log(selectedMessagesList);
  return (
    <div className="relative bg-bgImg bg-cover bg-center h-full w-full">
      {/* Header */}
      <MessagePageHeader
        user={dataUser}
        selectedMessagesList={selectedMessagesList}
        handleDeleteChat={handleDeleteChat}
      />

      {/***show all message */}
      <section className="h-[calc(100vh-120px)]  overflow-x-hidden overflow-y-scroll scrollbar  relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <div
          className=" w-full flex flex-col gap-2 py-2 px-2 "
          ref={currentMessage}
          onDoubleClick={handleMsgDblClick}
        >
          {allMessage.map((msg, index) => {
            return (
              <div className="flex gap-3" key={index}>
                {/* checkbox */}
                {selectedMessagesList.length != 0 && (
                  <input
                    type="checkbox"
                    name="chat-checkbox"
                    id="chat-checkbox"
                    className="ring-0 size-4 self-center"
                    value={msg?._id}
                    checked={
                      selectedMessagesList.includes(msg?._id) ? true : false
                    }
                    onChange={handleSelectedChat}
                  />
                )}

                <div
                  className={`message p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    user._id === msg?.msgByUserId
                      ? "ml-auto bg-teal-100"
                      : "bg-white"
                  }`}
                  data-id={msg?._id}
                >
                  <div className="w-full relative">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down"
                      />
                    )}
                    {msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        className="w-full h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p className="px-2">
                    {msg.text}
                    <span className="text-xs ml-4 float-end inline-block  w-fit">
                      {moment(msg.createdAt).format("HH:mm")}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={currentMessageEndRef} />
        </div>
        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

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
                  <div className="text-secondaryOne">
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
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  accept="video/*"
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
