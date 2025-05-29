import { combineDataProviders } from "react-admin";
import { eventEntityProvider } from "./eventEntity.provider";

const mainProvider = combineDataProviders((resource) => {
    switch (resource) {
      case "event-entity":
        return eventEntityProvider;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  });
  
  export default mainProvider;