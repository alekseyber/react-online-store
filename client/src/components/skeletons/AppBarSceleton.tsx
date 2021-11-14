import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";

const AppBarSceleton = () => {
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          }
          title={
            <Skeleton
              animation="wave"
              height={30}
              width="100%"
              style={{ marginBottom: 6 }}
            />
          }
        />
      </Card>
    </>
  );
};

export default AppBarSceleton;
