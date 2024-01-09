import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchMerchantDetails } from "../../store/application/actions";
import { Box, Button, Container, CssBaseline, Typography } from "@mui/material";
import voiceRecognition from "../../assets/logowhite.png";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { merchant } = useSelector((state) => state.application);

  useEffect(() => {
    if (Object.keys(merchant).length === 0) {
      dispatch(
        fetchMerchantDetails({ businessId: searchParams.get("businessId") })
      );
    }
  }, []);

  const redirectToFeedback = () => {
    navigate(`/feedback?businessId=${searchParams.get("businessId")}`);
  };

  const redirectToCustomer = () => {
    window.location.href = "https://customer.popscom.life";
  };

  return (
    <Container 
      component="main"
      maxWidth="xs" 
      sx={{
        maxWidth: 'xs',
        '@media (max-width: 600px)': {
          maxWidth: '100%',
        },
      }}
    >
      <CssBaseline />
      <Box
        p={2}
        sx={{
          fontFamily: "monospace",
          height:"100vh",
          border: "solid #e65100 2px",
          background: "rgba(0, 0, 0, 0.87)",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          position: "relative",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '@media (max-width: 600px)': {
            height: '100vh',
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#ff9800", fontWeight: "bold" }}
        >
          Share your experience!
        </Typography>

        <img
          style={{ display: "block", margin: "0px auto", height: "200px" }}
          src={voiceRecognition}
          alt="voice-recognition"
        />

        <Box style={{ display: "flex", justifyContent: "space-evenly", gap: '1px' }}>
          <Button
            className="button"
            variant="contained"
            color="warning"
            onClick={redirectToFeedback}
            sx={{
              fontWeight: "bold",
              margin: '10px',
              fontSize: '12.5px',
              "@media (max-width: 600px)": {
                fontSize: "11px",
                margin: '5px',
              },
            }}
          >
            Begin Recording
          </Button>
          <Button
            className="button"
            variant="contained"
            color="warning"
            onClick={redirectToCustomer}
            sx={{
              fontWeight: "bold",
              margin: '10px',
              fontSize: '12.5px',
              "@media (max-width: 600px)": {
                fontSize: "11px",
                margin: '5px',
              },
            }}
          >
            Claim Discount
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "white", fontWeight: "bold", fontSize: "12px" }}
        >
          <ul>
            <li>Ensure your feedback is as rich as possible</li>
            <li>Speak just about anything and everything</li>
            <li>You can only record 2 feedbacks within 2 hours</li>
            <li>Your recording will only be shared with the business owner</li>
          </ul>
        </Typography>
      </Box>
    </Container>
  );
};

