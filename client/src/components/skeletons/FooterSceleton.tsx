import { styled } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Container from "@mui/material/Container";

const CssFooter = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.darkprimary.main,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  color: theme.palette.primary.contrastText,
}));

const FooterSceleton = () => {
  return (
    <CssFooter>
      <Container fixed maxWidth="xl">
        <Skeleton
          sx={(theme) => ({ bgcolor: theme.palette.primary.contrastText })}
          height={15}
          width="100%"
          style={{ marginTop: 6 }}
        />
        <Skeleton
          sx={(theme) => ({ bgcolor: theme.palette.primary.contrastText })}
          height={15}
          width="100%"
          style={{ marginTop: 6 }}
        />
      </Container>
    </CssFooter>
  );
};

export default FooterSceleton;
