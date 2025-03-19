import React, { useState } from "react";

export default function Project({ project, setLikes, isUpdating }) {
  const style = {
    fontSize: `${project.fs + project.likes}pt`,
    transition: "all 1s",
  };

  const onButtonClick = async () => {
    await setLikes(project.likes + 1);
  };

  return (
    <div>
      <li style={style}>
        {project.name} : {project.value}
      </li>
      Likes : {project.likes}
      <button onClick={onButtonClick} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Like"}
      </button>
    </div>
  );
}
