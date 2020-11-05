import React from "react";
//import PropTypes from "prop-types";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import ModalTitle from "../containers/modaldialog/modaletitle/ModalTitle";

interface ModalBaseProps {
  handleClose: () => void;
  title?: string;
  actionsOn?: boolean;
  actionsNode?: React.ReactNode;
  actionsBtnText?: string;
}

export interface IChildrenNodeBaseProps {
  handleClose: () => void;
}

const ModalBase: React.FC<ModalBaseProps> = (props) => {
  const {
    children,
    handleClose,
    title = "",
    actionsOn = true,
    actionsNode,
    actionsBtnText = "Закрыть",
  } = props;
  return (
    <>
      <ModalTitle handleClose={handleClose}>{title}</ModalTitle>
      <DialogContent dividers={true}>{children}</DialogContent>
      {actionsOn && (
        <DialogActions>
          {actionsNode !== undefined && actionsNode}
          {actionsNode === undefined && (
            <Button onClick={handleClose} color="primary">
              {actionsBtnText}
            </Button>
          )}
        </DialogActions>
      )}
    </>
  );
};

// ModalBase.defaultProps = {
//     title: "",
//     actionsOn: true,
//     actionsBtnText: 'Закрыть'
// };

// ModalBase.propTypes = {
//     handleClose: PropTypes.func.isRequired,
//     children: PropTypes.element.isRequired,
//     title: PropTypes.string,
//     actionsOn: PropTypes.bool,
//     actionsNode: PropTypes.node,
//     actionsBtnText: PropTypes.string,
// };

export default ModalBase;
