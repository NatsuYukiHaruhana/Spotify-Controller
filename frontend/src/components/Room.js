import React, { useState } from "react";
import {useParams} from "react-router-dom"

export default function Room(props) {

    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    
    const { roomCode: code } = useParams();

    const getRoomDetails = () => {
        fetch("/api/get-room?roomCode=" + code)
            .then(response => response.json())
                .then(data => {
                        setVotesToSkip(data.votes_to_skip);
                        setGuestCanPause(data.guest_can_pause);
                        setIsHost(data.is_host);
                    })
    }

    getRoomDetails()

    return (
        <div>
            <p>Room code: {code}</p>
            <p>Votes to skip: {votesToSkip}</p>
            <p>Guest can pause: {guestCanPause.toString()}</p>
            <p>Is host: {isHost.toString()}</p>
        </div>
    );
}
