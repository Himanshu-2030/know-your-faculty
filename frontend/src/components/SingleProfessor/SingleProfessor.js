import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { MdRateReview, MdCompare } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red"];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function SingleProfessor() {
  const location = useLocation();
  const { professor } = location.state || { professor: null };
  const [open, setOpen] = useState(false); // State for dialog open/close
  const [rating, setRating] = useState(""); // State for rating input
  const [ratingMessage, setRatingMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [reviews, setReviews] = useState(professor?.reviews || []); // State for reviews

  useEffect(() => {
    if (professor) {
      setReviews(professor.reviews);
    }
  }, [professor]);

  if (!professor) {
    return <div>No professor data available</div>;
  }

  // Function to calculate the average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const reviewData = {
      professor_name: professor.name,
      student_name: studentName,
      rating: rating,
      rating_message: ratingMessage,
    };

    // fetch("https://project-05-rate-professor-server.vercel.app/submit-review", {
    fetch("http://127.0.0.1:5000/submit-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // Add the new review to the state
          setReviews((prevReviews) => [
            ...prevReviews,
            {
              review_id: Date.now(), // Generate a unique ID or use response ID
              student_name: studentName,
              rating: parseFloat(rating), // Convert rating to number
              comment: ratingMessage,
            },
          ]);
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Clear the form fields
    setStudentName("");
    setRating("");
    setRatingMessage("");

    // Close the dialog after submission
    setOpen(false);
  };

  // Function to calculate the data for the bar chart
  const calculateChartData = () => {
    const counts = [0, 0, 0, 0, 0]; // Initialize counts for each rating (1 to 5)
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });

    // Create the chart data array based on counts
    return [
      { name: "1", count: counts[0] },
      { name: "2", count: counts[1] },
      { name: "3", count: counts[2] },
      { name: "4", count: counts[3] },
      { name: "5", count: counts[4] },
    ];
  };

  return (
    <div>
      <Container>
        <Grid
          container
          spacing={2}
          sx={{
            padding: "50px 0px",
          }}
        >
          <Grid item xs={12} md={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "100px", fontWeight: "bold" }}>
                {calculateAverageRating()} {/* Use the dynamic rating */}
              </span>
              <sup style={{ fontSize: "20px", fontWeight: "bold" }}> / 5</sup>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <span>Overall Ratings Based on {reviews.length} students</span>
              <span style={{ fontSize: "50px", fontWeight: "bold" }}>
                {professor.name}
              </span>
              <span>
                Professor in the {professor.department} department at{" "}
                {professor.university}
              </span>
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#303d40",
                  color: "#caccfa",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleClickOpen} // Open dialog on click
              >
                <MdRateReview />
                Rate
              </button>
              <Link
                to={"/compare/" + professor.id}
                style={{
                  backgroundColor: "#303d40",
                  textDecoration: "none",
                  color: "#caccfa",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <MdCompare />
                Compare
              </Link>
            </div>
          </Grid>

          <Grid item xs={12} md={6} style={{ height: "50vh" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculateChartData()} // Pass dynamic chart data
                margin={{ top: 20, right: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  shape={<TriangleBar />}
                  label={{ position: "top" }}
                >
                  {calculateChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <div>
              {/* Display the review of that professor */}
              <h1>Reviews</h1>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: "var(--info-bg)",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    key={review.review_id || review.student_name}
                  >
                    <p>
                      <strong>{review.student_name}:</strong> {review.comment}
                    </p>
                    <p>Rating: {review.rating}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Rating submission dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Submit a Rating</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            fullWidth
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <FormControl component="fieldset" style={{ marginTop: "20px" }}>
            <FormLabel component="legend">Rating</FormLabel>
            <RadioGroup
              aria-label="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <FormControlLabel value="1" control={<Radio />} label="1" />
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="3" control={<Radio />} label="3" />
              <FormControlLabel value="4" control={<Radio />} label="4" />
              <FormControlLabel value="5" control={<Radio />} label="5" />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            id="message"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={ratingMessage}
            onChange={(e) => setRatingMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



