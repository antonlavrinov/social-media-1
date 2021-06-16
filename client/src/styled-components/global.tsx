import styled, { css } from "styled-components";
import { createGlobalStyle } from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";

export const GlobalStyle = createGlobalStyle`
body {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  letter-spacing: .05em;
  font-family: 'Roboto', sans-serif;
  font-family: 'Open Sans', sans-serif;
  font-family: 'Noto Sans', sans-serif;
  font-family: 'Ubuntu', sans-serif;
  font-family: 'Rubik', sans-serif;
  font-family: "Segoe UI", sans-serif;
  line-height: 1.35;
  letter-spacing: 0.05rem;
  
  
  font-size: var(--text-size-primary);
  /* font-weight: 500; */
  color: #45557A;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  width: 100%;
}

input, input:hover, input:active, input:focus {
  outline: none;
}

textarea, textarea:hover, textarea:active, textarea:focus {
  outline: none;
}

img {
  -ms-flex-item-align: start;
      -ms-grid-row-align: start;
      align-self: start;
}

p {
  margin: 0;
  padding: 0;
}

ul, li {
  display: block;
  padding: 0;
  margin: 0;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

div, p, a, span, input, form, button {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

a, a:hover {
  text-decoration: none;
  color: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  font-size: inherit;
}

button {
  border: none;
}

button:focus {
  outline: none;
}

ul, li {
  display: block;
  padding: 0;
  margin: 0;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

footer {
  margin-top: auto;
}

.customSelect {
  /* border: var(----border-primary); */
  
  
  :focus {
    outline: none;
  }
  :active {
    outline: none;
  }
}

.daySelect {
  /* border: var(--border-primary); */
  flex-grow: 1;
  margin-right: 10px;
}

.monthSelect {
  /* border: var(--border-primary); */
  flex-grow: 10;
  margin-right: 10px;
}

.yearSelect {
  /* border: var(--border-primary); */
  flex-grow: 2;
}

.customSelectInner__control {
  border: var(--border-primary) !important;
  :focus {
    outline: none;
  }
  :active {
    outline: none;
  }
}

.customSelectInner__indicator-separator {
  display: none;
}
.customSelectInner__indicator {
  svg {
    fill: var(--text-color-secondary);
    width: 17px;
    height: 17px;
  }
}


.react-responsive-modal-root {
  padding-right: 15px !important;
}

.customOverlay {
    background: rgba(93, 102, 122, 0.6) !important;
    padding: 0 !important;
    padding-right: 15px !important;
    /* filter: blur(4px); */
  }

  .customModal {
    border-radius: var(--border-radius-primary);
    background: white;
    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
    margin: 0;
    padding: 0;
    overflow-y: visible;

  }


  * {
    --color-primary: #2965F1;
    --color-secondary: #EFF2F9;
    --color-dark-secondary: rgb(211, 218, 235);
    --color-light-secondary: #DFE5F3;
    --color-dark-primary: rgb(18, 62, 165);
    --color-green: #00E296;
    --color-dark-grey: #303030;
    --color-grey: #616161;
    --color-red: #FF3366;
    --color-black: #324164;


    --text-color-secondary: #ACB7D1;
    --text-color-dark-secondary: #45557A;
    --text-color-primary: var(--color-black);
    --text-color-link: var(--color-primary);



    --font-size-primary: 15px;

    --font-size-secondary: 16px;
    --font-family-primary: Open Sans, sans-serif;
    /* --font-family-primary: Roboto, sans-serif; */
    --font-family-secondary: Montserrat, sans-serif;

    --shadow-primary: 0 5px 5px rgba(211, 218, 235, 0.5);
    --shadow-popup: 0 5px 5px rgba(211, 218, 235, 0.5);
    /* --shadow-popup_dark */

    --border-radius-primary: 5px;
    --border-primary: 1px solid var(--text-color-secondary);

    --text-size-primary: 14px;
    --text-size-secondary: 16px;
    --text-size-button: 14px;

    --icon-size-primary: 25px;
    --icon-size-primary_blue: 25px;
    --icon-size-secondary: 16px;

    --icon-color-primary: var(--color-primary);
    --icon-color-secondary: var(--text-color-secondary);

    --z-index-popup: 100;


  }

`;

export const svgPrimaryStyle = css`
  width: var(--icon-size-primary);
  height: var(--icon-size-primary);
  fill: var(--text-color-secondary);
  :hover {
    cursor: pointer;
    fill: var(--text-color-dark-secondary);
  }
`;

export const svgPrimaryStyleNoHover = css`
  width: var(--icon-size-primary);
  height: var(--icon-size-primary);
  fill: var(--text-color-secondary);
`;

export const svgSecondaryStyle = css`
  width: var(--icon-size-secondary);
  height: var(--icon-size-secondary);
  fill: var(--text-color-secondary);
  :hover {
    cursor: pointer;
    fill: var(--text-color-dark-secondary);
  }
`;

export const CustomLink = styled(Link)<{ color?: "black" }>`
  color: var(--color-primary);
  font-weight: 600;

  :hover {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: underline;
  }
  ${(props) =>
    props.color === "black" &&
    `
      color: var(--color-black);
      :hover {
        color: var(--color-black);
      }
  `}
`;

export const CustomDate = styled.div`
  color: var(--text-color-secondary);
`;

