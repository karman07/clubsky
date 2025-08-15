import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

const CourtContext = createContext();

export const CourtProvider = ({ children }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all courts
  const fetchCourts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/courts`);
      setCourts(res.data);
    } catch (err) {
      console.error("Error fetching courts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single court by ID
  const fetchCourtById = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/courts/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching court:", err);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <CourtContext.Provider value={{ courts, fetchCourts, fetchCourtById, loading }}>
      {children}
    </CourtContext.Provider>
  );
};

export const useCourtContext = () => useContext(CourtContext);
