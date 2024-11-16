import {
  Container,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedProfessor, setHighlightedProfessor] = useState(null);
  const professorRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/test.json") // Update to your local server
      .then((response) => response.json())
      .then((data) => setProfessors(data.professors || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = professors.filter((professor) =>
        professor.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (professor) => {
    setHighlightedProfessor(professor.id);
    setSearchTerm(professor.name);
    setSuggestions([]);

    if (professorRefs.current[professor.id]) {
      professorRefs.current[professor.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleProfessorClick = (professor) => {
    navigate("/professor", { state: { professor } });
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div>
      <Container>
        <TextField
          fullWidth
          label="Search Professors"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          style={{ marginBottom: "20px" }}
        />

        {suggestions.length > 0 && (
          <List
            style={{
              position: "absolute",
              backgroundColor: "white",
              zIndex: 1000,
              border: "1px solid #ccc",
              borderRadius: "5px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((professor) => (
              <ListItem
                button
                key={professor.id}
                onClick={() => handleSuggestionClick(professor)}
              >
                <ListItemText
                  primary={
                    <span>
                      <strong>
                        {professor.name.substring(0, searchTerm.length)}
                      </strong>
                      {professor.name.substring(searchTerm.length)}
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <h1>All Professors</h1>
        {professors.length === 0 ? (
          <p>No professors available. Please check back later.</p>
        ) : (
          professors.map((professor) => (
            <div
              key={professor.id}
              ref={(el) => (professorRefs.current[professor.id] = el)}
              onClick={() => handleProfessorClick(professor)}
              style={{
                padding: "20px 40px",
                marginBottom: "20px",
                backgroundColor:
                  highlightedProfessor === professor.id
                    ? "lightyellow"
                    : "var(--info-bg)",
                cursor: "pointer",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <h2>{professor.name}</h2>
                  <p>
                    <strong>Department:</strong> {professor.department}
                  </p>
                  <p>
                    <strong>University:</strong> {professor.university}
                  </p>
                  <p>
                    <strong>Overall Rating:</strong>{" "}
                    {calculateAverageRating(professor.reviews)}
                  </p>
                </Grid>
                <Grid item xs={12} md={6}>
                  <h3>Courses Taught:</h3>
                  <ul>
                    {professor.courses_taught &&
                    professor.courses_taught.length > 0 ? (
                      professor.courses_taught.map((course) => (
                        <li key={course.course_code}>
                          {course.course_name} ({course.course_code}) -{" "}
                          {course.semester}
                        </li>
                      ))
                    ) : (
                      <p>No courses listed</p>
                    )}
                  </ul>
                </Grid>
              </Grid>
            </div>
          ))
        )}
      </Container>
    </div>
  );
}


// import {
//   Container,
//   Grid,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";

// export default function Professors() {
//   const [professors, setProfessors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [highlightedProfessor, setHighlightedProfessor] = useState(null);
//   const professorRefs = useRef({});

//   useEffect(() => {
//     // Fetch data from the JSON file served by Flask
//     fetch("/test1.json")
//       .then((response) => response.json())
//       .then((data) => setProfessors(data.professors))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   const handleSearchChange = (event) => {
//     const value = event.target.value;
//     setSearchTerm(value);

//     if (value) {
//       const filteredSuggestions = professors.filter((professor) =>
//         professor.name.toLowerCase().startsWith(value.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (professor) => {
//     setHighlightedProfessor(professor.id);
//     setSearchTerm(professor.name);
//     setSuggestions([]);

//     // Scroll to the highlighted professor's div
//     if (professorRefs.current[professor.id]) {
//       professorRefs.current[professor.id].scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   };

//   return (
//     <div>
//       <Container>
//         <TextField
//           fullWidth
//           label="Search Professors"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           variant="outlined"
//           style={{ marginBottom: "20px" }}
//         />

//         {suggestions.length > 0 && (
//           <List
//             style={{
//               position: "absolute",
//               backgroundColor: "white",
//               zIndex: 1000,
//             }}
//           >
//             {suggestions.map((professor) => (
//               <ListItem
//                 button
//                 key={professor.id}
//                 onClick={() => handleSuggestionClick(professor)}
//               >
//                 <ListItemText primary={professor.name} />
//               </ListItem>
//             ))}
//           </List>
//         )}

//         <h1>All Professors</h1>
//         {professors.map((professor) => (
//           <div
//             key={professor.id}
//             ref={(el) => (professorRefs.current[professor.id] = el)}
//             style={{
//               border: "2px solid black",
//               padding: "20px 40px",
//               borderRadius: "5px",
//               marginBottom: "20px",
//               backgroundColor:
//                 highlightedProfessor === professor.id ? "lightyellow" : "white",
//             }}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <h2>{professor.name}</h2>
//                 <p>
//                   <strong>Department:</strong> {professor.department}
//                 </p>
//                 <p>
//                   <strong>University:</strong> {professor.university}
//                 </p>
//                 <p>
//                   <strong>Overall Rating:</strong> {professor.overall_rating}
//                 </p>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <h3>Courses Taught:</h3>
//                 <ul>
//                   {professor.courses_taught.map((course) => (
//                     <li key={course.course_code}>
//                       {course.course_name} ({course.course_code}) -{" "}
//                       {course.semester}
//                     </li>
//                   ))}
//                 </ul>
//               </Grid>
//             </Grid>
//           </div>
//         ))}
//       </Container>
//     </div>
//   );
// }
