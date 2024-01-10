
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

import { Home } from "./components/home/index";
import { Feedback } from "./components/feedback/index";
import { Sentiment } from "./components/sentiments/sentiment";

function App() {

  const theme = createTheme({
    palette: {
      mode: "dark"
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route> 
            <Route path="/" element={<Home />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/sentiment" element={<Sentiment />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;