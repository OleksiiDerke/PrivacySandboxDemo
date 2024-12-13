// intercept navigator.runAdAuction and print parameters to console
(() => {
  var originalRunAdAuction = navigator.runAdAuction;
  navigator.runAdAuction = function (...args) {
    console.log(
      "%c runAdAuction",
      "background: cyan; border: 2px; border-radius: 3px",
      ...args
    );
    return originalRunAdAuction.apply(navigator, args);
  };
})();

const queryParams = {
  contextualBidValue: 0.01,
  rtbhMultiplier: 100,
  overrideWinner: false,
  addOpenX: false,
  openxBidValue: 1,
};

const queryKeyMap = {
  ctx: "contextualBidValue",
  rtbhm: "rtbhMultiplier",
  ovwwin: "overrideWinner",
  addox: "addOpenX",
  oxcpm: "openxBidValue",
};
const reverseMap = Object.fromEntries(
  Object.entries(queryKeyMap).map(([key, value]) => [value, key])
);
// console.log('reverseMap=',reverseMap)

setQueryParams();
init();
setupContextualResponse();

function setQueryParams() {
  const searchParams = new URLSearchParams(document.location.search);
  searchParams.forEach((value, key) => {
    queryParams[queryKeyMap[key]] = value;
  });
}

function addExampleControls(requestBids) {
  const form = document.createElement("form");
  form.method = "GET";
  document.body.appendChild(form);
  form.addEventListener("submit", function () {
    [...form.elements].filter((e) => e.hasAttribute("name"));
  });

  const ctl = document.createElement("div");
  ctl.innerHTML = `
    <span>
       Simulate contextual bid (<abbr title="Does not respect the multiplier">?</abbr>):
        <input name="${reverseMap.contextualBidValue}" class="cpm" type="number" step="any" min="0" style="width: 5.5em; text-align: right" value="${queryParams.contextualBidValue}"/>
        CPM
        <button type="button" class="bid" style="margin-left: 0.5em">BID</button>
    </span>
  `;
  ctl.className = "formrow";
  form.appendChild(ctl);
  ctl.querySelector(".bid").addEventListener("click", function (ev) {
    const cpm = ctl.querySelector(".cpm").value;
    if (cpm) {
      queryParams.contextualBidValue = parseFloat(cpm, 10);
      setupContextualResponse();
    }
    requestBids();
  });

  const rtbhMult = document.createElement("div");
  rtbhMult.innerHTML = `
    <span>
       RTB House bid value multiplier:
        <input name="${reverseMap.rtbhMultiplier}" class="rtbhMult" type="number" step="any" min="0" style="width: 5.5em; text-align: right" value="${queryParams.rtbhMultiplier}"/>
    </span>
  `;
  rtbhMult.className = "formrow";
  form.appendChild(rtbhMult);
  rtbhMult.querySelector(".rtbhMult").addEventListener("change", function (ev) {
    const mult = rtbhMult.querySelector(".rtbhMult").value;
    queryParams.rtbhMultiplier = parseFloat(mult, 10);
    // requestBids();
  });

  const ovwwin = document.createElement("div");
  ovwwin.innerHTML = `
  <span>
      <label><input class="ovwin" type="checkbox" name="${
        reverseMap.overrideWinner
      }" ${
    queryParams.overrideWinner ? "checked" : ""
  } value="true"> Override winner</label>
       (<a href="https://docs.prebid.org/dev-docs/modules/topLevelPaapi.html#automatically-render-paapi-winners-instead-of-contextual-bids" target="_blank"
       title="When overrideWinner is enabled, rendering a “normal” Prebid bid will instead render a PAAPI bid, if the PAAPI auction for the slot yielded a winner. This is an easy way include the result of PAAPI auctions without having to change the rendering logic."
       >what's this?</a>)
  </span>
  `;
  ovwwin.className = "formrow";
  form.appendChild(ovwwin);
  ovwwin.querySelector(".ovwin").addEventListener("change", function (ev) {
    queryParams.overrideWinner = ev.target.checked;
    // requestBids();
  });

  const addopenx = document.createElement("div");
  addopenx.innerHTML = `
  <span>
      <label><input class="addox" type="checkbox" name="${
        reverseMap.addOpenX
      }" ${
    queryParams.addOpenX ? "checked" : ""
  } value="true"> Add OpenX bid</label>
       (<span title="Joins the OpenX interest group and adds OpenX bid with the value set in the adjacent input">what's this?</span>)
       <input ${queryParams.addOpenX ? "" : "disabled"} name="${
    reverseMap.openxBidValue
  }" class="cpm" type="number" step="any" min="0" style="width: 5.5em; text-align: right" value="${
    queryParams.openxBidValue
  }"/>
        CPM
  </span>
  `;

  addopenx.className = "formrow";
  form.appendChild(addopenx);

  addopenx.querySelector(".cpm").addEventListener("change", function (ev) {
    const cpm = ev.target.value;
    if (cpm) {
      queryParams.openxBidValue = parseFloat(cpm, 10);
      setupContextualResponse();
    }
    // requestBids();
  });
  addopenx.querySelector(".addox").addEventListener("change", function (ev) {
    queryParams.addOpenX = ev.target.checked;
    addopenx.querySelector(".cpm").disabled = !queryParams.addOpenX;
    // requestBids();
  });

  let ox = document.getElementById("openxframe");
  if (
    queryParams.addOpenX &&
    (!ox || ox.dataset.timestamp < +new Date() - 3600000)
  ) {
    ox = document.createElement("div");
    ox.id = "openxframe";
    ox.dataset.timestamp = +new Date();
    ox.innerHTML = `<iframe width="1" height="1" frameborder="0" src="https://privacysandbox.openx.net/fledge/advertiser"></iframe>`;
    form.appendChild(ox);
  }

  const reload = document.createElement("div");
  reload.innerHTML = `<input type="submit" value="Reload">`;
  reload.className = "formrow";
  form.appendChild(reload);
}

