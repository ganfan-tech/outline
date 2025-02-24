import {
  useFocusEffect,
  useRovingTabIndex,
} from "@getoutline/react-roving-tabindex";
import { Card, ConfigProvider } from "antd";
import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import EventBoundary from "@shared/components/EventBoundary";
import { s } from "@shared/styles";
import Collection from "~/models/Collection";
import Flex from "~/components/Flex";
import Highlight from "~/components/Highlight";
import NudeButton from "~/components/NudeButton";
import { AnimatedStar } from "~/components/Star";
import useBoolean from "~/hooks/useBoolean";
import useCurrentUser from "~/hooks/useCurrentUser";
import { hover } from "~/styles";
import Icon from "../Icon";
import CollectionLink from "../Sidebar/components/CollectionLink";

type Props = {
  collection: Collection;
  highlight?: string | undefined;
  context?: string | undefined;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  showPin?: boolean;
  showDraft?: boolean;
  showTemplate?: boolean;
};

// const SEARCH_RESULT_REGEX = /<b\b[^>]*>(.*?)<\/b>/gi;

// function replaceResultMarks(tag: string) {
//   // don't use SEARCH_RESULT_REGEX directly here as it causes an infinite loop
//   return tag.replace(new RegExp(SEARCH_RESULT_REGEX.source), "$1");
// }

function CollectionItem(props: Props, ref: React.RefObject<HTMLAnchorElement>) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const [menuOpen, handleMenuOpen, handleMenuClose] = useBoolean();

  let itemRef: React.Ref<HTMLAnchorElement> =
    React.useRef<HTMLAnchorElement>(null);
  if (ref) {
    itemRef = ref;
  }

  const { focused, ...rovingTabIndex } = useRovingTabIndex(itemRef, false);
  useFocusEffect(focused, itemRef);

  const {
    collection,
    showParentDocuments,
    showCollection,
    showPublished,
    showPin,
    showDraft = true,
    showTemplate,
    highlight,
    context,
    ...rest
  } = props;
  // const queryIsInTitle =
  //   !!highlight &&
  //   !!document.title.toLowerCase().includes(highlight.toLowerCase());
  // const canStar = !document.isArchived && !document.isTemplate;

  const handleDisclosureClick = React.useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
      // setExpanded((prevExpanded) => !prevExpanded);
    },
    []
  );
  return (
    <Link to={collection.path}>
      <ConfigProvider theme={{ token: {} }}>
        <Card>
          <Card.Meta
            avatar={<Icon value={collection.icon} color={collection.color} />}
            title={collection.name}
            // description={collection.color}
          />
        </Card>
      </ConfigProvider>
    </Link>
  );

  return (
    <CollectionLink
      collection={collection}
      expanded={false}
      activeDocument={undefined}
      onDisclosureClick={handleDisclosureClick}
    />
  );
}

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
`;

const Actions = styled(EventBoundary)`
  display: none;
  align-items: center;
  margin: 8px;
  flex-shrink: 0;
  flex-grow: 0;
  color: ${s("textSecondary")};

  ${NudeButton} {
    &: ${hover}, &[aria-expanded= "true"] {
      background: ${s("sidebarControlHoverBackground")};
    }
  }

  ${breakpoint("tablet")`
    display: flex;
  `};
`;

const DocumentLink = styled(Link)<{
  $isStarred?: boolean;
  $menuOpen?: boolean;
}>`
  display: flex;
  align-items: center;
  margin: 10px -8px;
  padding: 6px 8px;
  border-radius: 8px;
  max-height: 50vh;
  width: calc(100vw - 8px);
  cursor: var(--pointer);

  &:focus-visible {
    outline: none;
  }

  ${breakpoint("tablet")`
    width: auto;
  `};

  ${Actions} {
    opacity: 0;
  }

  ${AnimatedStar} {
    opacity: ${(props) => (props.$isStarred ? "1 !important" : 0)};
  }

  &:${hover},
  &:active,
  &:focus,
  &:focus-within {
    background: ${s("listItemHoverBackground")};

    ${Actions} {
      opacity: 1;
    }

    ${AnimatedStar} {
      opacity: 0.5;

      &:${hover} {
        opacity: 1;
      }
    }
  }

  ${(props) =>
    props.$menuOpen &&
    css`
      background: ${s("listItemHoverBackground")};

      ${Actions} {
        opacity: 1;
      }

      ${AnimatedStar} {
        opacity: 0.5;
      }
    `}
`;

const Heading = styled.h3<{ rtl?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.rtl ? "flex-end" : "flex-start")};
  align-items: center;
  margin-top: 0;
  margin-bottom: 0.25em;
  white-space: nowrap;
  color: ${s("text")};
  font-family: ${s("fontFamily")};
  font-weight: 500;
`;

const StarPositioner = styled(Flex)`
  margin-left: 4px;
  align-items: center;
`;

const Title = styled(Highlight)`
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultContext = styled(Highlight)`
  display: block;
  color: ${s("textSecondary")};
  font-size: 15px;
  margin-top: -0.25em;
  margin-bottom: 0.25em;
  max-height: 90px;
  overflow: hidden;
`;

export default observer(React.forwardRef(CollectionItem));
