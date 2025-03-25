import styled from "styled-components";
import PropTypes from "prop-types";

export function CustomModal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <Backdrop>
      <ModalContainer>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>{children}</ModalContent>
        <CloseButton onClick={onClose}>Cerrar</CloseButton>
      </ModalContainer>
    </Backdrop>
  );
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.bgtr};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

const ModalContent = styled.div`
  margin-bottom: 1rem;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background-color: ${({ theme }) => theme.bgtr};
  color: ${({ theme }) => theme.cancelText};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;
