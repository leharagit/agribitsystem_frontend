import React from "react";
import { Link, useParams } from "react-router-dom";
import "./MyGigs.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  

    return (
      <main className="dashboard">
          <h2>Overview</h2>
          <div className="cards">
              <div className="card">
                  <h3>Total Bids</h3>
                  <p>150</p>
              </div>
              <div className="card">
                  <h3>Active Farmers</h3>
                  <p>75</p>
              </div>
              <div className="card">
                  <h3>Pending Requests</h3>
                  <p>20</p>
              </div>
          </div>
      </main>
  );
}

export default MyGigs;









