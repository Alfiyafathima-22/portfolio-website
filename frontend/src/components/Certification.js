import React, { useEffect, useState } from "react";
import axios from "axios";

function Certification() {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/certifications")
      .then((res) => {
        console.log("API RESPONSE:", res.data);

        const data = res.data.certifications || res.data || [];
        setCertifications(data);
      })
      .catch((err) => {
        console.log("API ERROR:", err);
        setCertifications([]);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Certifications</h2>

      {/* Debug */}
      <h3>Total Certificates: {certifications.length}</h3>

      <pre>
        {JSON.stringify(certifications, null, 2)}
      </pre>

      {certifications.length === 0 && (
        <p>No certificates found</p>
      )}

      {certifications.map((cert) => (
        <div
          key={cert._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px"
          }}
        >
          <h3>{cert.title}</h3>

          <p>
            <strong>Issuer:</strong> {cert.issuer}
          </p>

          <p>
            <strong>Date:</strong> {cert.date}
          </p>

          {cert.link && (
            <button
              onClick={() => window.open(cert.link, "_blank")}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "5px"
              }}
            >
              View Certificate
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Certification;