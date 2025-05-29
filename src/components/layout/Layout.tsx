import { Layout } from "react-admin";
import AppBarComponent from "./AppBar";

const EmptyComponent = () => null;

const CustomLayout = (props: any) => {
  return (
    <Layout
      {...props}
      appBar={AppBarComponent}
      menu={EmptyComponent}      
      sidebar={EmptyComponent}
    />
  );
};

export default CustomLayout;
