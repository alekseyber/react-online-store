import { useParams, useNavigate } from "react-router-dom";

const useAliasParams = (): string => {
  const { alias } = useParams();
  const navigate = useNavigate();
  if (!alias) {
    navigate("/404", { replace: true });
  }
  return alias || "";
};

const useIdParams = (): string => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/404", { replace: true });
  }
  return id || "";
};

export { useAliasParams, useIdParams };
