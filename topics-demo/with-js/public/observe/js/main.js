async function getTopics() {
  try {
    if (
      "browsingTopics" in document &&
      document.featurePolicy.allowsFeature("browsing-topics")
    ) {
      console.log("document.browsingTopics() is supported");
      const topics = await document.browsingTopics();
      console.log(
        "Called from localhost/observe/index.html in iframe:",
        topics,
        "\nNumber of topics: ",
        topics.length
      );
    } else {
      console.log("document.browsingTopics() not supported");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

getTopics();
