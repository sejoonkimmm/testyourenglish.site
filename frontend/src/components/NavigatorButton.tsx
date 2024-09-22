import styled from "styled-components";
import NavigatorButtonInterface from "../interface/NavigatorButtonInterface";

const Wrapper = styled.button`
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.5rem;
  font-weight: 800;
  padding: 0 6px;
  display: flex;
`;

const IconWrapper = styled.div`
  margin-right: 8px;
`;

const Text = styled.div`

`;

const NavigatorButton: React.FC<NavigatorButtonInterface> = ({
  icon: Icon,
  text,
  onClickHandler
}) => {
  return (
    <Wrapper onClick={onClickHandler}>
      <IconWrapper>
        <Icon size={24} />  {/* icon을 JSX 컴포넌트로 렌더링 */}
      </IconWrapper>
      <Text>{text}</Text>
    </Wrapper>
  )
}

export default NavigatorButton;