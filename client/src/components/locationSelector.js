import React, { useState, useEffect } from 'react';
import axios from 'axios';
import   "./locationSelector.css"

export default function LocationSelector({ onLocationChange }) {
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [upazillas, setUpazillas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8000/locations");
        setLocations(response.data);
        const uniqueDivisions = [
          ...new Set(response.data.map((item) => item.DIVISION)),
        ];
        setDivisions(uniqueDivisions);
      } catch (error) {
        console.error("There was an error fetching the locations:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDivision) {
      const districtsForDivision = [
        ...new Set(
          locations
            .filter((loc) => loc.DIVISION === selectedDivision)
            .map((loc) => loc.DISTRICT)
        ),
      ];
      setDistricts(districtsForDivision);
      setSelectedDistrict("");
      setUpazillas([]);
    }
  }, [selectedDivision]);

  useEffect(() => {
    if (selectedDistrict) {
      const upazillasForDistrict = locations
        .filter((loc) => loc.DISTRICT === selectedDistrict)
        .map((loc) => loc.UPAZILLA);
      setUpazillas(upazillasForDistrict);
    }
  }, [selectedDistrict]);


  const handleUpazillaChange = (e) => {

    const selectedUpazilla = e.target.value;
    console.log(selectedUpazilla);
    
    const correspondingLocation = locations.find(loc => loc.UPAZILLA === selectedUpazilla);
    console.log(correspondingLocation);
    if (correspondingLocation && correspondingLocation.ID) {
      onLocationChange(correspondingLocation.ID);
    } else {
      console.error("Unable to find locationID for selected Upazilla:", selectedUpazilla);
      onLocationChange(null);  // or you can choose to not set anything
    }
};


  return (
    <div className="App">
      <div className="location-selector">
        <select
        className="form-control"
          onChange={(e) => setSelectedDivision(e.target.value)}
          value={selectedDivision}
        >
          <option value="">Select Division</option>
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>

        <select
        className="form-control"
          onChange={(e) => setSelectedDistrict(e.target.value)}
          value={selectedDistrict}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>



       <select 
       className="form-control"
       onChange={handleUpazillaChange}>
          <option value="">Select Upazilla</option>
          {upazillas.map((upazilla) => (
            <option key={upazilla} value={upazilla}>
              {upazilla}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';

// export default function LocationSelector({ onLocationChange }) {
//   // ... [rest of the code remains unchanged]

//   const handleUpazillaChange = (e) => {
//     const selectedUpazilla = e.target.value;
//     const correspondingLocation = locations.find(loc => loc.UPAZILLA === selectedUpazilla);
//     if (correspondingLocation) {
//       onLocationChange(correspondingLocation.locationID);
//     }
//   };

//   return (
//     <div className="App">
//       <div className="location-selector">
//         {/* ... [rest of the select components remain the same] */}
        
//         <select onChange={handleUpazillaChange}>
//           <option value="">Select Upazilla</option>
//           {upazillas.map((upazilla) => (
//             <option key={upazilla} value={upazilla}>
//               {upazilla}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
