import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";


export default function CreateRoomPage(props) {
    const navigate = useNavigate();

    const[defaultVotes, setDefaultVotes] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[votesToSkip, setVotesToSkip] = useState(defaultVotes);

    const handleCreateRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };

        fetch("/api/create-room", requestOptions)
            .then(response => response.json())
                .then(data => navigate("/room/" + data.code));
    };

    return (
    <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography 
                component={"h4"} 
                variant={"h4"}
            >
                Create a Room
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText
                    style={{
                        textAlign:"center"
                    }}
                >
                    Guest Control of Playback State
                </FormHelperText>

                <RadioGroup row 
                    defaultValue="true"
                    onChange={(e) => setGuestCanPause(e.target.value === "true" ? true : false)}
                >
                    <FormControlLabel 
                        value="true" 
                        control={<Radio color="primary" />}
                        label="Play/Pause"
                        labelPlacement="bottom"
                    />
                    <FormControlLabel 
                        value="false"
                        control={<Radio color="secondary" />}
                        label="No Control"
                        labelPlacement="bottom"
                    />
                </RadioGroup>
            </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
            <FormControl>
                <TextField
                    required={true}
                    type="number"
                    defaultValue={defaultVotes}
                    onChange={(e) => setVotesToSkip(e.target.value)}
                    inputProps={{
                        min: 1,
                        style: {textAlign:"center"},
                    }}
                />
                <FormHelperText
                    style={{
                        textAlign:"center"
                    }}
                >
                    Votes Required to Skip Song
                </FormHelperText>
            </FormControl>
        </Grid>
        
        <Grid item xs={12} align="center">
            <Button
                color="primary"
                variant="contained"
                onClick={handleCreateRoomButtonPressed}
            >
                Create a Room
            </Button>
        </Grid>

        <Grid item xs={12} align="center">
            <Button
                color="secondary"
                variant="contained"
                to="/"
                component={Link}
            >
                Back
            </Button>
        </Grid>
    </Grid>
    );
}