export const Button = styled.button<{
  size?: "small";
  color?: "secondary";
  width?: "fullwidth";
  marginBottom?: string;
  marginTop?: string;
  marginRight?: string;
  marginLeft?: string;
}>`
  /* display: inline-flex; */
  border-radius: var(--border-radius-primary);
  font-size: var(--font-size-secondary);
  padding: 12px 20px;
  background: var(--color-primary);
  color: white;
  :hover {
    background: var(--color-dark-primary);
    cursor: pointer;
  }
  :disabled {
    background: var(--color-secondary);
    color: var(--text-color-secondary);
    :hover {
      background: var(--color-secondary);
      cursor: default;
    }
  }

  ${(props) =>
    props.size === "small" &&
    `
    padding: 7px 20px;
    font-size: var(--text-size-primary);
  `}
  ${(props) =>
    props.width === "fullwidth" &&
    `
    width: 100%;
  `}
  ${(props) =>
    props.color === "secondary" &&
    `
        background: var(--color-secondary);
        color: var(--text-color-dark-secondary);
        // border: 1px solid var(--color-dark-secondary);
        :hover {
            background: var(--color-dark-secondary);
        }
    `}
  ${(props) =>
    props.marginBottom &&
    `
    margin-bottom: ${props.marginBottom};
  `}
    ${(props) =>
    props.marginTop &&
    `
    margin-top: ${props.marginTop};
  `}
    ${(props) =>
    props.marginRight &&
    `
    margin-right: ${props.marginRight};
  `}
`;
export const ContentBox = styled.div<{ marginBottom?: string }>`
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  box-shadow: var(--shadow-primary);

  background: white;
  ${(props) =>
    props.marginBottom &&
    `
    margin-bottom: ${props.marginBottom};
  `}
`;

export const ContentBoxContainer = styled.div`
  padding: 15px;
`;

export const Input = styled.input<{ paddingLeft?: string }>`
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  padding: 8px 10px;
  /* font-size: var(--text-size-secondary); */
  font-size: var(--text-size-primary);
  width: 100%;
  ::placeholder {
    color: var(--text-color-secondary);
  }
  ${(props) =>
    props.paddingLeft &&
    `
    padding-left: ${props.paddingLeft};
  `}//35px
`;

export const TextArea = styled(TextareaAutosize)<{
  $focuse?: boolean;
  marginBottom?: string;
}>`
  border: 1px solid white;
  border-radius: var(--border-radius-primary);
  padding: 11px;
  padding-right: 35px;
  width: 100%;
  position: relative;
  font-size: var(--text-size-primary);
  ::placeholder {
    color: var(--text-color-secondary);
  }
  ${(props) =>
    props.$focuse &&
    `
    border: var(--border-primary);
  `}
  ${(props) =>
    props.marginBottom &&
    `
    margin-bottom: ${props.marginBottom};
  `}
`;
export const Separator = styled.div`
  border-top: var(--border-primary);
  width: 100%;
  /* background: var(--text-color-secondary); */
`;

export const Avatar = styled.img<{
  size: "small" | "medium" | "large" | "extra-small" | "medium-small";
  marginBottom?: string;
  marginTop?: string;
  marginRight?: string;
  marginLeft?: string;
  // onlineType?: boolean;
}>`
  border-radius: 150px;
  object-fit: cover;
  ${(props) =>
    props.size === "extra-small" &&
    `
    width: 25px;
    height: 25px;
    min-width: 25px;
    min-height: 25px;
  `}
  ${(props) =>
    props.size === "small" &&
    `
    width: 35px;
    height: 35px;
    min-width: 35px;
    min-height: 35px;
  `}
    ${(props) =>
    props.size === "medium-small" &&
    `
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  `}
  ${(props) =>
    props.size === "medium" &&
    `
    width: 53px;
    height: 53px;
    min-width: 53px;
    min-height: 53px;
  `}
    ${(props) =>
    props.size === "large" &&
    `
    width: 150px;
    height: 150px;
    min-width: 150px;
    min-height: 150px;
  `}
    ${(props) =>
    props.marginBottom &&
    `
    margin-bottom: ${props.marginBottom};
  `}
      ${(props) =>
    props.marginTop &&
    `
    margin-top: ${props.marginTop};
  `}
      ${(props) =>
    props.marginRight &&
    `
    margin-right: ${props.marginRight};
  `}
      ${(props) =>
    props.marginLeft &&
    `
    margin-left: ${props.marginLeft};
  `}
`;

export const PopupPrimary = styled.div`
  background: white;
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  padding: 10px;
`;

export const OptionsPopup = styled.div``;

export const OptionsPopupSelect = styled.div`
  display: flex;
  padding: 15px 15px;
  align-items: center;
  border-top: var(--border-primary);

  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
  :first-child {
    border-top: none;
  }
`;

export const NotificationsCount = styled.div<{ top?: string; right?: string }>`
  background: var(--color-red);
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  position: absolute;
  top: 13px;
  right: 7px;
  border-radius: 100px;
  color: white;
  ${(props) =>
    props.top &&
    `
    top: ${props.top};
  `}
  ${(props) =>
    props.right &&
    `
    right: ${props.right};
  `} /* font-size: 11px; */
`;

export const AvatarOnlineWrapper = styled.div<{ onlineType?: boolean }>`
  ${(props) =>
    props.onlineType &&
    `
  position: relative;
  :after {
    content: '';
    background: var(--color-green);
    width: 10px;
    height: 10px;
    border-radius: 100px;
    position: absolute;
    bottom: 3px;
    right: 15px;
    border: 2px solid white;
  }
`}
`;
