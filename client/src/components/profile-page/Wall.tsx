import React, { useState } from "react";

import Post from "./post/Post";

type WallProps = {
  data: any[];
};

const Wall: React.FC<WallProps> = ({ data }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  // console.log("data wall", data);

  return (
    <>
      {data.map((post) => {
        // console.log(date);

        return (
          <Post
            key={post._id}
            post={post}
            setEditMode={setEditMode}
            editMode={editMode}
          />
        );
      })}
    </>
  );
};

export default Wall;
