import { FC } from "react";
import Container from "@mui/material/Container";
import { Breakpoint } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export interface IPageSceletonProps {
  containerOn?: boolean;
  maxWidth?: false | Breakpoint;
  containerFixed?: boolean;
  title?: boolean;
}

interface HocContainerProps {
  containerOn: boolean;
  maxWidth: false | Breakpoint;
  containerFixed: boolean;
}

const HocContainer: FC<HocContainerProps> = ({
  children,
  containerOn,
  maxWidth,
  containerFixed,
}) => {
  return containerOn ? (
    <Container fixed={containerFixed} maxWidth={maxWidth}>
      {children}
    </Container>
  ) : (
    <>{children}</>
  );
};

const PageSceleton: FC<IPageSceletonProps> = ({
  containerOn = true,
  maxWidth = "xl",
  containerFixed = false,
  title = false,
  children,
}) => {
  const hocProps = { containerOn, maxWidth, containerFixed };
  return (
    <HocContainer {...hocProps}>
      {title && (
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{
            margin: (theme) => `${theme.spacing(4)} auto ${theme.spacing(2)}`,
            width: "30%",
          }}
        >
          <Skeleton />
        </Typography>
      )}
      {children}
    </HocContainer>
  );
};

export default PageSceleton;
