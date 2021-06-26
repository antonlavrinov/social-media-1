import { useContext, useState, useEffect, useRef } from "react";
import { useStyles } from "./useStyles";
import styled from "styled-components";
import { useDebounce } from "../hooks/useDebounce";
import { useHttp } from "../hooks/useHttp";
import { AuthContext } from "../context/AuthContext";
import { IUserData } from "../interfaces/IUserData";
import { Link } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../assets//icons/looking-glass-icon.svg";
// import { AuthContext } from "../context/AuthContext";

import { Input } from "../styled-components/global";
import useOnClickOutside from "../hooks/useOnClickOutside";

const InputWrapper = styled.div`
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
  }
`;

const ResultsWrapper = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  border: var(--border-primary);
  box-shadow: var(--shadow-popup);
  border-radius: var(--border-radius-primary);
  background: white;
`;

const Result = styled(Link)`
  display: flex;
  padding: 15px 12px;
  align-items: center;
  border-top: var(--border-primary);
  :hover {
    background: var(--color-light-secondary);
  }
  :first-child {
    border-top: none;
  }
`;

const ResultAvatar = styled.img`
  /* min-width: 15px;
  min-height: 15px; */
  width: 20px;
  height: 20px;
  border-radius: 100px;
  margin-right: 10px;
`;
const ResultName = styled.div``;

type Props = {
  meUserData: null | IUserData;
};

const Search: React.FC<Props> = ({ meUserData }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setIsFocused(false);
  });
  const classes = useStyles();
  const { request } = useHttp();
  const [users, setUsers] = useState<IUserData[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const auth = useContext(AuthContext);

  const [inputText, setInputText] = useState<string>("");

  const debouncedText = useDebounce(inputText, 250);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    if (debouncedText) {
      request(`/api/search/users?search=${debouncedText}`, "GET")
        .then((res) => {
          console.log("search res", res);
          // const filtered = res.users.filter(
          //   (el: IUserData) => el._id !== auth.userData?._id
          // );
          setUsers(res.users);
        })
        .catch((err) => console.log(err));
    } else {
      setUsers([]);
    }
  }, [debouncedText]);

  const handleClose = () => {
    setInputText("");
    setUsers([]);
  };

  return (
    <>
      <InputWrapper
        ref={ref}
        onClick={() => {
          if (!isFocused) {
            setIsFocused(true);
          }
        }}
      >
        <SearchIcon />
        <Input
          style={{ fontSize: "var(--text-size-secondary)" }}
          placeholder="Search..."
          value={inputText}
          onChange={handleChange}
          paddingLeft="35px"
          // onFocus={() => setIsFocused(true)}
          // onBlur={() => setIsFocused(false)}
        />
        {users.length !== 0 && isFocused && (
          <ResultsWrapper>
            {users.map((user) => {
              // console.log(user._id);
              // if (user._id === meUserData?._id) {
              //   console.log("me", user._id);
              //   return;
              // }
              return (
                <Result
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={() => {
                    setIsFocused(false);
                    setInputText("");
                  }}
                >
                  <ResultAvatar src={user.avatar} />
                  <ResultName>
                    {user.firstName} {user.lastName}
                  </ResultName>
                </Result>
              );
            })}
          </ResultsWrapper>
        )}
      </InputWrapper>
    </>
  );
};

export default Search;
