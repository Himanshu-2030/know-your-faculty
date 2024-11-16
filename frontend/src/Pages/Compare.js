import { Container, Grid, TextField, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdGitCompare } from "react-icons/io";

export default function Compare() {
  const { id } = useParams(); // Get the professor ID from the URL
  const [professor, setProfessor] = useState(null);
  const [professors, setProfessors] = useState([]); // State to hold professors' data
  const [selectedProfessor, setSelectedProfessor] = useState(null); // State for selected professor
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    // Fetch professor data by ID (from URL)
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/professor/${id}` // Local API endpoint
        );
        if (response.ok) {
          const data = await response.json();
          setProfessor(data); // Store professor data in state
        } else {
          console.error("Error fetching professor data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessorData();
  }, [id]);

  useEffect(() => {
    // Fetch all professors' data
    const fetchProfessorsData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/test.json"); // Local API endpoint
        if (response.ok) {
          const data = await response.json();
          const professorsList = data.professors || [];
          setProfessors(professorsList); // Store professors data in state
        } else {
          console.error("Error fetching professors data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessorsData();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Click handler to set the selected professor
  const handleProfessorClick = (professor) => {
    setSelectedProfessor(professor);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter professors based on the search term
  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Container>
        <Grid container spacing={2} style={{ padding: "50px 0px" }}>
          {/* Professor data display */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
              {professor ? (
                <div>
                  <Typography variant="h5">{professor.name}</Typography>
                  <Typography variant="body1">
                    Average Rating: {calculateAverageRating(professor.reviews)}
                  </Typography>
                  <Typography variant="body1">Department: {professor.department}</Typography>
                </div>
              ) : (
                <Typography variant="body1">Loading professor data...</Typography>
              )}
            </Paper>
          </Grid>

          {/* Comparison Icon */}
          <Grid item xs={12} md={4} style={{ display: "flex", justifyContent: "center" }}>
            <IoMdGitCompare style={{ fontSize: "150px", color: "gray" }} />
          </Grid>

          {/* Selected professor data display */}
          <Grid item xs={12} md={4}>
            {selectedProfessor && (
              <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
                <Typography variant="h5">Selected Professor</Typography>
                <Typography variant="body1">Name: {selectedProfessor.name}</Typography>
                <Typography variant="body1">
                  Average Rating: {calculateAverageRating(selectedProfessor.reviews)}
                </Typography>
                <Typography variant="body1">Department: {selectedProfessor.department}</Typography>
              </Paper>
            )}
          </Grid>

          {/* Search and list of professors */}
          <Grid item xs={12} md={6}>
            <div>
              <Typography variant="h6">Search for Professors</Typography>
              <TextField
                label="Search Professors"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: "16px" }}
              />
              {filteredProfessors.length > 0 ? (
                filteredProfessors.map((prof) => (
                  <div
                    key={prof.id}
                    style={{
                      padding: "10px",
                      margin: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: "var(--info-bg)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleProfessorClick(prof)} // Handle click event
                  >
                    {prof.name}
                  </div>
                ))
              ) : (
                <Typography>No professors found.</Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
