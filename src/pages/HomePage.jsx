import BaseTemplate from "../components/BaseTemplate.jsx";

import "./HomePage.css";

// import { myDB } from "../db/myFireStore.js";

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
