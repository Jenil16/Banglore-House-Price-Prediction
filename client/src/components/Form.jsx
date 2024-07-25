import React, { useEffect, useState } from "react";
import "../styles/form.css";
import Navbar from "../components/Navbar";

const Form = () => {
  const [loc, setLoc] = useState([]);
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState("");
  const [bath, setBath] = useState("");
  const [pred, setPred] = useState(null);
  const [isvalid, setIsValid] = useState(false);

  const handleAreaChange = (e) => {
    if (e.target.value == "") {
      setArea(null);
      return;
    }
    setArea(parseFloat(e.target.value));
    setPred(null);
  };
  const handleBHKChange = (e) => {
    setBhk(parseInt(e.target.value));
    setPred(null);
  };
  const handleBathChange = (e) => {
    setBath(parseInt(e.target.value));
    setPred(null);
  };
  const handleLocChange = (e) => {
    setLocation(e.target.value);
    setPred(null);
  };

  const validateForm = () => {
    setIsValid(location && area && bhk && bath);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/predict_home_price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, area, bhk, bath }),
      });
      if (!response.ok) {
        throw new Error("Failed to calculate sum");
      }
      const data = await response.json();
      setPred(data.estimated_price);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetch("/api/get_location_names")
      .then((response) => response.json())
      .then((data) =>
        // console.log(data.locations),
        setLoc(data.locations)
      );
  }, []);

  return (
    <div className="topordercontainer">
      <div className="bgimage"></div>
      <Navbar className="navbar-cont" />
      <div className="bodycontainer">
        <div className="container">
          <form action="/" method="POST" onSubmit={handleOnSubmit}>
            <div className="section1">
              <div className="area">
                <label htmlFor="area">Area : </label>
                <input
                  type="text"
                  placeholder="(in sqft)"
                  id="area"
                  name="total_sqft"
                  value={area}
                  onChange={handleAreaChange}
                  onBlur={validateForm}
                />
                <br />
              </div>
              <div className="bhk">
                <label htmlFor="bhk">BHK :</label>
                <select
                  name="bhk"
                  id="bhk"
                  value={bhk}
                  onChange={handleBHKChange}
                  onBlur={validateForm}
                >
                  <option value="" hidden>
                    Select BHK
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <br />
              </div>
            </div>
            <div className="section2">
              <div className="bath">
                <label htmlFor="bath">Bath :</label>
                <select
                  name="bath"
                  id="bath"
                  value={bath}
                  onChange={handleBathChange}
                  onBlur={validateForm}
                >
                  <option value="" hidden>
                    Select Bath
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <br />
              </div>
              <div className="location">
                <label htmlFor="location">Location :</label>
                <select
                  name="location"
                  id="location"
                  value={location}
                  onChange={handleLocChange}
                  onBlur={validateForm}
                >
                  <option value="" hidden>
                    Select Location
                  </option>
                  {loc.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <br />
              </div>
            </div>
            <div className="submitbutton">
              <button type="submit" disabled={!isvalid}>
                Estimate
              </button>
            </div>
          </form>
          <div className="predictedamount">
            <label htmlFor="pred">Predicted amount : </label>
            <input
              type="text"
              value={pred !== null ? `${pred} Lakh` : ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
