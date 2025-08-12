import { combineDataProviders } from "react-admin";
import { eventEntityProvider } from "./eventEntity.provider";
import { transactionProvider } from "./transaction.provider";

const mainProvider = combineDataProviders((resource) => {
    switch (resource) {
      case "event-entity":
        return eventEntityProvider;
      case "transactions":
        return transactionProvider;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  });
  
  export default mainProvider;