function logPrefix(scope) {
  return [
    `%c PAAPI %c ${scope} %c`,
    "color: green;  background-color:yellow; border: 1px solid black",
    "color: blue; border:1px solid black",
    "",
  ];
}
// const scores = {};

function scoreAd(
  adMetadata,
  bid,
  auctionConfig,
  trustedScoringSignals,
  browserSignals,
  directFromSellerSignals
) {
  console.group(
    ...logPrefix("scoreAd"),
    "Buyer:",
    browserSignals.interestGroupOwner
  );
  // console.log('===>auctionConfig',JSON.stringify(auctionConfig))
  // console.log('===>browserSignals',JSON.stringify(browserSignals))

  console.log(
    "Context:",
    JSON.stringify(
      {
        adMetadata,
        bid,
        auctionConfig: {
          ...auctionConfig,
          componentAuctions: "[omitted]",
        },
        trustedScoringSignals,
        browserSignals,
        directFromSellerSignals,
      },
      " ",
      " "
    )
  );

  const multiplier =
    auctionConfig?.auctionSignals?.prebid?.rtbhMultiplier ?? 100;
  if (browserSignals.interestGroupOwner.includes("creativecdn.com"))
    console.log("RTBH multiplier = ", multiplier);

  const result = {
    desirability: browserSignals.interestGroupOwner.includes("creativecdn.com")
      ? bid * multiplier
      : bid,
    // desirability: browserSignals.interestGroupOwner.includes('creativecdn.com') ? 100 : bid,
    allowComponentAuction: true,
  };
  const { bidfloor, bidfloorcur } = auctionConfig.auctionSignals?.prebid || {};
  if (bidfloor) {
    if (
      browserSignals.bidCurrency !== "???" &&
      browserSignals.bidCurrency !== bidfloorcur
    ) {
      console.log(
        `Floor currency (${bidfloorcur}) does not match bid currency (${browserSignals.bidCurrency}), and currency conversion is not yet implemented. Rejecting bid.`
      );
      result.desirability = -1;
      // } else if (bid < bidfloor) {
    } else if (result.desirability < bidfloor) {
      console.log(
        `Bid (${result.desirability}) lower than contextual winner/floor (${bidfloor}). Rejecting bid.`
      );
      result.desirability = -1;
      result.rejectReason = "bid-below-auction-floor";
    }
  }
  console.log("Result:", result);
  //scores[browserSignals.interestGroupOwner] = result;
  //console.log(`Score for = ${browserSignals.interestGroupOwner}`, result);
  console.groupEnd();

  return result;
}

function reportResult(auctionConfig, browserSignals) {
  console.group(...logPrefix("reportResult"));
  console.log(
    "Context",
    JSON.stringify({ auctionConfig, browserSignals }, " ", " ")
  );
  console.groupEnd();
  sendReportTo(
    `${auctionConfig.seller}/report/win?${Object.entries(browserSignals)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&")}`
  );
  return {};
}
