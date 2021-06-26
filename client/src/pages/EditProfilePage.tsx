import React, { useState, useContext, useRef } from "react";

import { useHttp } from "../hooks/useHttp";
import { AuthContext } from "../context/AuthContext";
import useNotistack from "../hooks/useNotistack";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow-more-icon.svg";

import styled from "styled-components";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Modal from "@material-ui/core/Modal";
import Select from "react-select";
import {
  Input,
  TextArea,
  Button,
  ContentBox,
  ContentBoxContainer,
  Separator,
} from "../styled-components/global";
import { useUploadImages } from "../hooks/useUploadImages";
import Spinner from "../components/Spinner";
import Tippy from "@tippyjs/react";
import { useTippyVisibility } from "../hooks/useTippyVisibility";
import Resizer from "react-image-file-resizer";
import { useEffect } from "react";

export interface IUser {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | ArrayBuffer | null;
  city?: string;
  aboutMe?: string;
  dateOfBirth?: string;
  gender?: string;
}

const ImageUpload = styled.div<{
  image?: string | ArrayBuffer | null | undefined;
}>`
  width: 100px;
  height: 100px;
  /* margin: 0 auto; */
  border-radius: 100px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  position: relative;
  overflow: hidden;
  background: var(--color-secondary);

  ${(props) =>
    props.image &&
    `
    background: url(${props.image});
    background-size: cover;
    background-position: center center;
  `}
  svg {
    display: none;
    width: 35px;
    height: 35px;
  }
  :hover {
    cursor: pointer;
    div {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      display: block;
      fill: white;
    }
  }
`;

const ImageLoading = styled.div`
  width: 100px;
  height: 100px;
  /* margin: 0 auto; */
  border-radius: 100px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditField = styled.div`
  display: flex;
  position: relative;
`;

const EditTitle = styled.div`
  min-width: 70px;
  text-align: right;
  margin-right: 20px;
  color: var(--text-color-secondary);
`;
const EditContent = styled.div`
  margin-bottom: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-family: var(--font-family-secondary);
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  letter-spacing: 0;
`;

const SelectBox = styled.div`
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  padding: 8px 13px;
  display: flex;
  /* justify-content: flex-end; */
  align-items: center;
  svg {
    margin-left: auto;
  }
