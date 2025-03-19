import Project from "./Project";
import { useState, useEffect } from "react";

// import { myDB } from "../db/myFireStore";

export default function ProjectsList() {
  // const [isUpdating, setIsUpdating] = useState(false);
  // let [projects, setProjects] = useState([]);

  // async function getProjects() {
  //   console.log("getting projects");
  //   const _projects = await myDB.getProjects();
  //   setProjects(_projects);
  // }

  // useEffect(() => {
  //   getProjects();
  // }, []);

  // let totalLikes = 0;

  // const projectsRendered = projects.map((p) => (
  //   <Project
  //     key={p.id}
  //     project={p}
  //     isUpdating={isUpdating}
  //     setLikes={async (newLikes) => {
  //       console.log("setting likes", p.id, p.likes);
  //       setIsUpdating(true);
  //       try {
  //         await myDB.updateProject(p.id, { likes: newLikes });
  //         getProjects();
  //       } catch (error) {
  //         console.error("Error updating project:", error);
  //       } finally {
  //         setIsUpdating(false);
  //       }
  //     }}
  //   />
  // ));

  return (
    <>
      {/* <div>ProjectsList</div> */}
      Total number of likes: {totalLikes}
      <ul>{projectsRendered}</ul>
    </>
  );
}
