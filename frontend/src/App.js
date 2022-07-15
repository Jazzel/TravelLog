import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import { useEffect, useState } from "react";

import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";

import "./App.css";

function App() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        setPins(res.data);
        console.log(pins);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="App">
      <ReactMapGL
        initialViewState={{
          longitude: 43,
          latitude: 2,
          zoom: 3.5,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {pins.map((pin) => {
          console.log(pin);
          return (
            <>
              <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
                <RoomIcon style={{ fontSize: "3rem" }} />
              </Marker>
              <Popup longitude={pin.long} latitude={pin.lat} anchor="left">
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p>{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            </>
          );
        })}
      </ReactMapGL>
    </div>
  );
}

export default App;
