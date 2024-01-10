import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { postCustomerFeedback, fetchMerchantDetails } from "../../store/application/actions";
import microphone from "../../assets/mic.png";
import { List, ListItem, CircularProgress, IconButton, Alert, Box, Button, Container, CssBaseline, Typography, Snackbar } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import "./index.css";
import loaderGif from "../../assets/loader.gif";

export const Feedback = () => {
  const mimeType = "audio/mp3";
  const recorderState = {
    "INITIAL": "initial",
    "START": "start",
    "STOP": "stop",
    "PAUSE": "pause",
    "RESUME": "resume"
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { merchant, feedback } = useSelector((state) => state.application);
  const mediaRecorder = useRef(null);
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(recorderState.INITIAL);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [notification, setNotification] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [reSpeakCount, setReSpeakCount] = useState(1);
  const [showLoader, setShowLoader] = useState(false);

  const recordAgain = (event) => {
    setReSpeakCount(reSpeakCount + 1);
    if (reSpeakCount > 1) {
      setNotification("Come Back after 2 hours");
      return;
    }
    startRecording();
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setIsStopped(false);
    setIsRecording(true);
    setAudio(null);
    setAudioChunks([]);
    setRecordingStatus(recorderState.START);
    setNotification("Recording Started");

    const media = new MediaRecorder(stream, { type: mimeType });

    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setIsBlinking(false);
    setIsStopped(true);
    setRecordingStatus(recorderState.STOP);
    setNotification("Recording Stopped");

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks, { type: mimeType });
      const audioBlob = new File([blob], "input.mp3", { type: "audio/mp3" });
      setAudio(audioBlob);
    };
  };

  const pauseRecording = () => {
    setRecordingStatus(recorderState.PAUSE);
    if (isBlinking) setNotification("Recording Resumed");
    else setNotification("Recording Paused");
    setIsBlinking(!isBlinking);
    mediaRecorder.current.pause();
  };

  const resumeRecording = () => {
    setRecordingStatus(recorderState.RESUME);
    setNotification("Recording Resumed");
    mediaRecorder.current.resume();
  };

  const submitFeedbackHandler = async () => {
    setShowLoader(true);
    const record = await new Promise(postCustomerFeedback({ audio: audio, language: "en", businessId: "e2f920d7-7230-4ec8-af02-ba982336816a", place: "DiningArea" }));
    dispatch(record);
    console.log("completed");
    setShowLoader(false);
    navigate("/sentiment");
  };

  useEffect(() => {
    getMicrophonePermission();
    if (Object.keys(merchant).length === 0) {
      dispatch(fetchMerchantDetails({ businessId: searchParams.get('businessId') }));
    }
  }, []);

  
  return (
    <>
      <Snackbar
        open={notification !== ""}
        autoHideDuration={2000}
        onClose={() => setNotification("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification("")}
          severity="info"
          color="warning"
          sx={{ width: '100%', fontFamily: 'monospace', fontSize: "large", fontWeight: "bold" }}
        >
          {notification}
        </Alert>
      </Snackbar>

      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box p={2}
          sx={{
            padding: {
              xs: '15px', 
              sm: '28px', 
            },
            maxWidth: "410px",
            margin: 'auto',
            height: "98vh",
            fontFamily: 'monospace',
            marginTop: '5px',
            marginBottom: '5px',
            border: 'solid #e65100 2px',
            background: 'rgba(0, 0, 0, 0.87)',
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            position: "relative",
            alignContent: "flex-end",
          }}
        >
          {showLoader && <img src={loaderGif} alt="Loading..." className="loader" />}
          <Box style={{ filter: `${showLoader ? "blur(1000px)" : "blur(0px)"}` }}>
            <section>
              <Typography variant="h4" align="center" sx={{ color: "#ff9800", fontWeight: "bold" }}> Share your experience!</Typography>
              <br></br>
              <Typography variant="h5" align="center" sx={{ color: "#ed6c02", fontWeight: "bold" }}> @{merchant.displayName}</Typography>
              <br></br>
            </section>


            <section>
              <Typography variant="h6" align="center" sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Speak in any language</Typography>
            </section>

            <section>
              <img style={{ display: "block", margin: "0px auto", height: "200px" }} src={microphone} alt="micro-phone" />
            </section>

            <br></br>

            {!isStopped ?
              <section style={{ display: "flex", justifyContent: "space-evenly" }}>
                {!isRecording ?
                  <Button variant="contained" color="warning" onClick={startRecording} sx={{ fontWeight: "bold" }}>Start</Button> :
                  <>
                    <IconButton
                      size="large"
                      className={`${isBlinking ? "" : "record-button blinking"}`}
                      onClick={startRecording}
                    >
                      <FiberManualRecordIcon fontSize="large" />
                    </IconButton>
                    <IconButton size="large" variant="contained" color="warning" onClick={pauseRecording} sx={{ fontWeight: "bold" }}>{isBlinking ? <PlayCircleOutlineIcon fontSize="large" /> : <PauseCircleOutlineIcon fontSize="large" />}</IconButton>
                    <IconButton size="large" variant="contained" color="warning" onClick={stopRecording} sx={{ fontWeight: "bold" }}><StopCircleIcon fontSize="large" /></IconButton>
                  </>}
              </section> :
              <>
                <section style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="warning" onClick={submitFeedbackHandler} sx={{ fontWeight: "bold" }}>Submit Review</Button>
                  <Button variant="contained" color={`${reSpeakCount > 1 ? "grey" : "warning"}`} onClick={recordAgain} sx={{ fontWeight: "bold" }}>Record Again</Button>
                </section>
              </>
            }

            
            <Typography variant="caption" sx={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>
              <ul>
                <li> Ensure your feedback is as rich as possible</li>
                <li> Speak just about anything and everything</li>
                <li> You can only record 2 feedbacks within 2 hours</li>
                <li> Your recording will only be shared with the business owner</li>
              </ul>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};
