import axios from 'axios';
import { applicationActions } from './slice';

export const fetchMerchantDetails = ({ businessId }) => {
  return async (dispatch) => {
    try {
      const { data: { data } } = await axios.get(`https://api.popscom.life/merchant/business/${businessId}`);
      dispatch(
        applicationActions.setMerchant({
          merchant: data,
        })
      );
    } catch (error) {
      throw error;
    }
  };
};


export const postCustomerFeedback = ({ audio, language, businessId, place }) => {
  return async (dispatch) => {
    try {
      const form = new FormData();
      form.append("audio", audio);
      form.append("language", language);
      form.append("businessId", businessId);
      form.append("place", place);

      const { data: { data } } = await axios.post(`https://api.popscom.life/feedback`, form, {
        "Content-Type": "multipart/form-data",
      });

      dispatch(applicationActions.setFeedback({ feedback: data }));

    } catch (error) {
      throw error;
    }
  };
};

export const fetchFeedback = (feedbackId) => {
  return async (dispatch) => {
    try {
      const { data: { data } } = await axios.get(`https://api.popscom.life/feedback/${feedbackId}`);
      dispatch(
        applicationActions.setFeedback({
          feedback: data,
        })
      );
    } catch (error) {
      throw error;
    }
  };
};

export const fetchDiscountPercentage = async ({ customerId, merchantBusinessId, customerFeedbackId }) => {
  try {
    const response = await fetch('your_backend_endpoint_for_discount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        merchantBusinessId,
        customerFeedbackId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch discount');
    }

    const data = await response.json();
    return data.percentage;
  } catch (error) {
    throw new Error(`Error fetching discount: ${error.message}`);
  }
};


