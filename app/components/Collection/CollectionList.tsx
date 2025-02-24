import { List } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Collection from "~/models/Collection";
import Error from "~/components/List/Error";
import PaginatedList from "~/components/PaginatedList";
import CollectionItem from "./CollectionItem";

type Props = {
  collections: Collection[];
  fetch?: (options: any) => Promise<Collection[] | undefined>;
  options?: Record<string, any>;
  heading?: React.ReactNode;
  empty?: React.ReactNode;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  showDraft?: boolean;
  showTemplate?: boolean;
};

const CollectionList = React.memo<Props>(function CollectionList({
  empty,
  heading,
  collections,
  fetch,
  options,
  showParentDocuments,
  showCollection,
  showPublished,
  showTemplate,
  showDraft,
  ...rest
}: Props) {
  const { t } = useTranslation();

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={collections}
      renderItem={(item) => (
        <List.Item>
          <CollectionItem
            key={item.id}
            collection={item}
            showPin={!!options?.collectionId}
            showParentDocuments={showParentDocuments}
            showCollection={showCollection}
            showPublished={showPublished}
            showTemplate={showTemplate}
            showDraft={showDraft}
          />
        </List.Item>
      )}
    />
  );

  return (
    <PaginatedList
      aria-label={t("Documents")}
      items={collections}
      empty={empty}
      heading={heading}
      fetch={fetch}
      options={options}
      renderError={(props) => <Error {...props} />}
      renderItem={(item: Collection, _index) => (
        <CollectionItem
          key={item.id}
          collection={item}
          showPin={!!options?.collectionId}
          showParentDocuments={showParentDocuments}
          showCollection={showCollection}
          showPublished={showPublished}
          showTemplate={showTemplate}
          showDraft={showDraft}
        />
      )}
      {...rest}
    />
  );
});

export default CollectionList;
