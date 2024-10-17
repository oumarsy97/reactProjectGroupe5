import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  Input,
  Button,
  ScrollArea,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui";
import {
  Send,
  Pause,
  Image,
  Paperclip,
  Smile,
  Mic,
  Play,
  Square,
  Trash,
} from "lucide-react";

const ChatInterface = ({
  conversationId,
  recipient,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState({});

  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      setIsTyping(false);
    }
  };

  const handleMessageClick = (index) => {
    setDeleteVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data]);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setAudioChunks([]);
      setIsRecording(false);
      setIsPaused(false);
      onSendMessage(audioUrl);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const deleteAudio = () => {
    setAudioUrl(null);
    setAudioChunks([]);
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter(
      (message) => message.id !== messageId
    );
    onSendMessage(updatedMessages);
    setDeleteVisible((prev) => ({ ...prev, [messageId]: false }));
  };

  return (
    <Card className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg">
      <div className="bg-white dark:bg-gray-800 p-4 flex items-center space-x-3 border-b">
        <Avatar>
          <AvatarImage src={recipient.avatar} alt={recipient.name} />
          <AvatarFallback>{recipient.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg">{recipient.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">En ligne</p>
        </div>
      </div>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full py-4 px-2" ref={scrollRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 message ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              onClick={() => handleMessageClick(index)}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] ${message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none shadow"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow"
                  }`}
              >
                {typeof message.content === "string" ? (
                  message.content
                ) : (
                  <span>[Contenu non valide]</span>
                )}
                <span className="block text-xs mt-1 opacity-70">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {deleteVisible[index] && (
                  <Button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="mt-2"
                  >
                    <Trash className="h-5 w-5 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start px-4">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2">
                {recipient.name} est en train d'écrire...
              </div>
            </div>
          )}
          {audioUrl && (
            <div className="flex items-center justify-start mt-2 px-4">
              <audio controls src={audioUrl} className="mr-2"></audio>
              <Button
                onClick={deleteAudio}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          )}
          {isRecording && (
            <div className="flex justify-center mt-2">
              <span className="text-lg font-semibold">
                {Math.floor(recordingTime / 60)}:
                {(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-white dark:bg-gray-800 p-3 border-t">
        <div className="flex items-center w-full space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 shadow">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={handleTyping}
            placeholder="Message"
            className="flex-grow bg-transparent border-none focus:ring-0 px-2"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Image className="h-5 w-5" />
          </Button>
          {isRecording ? (
            <div className="flex items-center space-x-2">
              {isPaused ? (
                <Button
                  onClick={resumeRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                >
                  <Play className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={pauseRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                >
                  <Pause className="h-5 w-5" />
                </Button>
              )}
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
              >
                <Square className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