`;

const EditProfilePage = () => {
  const auth = useContext(AuthContext);
  const { handlePageNotification } = useNotistack();
  const { firstName, lastName, avatar, dateOfBirth, gender, aboutMe, city } =
    auth.meUserData!;
  const [credentials, setCredentials] = useState<any>({
    avatar,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    aboutMe,
    city,
  });
  // const [birthday, setBirthday] = useState({
  //   day: 0,
  //   month: 0,
  //   year: 0,
  // });
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const { error, request, loading } = useHttp();
  const { visible, show, hide } = useTippyVisibility();
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const ref = useRef<null | HTMLInputElement>(null);

  // const [selectedDate, setSelectedDate] = React.useState<any | null>(
  //   new Date("2014-08-18T21:11:54")
  // );

  // const handleDateChange = (date: any | null) => {
  //   setSelectedDate(date);
  // };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedDayOption, setSelectedDayOption] = useState<any>({
    value: new Date(credentials.dateOfBirth)?.getDate(),
    label: new Date(credentials.dateOfBirth)?.getDate(),
  });

  const [selectedMonthOption, setSelectedMonthOption] = useState<any>({
    value: new Date(credentials.dateOfBirth)?.getMonth(),
    label: months[new Date(credentials.dateOfBirth)?.getMonth()],
  });

  const [selectedYearOption, setSelectedYearOption] = useState<any>({
    value: new Date(credentials.dateOfBirth)?.getFullYear(),
    label: new Date(credentials.dateOfBirth)?.getFullYear(),
  });

  const handleDayChange = (date: any | null) => {
    setSelectedDayOption(date);
    setReadyToSubmit(true);
  };
  const handleMonthChange = (date: any | null) => {
    setSelectedMonthOption(date);
    setReadyToSubmit(true);
  };

  const handleYearChange = (date: any | null) => {
    setSelectedYearOption(date);
    setReadyToSubmit(true);
  };

  type OptionType = {
    value: string;
    label: string;
  };

  const genderOptions: OptionType[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const dayOptions: OptionType[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
  ];

  const monthOptions: OptionType[] = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const yearOptions: OptionType[] = [
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
    { value: "2017", label: "2017" },
    { value: "2016", label: "2016" },
    { value: "2015", label: "2015" },
    { value: "2014", label: "2014" },
    { value: "2013", label: "2013" },
    { value: "2012", label: "2012" },
    { value: "2011", label: "2011" },
    { value: "2010", label: "2010" },
    { value: "2009", label: "2009" },
    { value: "2008", label: "2008" },
    { value: "2007", label: "2007" },
    { value: "2006", label: "2006" },
    { value: "2005", label: "2005" },
    { value: "2004", label: "2004" },
    { value: "2003", label: "2003" },
    { value: "2002", label: "2002" },
    { value: "2001", label: "2001" },
    { value: "2000", label: "2000" },
    { value: "1999", label: "1999" },
    { value: "1998", label: "1998" },
    { value: "1997", label: "1997" },
    { value: "1996", label: "1996" },
    { value: "1995", label: "1995" },
    { value: "1994", label: "1994" },
    { value: "1993", label: "1993" },
    { value: "1992", label: "1992" },
    { value: "1991", label: "1991" },
    { value: "1990", label: "1990" },
    { value: "1989", label: "1989" },
    { value: "1988", label: "1988" },
    { value: "1987", label: "1987" },
    { value: "1986", label: "1986" },
    { value: "1985", label: "1985" },
    { value: "1984", label: "1984" },
    { value: "1983", label: "1983" },
    { value: "1982", label: "1982" },
    { value: "1981", label: "1981" },
    { value: "1980", label: "1980" },
    { value: "1979", label: "1979" },
    { value: "1978", label: "1978" },
    { value: "1977", label: "1977" },
    { value: "1976", label: "1976" },
    { value: "1975", label: "1975" },
    { value: "1974", label: "1974" },
    { value: "1973", label: "1973" },
    { value: "1972", label: "1972" },
    { value: "1971", label: "1971" },
    { value: "1970", label: "1970" },
    { value: "1969", label: "1969" },
    { value: "1968", label: "1968" },
    { value: "1967", label: "1967" },
    { value: "1966", label: "1966" },
    { value: "1965", label: "1965" },
    { value: "1964", label: "1964" },
    { value: "1963", label: "1963" },
    { value: "1962", label: "1962" },
    { value: "1961", label: "1961" },
    { value: "1960", label: "1960" },
    { value: "1959", label: "1959" },
    { value: "1958", label: "1958" },
    { value: "1957", label: "1957" },
    { value: "1956", label: "1956" },
    { value: "1955", label: "1955" },
    { value: "1954", label: "1954" },
    { value: "1953", label: "1953" },
    { value: "1952", label: "1952" },
    { value: "1951", label: "1951" },
    { value: "1950", label: "1950" },
    { value: "1949", label: "1949" },
    { value: "1948", label: "1948" },
    { value: "1947", label: "1947" },
    { value: "1946", label: "1946" },
    { value: "1945", label: "1945" },
    { value: "1944", label: "1944" },
    { value: "1943", label: "1943" },
    { value: "1942", label: "1942" },
    { value: "1941", label: "1941" },
    { value: "1940", label: "1940" },
    { value: "1939", label: "1939" },
    { value: "1938", label: "1938" },
  ];

  const [selectedGenderOption, setSelectedGenderOption] = useState<any>({
    value: auth.meUserData?.gender,
    label: `${
      auth.meUserData?.gender ? auth.meUserData?.gender[0].toUpperCase() : ""
    }${auth.meUserData?.gender ? auth.meUserData?.gender.slice(1) : ""}`,
  });

  const handleSelectedChange = (selectedOption: any) => {
    setSelectedGenderOption(selectedOption);
    setReadyToSubmit(true);
    // console.log(`Option selected:`, selectedOption);
  };

  console.log("selectedGenderOption", selectedGenderOption);
  console.log("gender", auth.meUserData?.gender);

  // useEffect(() => {
  //   setSelectedGenderOption(auth.meUserData?.gender);
  // }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // console.log("submit");
      console.log(
        "submit",
        new Date(
          Number(selectedYearOption.value),
          Number(selectedMonthOption.value),
          Number(selectedDayOption.value)
        ),
        selectedYearOption,
        selectedMonthOption,
        selectedDayOption,
        new Date(2017, 4, 32)
      );
      const data = await request(`/api/user/${auth.meUserData!._id}`, "PUT", {
        ...credentials,
        gender: selectedGenderOption.value,
        dateOfBirth: new Date(
          selectedYearOption.value,
          selectedMonthOption.value,
          selectedDayOption.value
        ),
      });

      const notification = {
        text: data.message,
        type: "success",
      };
      auth.setMeUserData((prevState: any) => {
        return {
          ...prevState,
          ...credentials,
        };
      });
      handlePageNotification(notification);
      setReadyToSubmit(false);

      // console.log(data);

      // auth.login(data.accessToken, data.userData);
    } catch (e) {
      const notification = {
        text: e.message,
        type: "error",
      };
      handlePageNotification(notification);
      // console.log("request", e);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    // console.log(e.target.name);
    setReadyToSubmit(true);
  };

  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        600,
        "JPEG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarLoading(true);
      const file = e.target.files[0];
      const resized = await resizeFile(file);
      try {
        const res = await request("/api/upload-image", "POST", {
          image: resized,
        });
        console.log("image upload res", res);
        setCredentials({
          ...credentials,
          avatar: res.url,
        });
        setAvatarLoading(false);
      } catch (e) {
        console.log(e);
        setAvatarLoading(false);
      }

      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = async () => {

      // };
      setReadyToSubmit(true);
    }
  };

  const selectPopup = (
    <ContentBox
      onClick={hide}
      style={{
        minWidth: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      dsffdfd
      {/* <EditPostPopup>
        <EditPostPopupSelect onClick={() => handleEditMode(true)}>
          Редактировать
        </EditPostPopupSelect>

        <EditPostPopupSelect onClick={handleDeletePost}>
          Удалить
        </EditPostPopupSelect>
      </EditPostPopup> */}
    </ContentBox>
  );

  return (
    <ContentBox style={{ maxWidth: "480px" }}>
      <ContentBoxContainer>
        <Title>Edit profile</Title>
      </ContentBoxContainer>
      <Separator />
      <ContentBoxContainer style={{ padding: "30px" }}>
        <form noValidate onSubmit={handleSubmit}>
          <EditField>
            <EditTitle>Avatar:</EditTitle>
            <EditContent style={{ display: "flex" }}>
              {avatarLoading ? (
                <ImageLoading>
                  <Spinner />
                </ImageLoading>
              ) : (
                <label>
                  <ImageUpload image={credentials.avatar}>
                    <div>
                      <PhotoCameraIcon />
                    </div>
                  </ImageUpload>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChangeAvatar}
                    ref={ref}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </EditContent>
          </EditField>
          <EditField>
            <EditTitle>Name:</EditTitle>
            <EditContent style={{ display: "flex" }}>
              <Input
                name="firstName"
                id="firstName"
                value={credentials.firstName}
                onChange={handleChange}
                disabled={loading}
                style={{ marginRight: "10px" }}
              />

              <Input
                name="lastName"
                id="lastName"
                value={credentials.lastName}
                onChange={handleChange}
                disabled={loading}
              />
            </EditContent>
          </EditField>

          <EditField>
            <EditTitle>Gender:</EditTitle>
            <EditContent>
              <Select
                value={selectedGenderOption}
                onChange={handleSelectedChange}
                options={genderOptions}
                placeholder="Select gender"
                defaultValue={auth.meUserData?.gender}
                className={"customSelect"}
                classNamePrefix={"customSelectInner"}
              />
            </EditContent>
          </EditField>
          <EditField>
            <EditTitle>Birthday:</EditTitle>
            <EditContent
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Select
                value={selectedDayOption}
                onChange={handleDayChange}
                options={dayOptions}
                placeholder="Select gender"
                // defaultValue={credentials.dateOfBirth.getDate()}
                className={"daySelect"}
                classNamePrefix={"customSelectInner"}
                // style={{ flexGrow: 1 }}
              />
              <Select
                value={selectedMonthOption}
                onChange={handleMonthChange}
                options={monthOptions}
                placeholder="Select gender"
                // defaultValue={{
                //   value: credentials.dateOfBirth.getMonth(),
                //   label: "sd",
                // }}
                className={"monthSelect"}
                classNamePrefix={"customSelectInner"}
                // style={{ flexGrow: 1 }}
              />
              <Select
                value={selectedYearOption}
                onChange={handleYearChange}
                options={yearOptions}
                placeholder="Select gender"
                // defaultValue={credentials.dateOfBirth.getFullYear()}
                className={"yearSelect"}
                classNamePrefix={"customSelectInner"}
                // style={{ flexGrow: 1 }}
              />
            </EditContent>
          </EditField>
          <EditField>
            <EditTitle>City:</EditTitle>
            <EditContent>
              <Input
                name="city"
                id="city"
                value={credentials.city}
                onChange={handleChange}
                disabled={loading}
                // style={{ maxWidth: "100%", display: "block" }}
              />
            </EditContent>
          </EditField>
          <EditField>
            <EditTitle>About me:</EditTitle>
            <EditContent>
              <TextArea
                $focuse={true}
                name="aboutMe"
                id="aboutMe"
                value={credentials.aboutMe}
                onChange={handleChange}
                disabled={loading}
                style={{ width: "100%", resize: "none" }}
              />
            </EditContent>
          </EditField>

          {/* <Input
              name="city"
              id="city"
              value={credentials.city}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              id="gender"
              name="gender"
              select
              label="Select gender"
              value={credentials.gender}
              onChange={handleChange}
              style={{ width: "100%" }}
              // helperText="Please select gender"
              variant="outlined"
            >
              {["Male", "Femaile"].map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField> */}

          {/* <Grid item xs={12}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid> */}
          <EditField>
            <EditTitle></EditTitle>
            <EditContent>
              <Button
                size="small"
                type="submit"
                disabled={loading || !readyToSubmit}
              >
                Сохранить
              </Button>
            </EditContent>
          </EditField>
        </form>
      </ContentBoxContainer>
    </ContentBox>
  );
};

export default EditProfilePage;