function init() {
  window.pbjs = window.pbjs || { que: [] };
  window.pbjs.que.push(() => {
    pbjs.aliasBidder("optable", "contextual");
    [
      "auctionInit",
      "auctionTimeout",
      "auctionEnd",
      "bidAdjustment",
      "bidTimeout",
      "bidRequested",
      "bidResponse",
      "bidRejected",
      "noBid",
      "seatNonBid",
      "bidWon",
      "bidderDone",
      "bidderError",
      "setTargeting",
      "beforeRequestBids",
      "beforeBidderHttp",
      "requestBids",
      "addAdUnits",
      "adRenderFailed",
      "adRenderSucceeded",
      "tcf2Enforcement",
      "auctionDebug",
      "bidViewable",
      "staleRender",
      "billableEvent",
      "bidAccepted",
      "paapiRunAuction",
      "paapiBid",
      "paapiNoBid",
      "paapiError",
    ].forEach((evt) => {
      pbjs.onEvent(evt, (arg) => {
        console.log("Event:", evt, arg);
        if (evt === "paapiRunAuction") {
          // console.log('===paapiRunAuction===', arg.auctionConfig.componentAuctions.map(a => Object.keys(a.interestGroupBuyers)));
          try {
            arg.auctionConfig.auctionSignals.prebid.rtbhMultiplier = Number(
              queryParams.rtbhMultiplier
            );
            // Number(
            //   document.querySelector(".rtbhMult").value
            // );
          } catch (e) {}
          console.log(
            "===paapiRunAuction===",
            arg.auctionConfig?.auctionSignals?.prebid
          );
        }
        // console.log('===paapiRunAuction===', arg.auctionConfig.componentAuctions.filter(a => a.interestGroupBuyers.includes('https://f.creativecdn.com')));
      });
    });
  });
}
function setupContextualResponse() {
  const cpm = Number(queryParams.contextualBidValue);
  const openxBidValue = Number(queryParams.openxBidValue);
  const openxBidModififer = 0.95;
  pbjs.que.push(() => {
    pbjs.setConfig({
      enableTIDs: true,
      debugging: {
        enabled: true,
        intercept: [
          {
            when: {
              bidder: "contextual",
            },
            then: {
              cpm,
              currency: "USD",
            },
          },
          {
            when: {
              bidder: "openx",
            },
            then: {
              cpm: cpm,
              currency: "USD",
            },
            paapi() {
              return [
                {
                  seller: "https://privacysandbox.openx.net",
                  decisionLogicURL:
                    "https://privacysandbox.openx.net/fledge/decision-logic-component.js",
                  sellerSignals: {
                    floor: cpm,
                    currency: "USD",
                    auctionTimestamp: new Date().getTime(),
                    publisherId: "537143056",
                    adUnitId: "538703464",
                  },
                  interestGroupBuyers: [
                    "https://privacysandbox.openx.net",
                    // ...(appendRTBHAsBuyer  ? ['https://f.creativecdn.com'] : [])
                  ],
                  perBuyerSignals: {
                    ...(openxBidValue > 0
                      ? {
                          "https://privacysandbox.openx.net": {
                            bid: openxBidValue / openxBidModififer,
                          },
                        }
                      : {}),
                    // ...(appendRTBHAsBuyer  ? {'https://f.creativecdn.com': {
                    //     'bid': rtbhouseBidValue/openxBidModififer
                    // }} : {}),
                  },
                  sellerCurrency: "USD",
                },
              ];
            },
          },
        ],
      },
    });
  });
}
