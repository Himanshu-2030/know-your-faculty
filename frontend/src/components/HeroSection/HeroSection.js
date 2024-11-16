import React, { useState, useRef, useEffect } from "react";
import "./HeroSection.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react"; // Import Clerk's authentication hook

const HeroSection = () => {
  const { isSignedIn, user } = useAuth(); // Get the authentication status
  const navigate = useNavigate(); // To navigate users to sign-in page if not signed in
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, sender: "user" },
    ]);
    setQuery("");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/recommend",
        {
          prompt: query,
        }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: res.data.recommendation, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClickOpen = () => {
    if (isSignedIn) {
      setOpen(true);
    } else {
      navigate("/sign-in"); // Redirect to sign-in page if not signed in
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="stroke-text">AI-Driven</span>
          <span> Professor </span>
          <span style={{ color: "var(--text-color)" }}>Recommendations</span>
        </h1>
        <p className="hero-subtitle">
          Ask AI to guide you to the best professors based on your needs and
          preferences.
        </p>
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={handleClickOpen}>
            Get Professor Suggestions
          </button>
          <Link to="/all-professors" className="cta-button secondary">
            Browse All Professors
          </Link>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            overflowX: "hidden",
          },
        }}
      >
        <DialogTitle>
          Ask for AI Recommendations
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <IoMdCloseCircle />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            overflowX: "hidden",
          }}
        >
          <Divider sx={{ background: "white" }} />
          <Box
            sx={{ flex: 1, padding: 2, overflowY: "auto", overflowX: "hidden" }}
          >
            <Stack spacing={2}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    flexDirection: "column",
                    alignItems:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      wordWrap: "break-word",
                      backgroundColor:
                        msg.sender === "user" ? "#e0e0e0" : "#f5f5f5",
                      padding: 1,
                      borderRadius: 1,
                      maxWidth: "75%",
                      textAlign: msg.sender === "user" ? "right" : "left",
                    }}
                  >
                    {msg.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "gray",
                      marginTop: 0.5,
                      textAlign: msg.sender === "user" ? "right" : "left",
                    }}
                  >
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </Typography>
                </Box>
              ))}
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      wordWrap: "break-word",
                      backgroundColor: "#f5f5f5",
                      padding: 1,
                      borderRadius: 1,
                      maxWidth: "75%",
                      textAlign: "left",
                    }}
                  >
                    <span>
                      <div className="loader"></div>
                    </span>{" "}
                    {/* Loader */}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "gray",
                      marginTop: 0.5,
                      textAlign: "left",
                    }}
                  >
                    AI Assistant
                  </Typography>
                </Box>
              )}
              <div ref={messageEndRef} />
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <TextField
              fullWidth
              label="What are you looking for in a professor?"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ marginLeft: 1 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Dialog>
    </section>
  );
};

export default HeroSection;


