import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import styled from "styled-components";
import { ReactComponent as EmojiIcon } from "../assets/icons/emoji-icon.svg";
import {
  ContentBox,
  PopupPrimary,
  svgPrimaryStyle,
} from "../styled-components/global";

const EmojiWrapper = styled.div`
  position: relative;
`;

const EmojiPopup = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;

  span {
    :hover {
      cursor: pointer;
    }
  }
`;

const EmojiIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  svg {
    ${svgPrimaryStyle}
    position: relative;
  }
`;

const emojiList = [
  "😀",
  "😃",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
];

type Props = {
  handleChooseEmoji: (emoji: string) => void;
};

const Emojis: React.FC<Props> = ({ handleChooseEmoji }) => {
  const [open, setOpen] = useState<boolean>(false);

  const emojiPopup = (
    <ContentBox>
      <EmojiPopup>
        {emojiList.map((emoji, idx) => {
          return (
            <span key={idx} onClick={handleChooseEmoji.bind(null, emoji)}>
              {emoji}
            </span>
          );
        })}
      </EmojiPopup>
    </ContentBox>
  );
  return (
    <EmojiWrapper
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Tippy
        content={emojiPopup}
        interactive={true}
        placement={"bottom-end"}
        duration={0}
        offset={[0, 5]}
        trigger="click"
      >
        <EmojiIconWrapper>
          <EmojiIcon />
        </EmojiIconWrapper>
      </Tippy>
    </EmojiWrapper>
  );
};

export default Emojis;
