import React from "react";
import { Link } from "react-router-dom";

import "./Repo.css";

export default () => (
    <Link className="Repo Repo-addBuild" to="/add-build">
        <div className="Repo-body"><h1 className="Repo-name">Add Build</h1></div>
    </Link>
);
