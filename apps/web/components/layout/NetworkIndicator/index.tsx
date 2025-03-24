import "./styles.scss";

export const NetworkIndicator = ({
  networkId,
  networkLabel,
}: {
  networkId: string;
  networkLabel: string;
}) => {
  return (
    <div className="NetworkIndicator">
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      <span
        className="NetworkIndicator__dot"
        aria-hidden="true"
        data-network={networkId}
      ></span>
      {networkLabel}
    </div>
  );
};
