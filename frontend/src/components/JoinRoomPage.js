import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


export default function JoinRoomPage(props) {
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState("")
    const [error, setError] = useState("")

    const handleJoinRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: roomCode !== "" ? JSON.stringify({
                roomCode: roomCode,
            }) : null,
        };

        fetch("/api/join-room", requestOptions)
            .then(response => {
                if (response.ok) {
                    navigate("/room/" + roomCode);
                }

                return response.json();
            }).then(data => {
                setError("Message" in data ? data["Message"] : "");
            });
    }

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    error={error !== "" ? true : false}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={e => setRoomCode(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinRoomButtonPressed()}
                >
                    Join a Room
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    to="/"
                    component={Link}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}
