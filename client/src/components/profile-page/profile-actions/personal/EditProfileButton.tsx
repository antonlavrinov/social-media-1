import React, { useContext } from "react";
import { CustomButton } from "../useStyles";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { Button } from "../../../../styled-components/global";

const EditProfileButton = () => {
  const { meUserData } = useContext(AuthContext);
  return (
    <Link to={`/profile/edit/${meUserData?._id}`}>
      <Button color="secondary" width="fullwidth">
        Редактировать
      </Button>
    </Link>
  );
};

export default EditProfileButton;
