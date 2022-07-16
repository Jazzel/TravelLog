import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import { useEffect, useState } from "react";

import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";

import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";

export const HOST = "http://localhost:8800/api";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(0);

  const [zoom, setZoom] = useState(4);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(`${HOST}/pins`);
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      long: lng,
      lat: lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(`${HOST}/pins`, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App">
      <ReactMapGL
        initialViewState={{
          longitude: 43,
          latitude: 2,
          zoom: zoom,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={(e) => handleAddClick(e)}
        onZoom={(e) => setZoom(e.target.getZoom())}
      >
        {pins.map((pin) => {
          return (
            <>
              <Marker
                latitude={pin.lat}
                longitude={pin.long}
                anchor="bottom"
                offsetLeft={-3.5 * zoom}
                offsetTop={-7 * zoom}
              >
                <RoomIcon
                  style={{
                    fontSize: zoom * 7,
                    cursor: "pointer",
                    color:
                      pin.username === currentUser ? "tomato" : "slateblue",
                  }}
                  onClick={() => handleMarkerClick(pin._id)}
                />
              </Marker>
              {pin._id === currentPlaceId && (
                <Popup
                  closeButton={true}
                  closeOnClick={false}
                  longitude={pin.long}
                  latitude={pin.lat}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p>{pin.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(pin.rating).fill(<StarIcon className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{pin.username}</b>
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          );
        })}
        {newPlace && (
          <Popup
            closeButton={true}
            closeOnClick={false}
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  value={title}
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Say something about this place"
                />
                <label>Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
