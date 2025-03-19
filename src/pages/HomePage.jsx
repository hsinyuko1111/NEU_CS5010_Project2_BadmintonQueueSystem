import ProjectsList from "../components/ProjectsList.jsx";
import BaseTemplate from "../components/BaseTemplate.jsx";

import "./HomePage.css";

// import { myDB } from "../db/myFireStore.js";
import { useState, useEffect } from "react";

export default function HomePage() {
  // const [projectsPromise, setProjectsPromise] = useState(null);
  // useEffect(() => {
  //   const projectsPromise = myDB.getProjects();
  //   setProjectsPromise(projectsPromise);
  // }, []);

  return (
    <BaseTemplate>
      {/* <div className="HomePage">
        <div>Projects</div>
        <ProjectsList projectsPromise={projectsPromise} />
      </div> */}
    </BaseTemplate>
  );
}
