import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Button,
  Grid,
  Rating,
  CssBaseline,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchDiscountPercentage } from "../../store/application/actions"; // Add the action for fetching discount

export const Sentiment = () => {
  const { feedback, merchant } = useSelector((state) => state.application);

  const [feedbackText, setFeedback] = useState(feedback?.rawText || "");
  const [discount, setDiscount] = useState();
  const [rating, setRating] = useState(0);

  const calculateDiscount = () => {
    if (!feedback || !merchant) return 0;
    const { minimum, maximum } = merchant.merchantBusinessDiscount;
    const { entities, score } = feedback;

    if (score <= 0.1) {
      return Math.floor(minimum + (0.33 * (maximum - minimum)) / 100);
    }
    const entityCount = entities?.length ?? 0;
    return Math.floor(
      minimum + (maximum - minimum) * (entityCount / 15) * score
    );
  };

  const calculateRating = () => {
    if (!feedback) return 0;
    const { score } = feedback;
    if (score <= -0.4) return 1;
    else if (score > -0.4 && score <= 0.1) return 2;
    else if (score > 0.1 && score <= 0.4) return 3;
    else if (score > 0.4 && score <= 0.7) return 4;
    return 5;
  };

  useEffect(() => {
    if (feedback && feedback.entities && feedback.entities.length > 0) {
      setRating(calculateRating());

      const fetchDiscount = async () => {
        try {
          const { customerId, merchantBusinessId, customerFeedbackId } = feedback; 
          const response = await fetchDiscountPercentage({ customerId, merchantBusinessId, customerFeedbackId });
          setDiscount(response);
        } catch (error) {
          console.error("Error fetching discount:", error);
        }
      };

      fetchDiscount();
    }
  }, [feedback]);

  const editFeedback = (event) => {
    setFeedback(event.target.value);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("../feedback");
  };

  if (!feedback || !feedback.entities || feedback.entities.length === 0) {
    return (
      <Container component="main" maxWidth="xs">
        <Grid
          p={2}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          border="solid #e65100 2px"
          background="rgba(0, 0, 0, 0.87)"
          boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
          textAlign="center"
          position="relative"
          sx={{
            height: "100vh",
            "@media (max-width: 320px)": {},
            "@media (max-width: 375px)": {
              height: "105vh",
            },
          }}
        >
          <CssBaseline />
          <Typography variant="h5" sx={{ fontFamily: "monospace", marginTop: "20px" }}>
            No feedback detected or empty feedback provided. Please try again.
          </Typography>
          <Button
            style={{
              borderRadius: 5,
              backgroundColor: "#ff9800",
              padding: "18px 36px",
              fontSize: "18px",
              marginTop: "20px",
            }}
            variant="contained"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </Grid>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Grid
        p={2}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        border="solid #e65100 2px"
        background="rgba(0, 0, 0, 0.87)"
        boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        textAlign="center"
        position="relative"
        sx={{
          height: "100vh",
          "@media (max-width: 320px)": {},
          "@media (max-width: 375px)": {
            height: "105vh",
          },
        }}
      >
        <CssBaseline />

        {feedback.category !== "negative" ? (
          <>
            <Typography
              variant="h5"
              sx={{ marginTop: "50px", fontFamily: "monospace" }}
            >
              Thank you for the wonderful feedback.
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: "20px", fontFamily: "monospace" }}
            >
              You earned a discount of {discount}%
            </Typography>
            <br></br>
            <Button
              style={{
                borderRadius: 5,
                backgroundColor: "#ff9800",
                padding: "16px 34px",
                fontSize: "16px",
              }}
              variant="contained"
            >
              Go to Discount Page
            </Button>

            <br></br>
            <br></br>

            <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
              Here's a summarized feedback
            </Typography>
            <br></br>

            <TextField
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              value={feedbackText}
              inputProps={{ style: { fontFamily: "monospace" } }}
              onChange={editFeedback}
            />

            <Rating
              size="large"
              name="half-rating"
              value={rating}
              precision={1}
              sx={{ marginTop: "20px" }}
            />
            <Button
              style={{
                borderRadius: 5,
                backgroundColor: "#ff9800",
                padding: "18px 36px",
                fontSize: "18px",
                marginTop: "20px",
              }}
              variant="contained"
            >
              One Click! Rate us on Google
            </Button>

            <br></br>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
              Sorry to hear that you feel that way
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginTop: "20px", fontFamily: "monospace" }}
            >
              We've recorded your feedback and will improve on the same.
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginTop: "100px", fontFamily: "monospace" }}
            >
              Here's a token of gratitude from our end. For your inconvenience,
              Here's an instant discount of {discount}%
            </Typography>
            <Button
              style={{
                borderRadius: 5,
                backgroundColor: "#ff9800",
                padding: "18px 36px",
                fontSize: "18px",
                marginTop: "20px",
              }}
              variant="contained"
              disableElevation
            >
              Click to Claim
            </Button>
          </>
        )}
      </Grid>
    </Container>
  );
};
