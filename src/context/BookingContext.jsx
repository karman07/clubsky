import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Create a new booking
  const createBooking = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/bookings`, data);
      return res.data;
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  // Get all bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Get unavailable slots
  const getUnavailableSlots = async (courtId, date) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/unavailable`, {
        params: { courtId, date },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching unavailable slots:", err);
    }
  };

  // Get fully booked days
  const getFullyBookedDays = async (courtId) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/fully-booked-days/${courtId}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching fully booked days:", err);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        fetchBookings,
        createBooking,
        getUnavailableSlots,
        getFullyBookedDays,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);
