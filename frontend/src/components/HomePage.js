import React from "react";
import { 
    BrowserRouter as Router, 
    Routes, 
    Link, 
    Redirect, 
    Route 
} from "react-router-dom";

import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from "./Room";

export default function HomePage(props) {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<div>This is the home page!</div>} />
                <Route path="/join" element={<JoinRoomPage />} />
                <Route path="/create" element={<CreateRoomPage />} />
                <Route path="/room/:roomCode" element={<Room />} />
            </Routes>
        </Router>
    );
}
