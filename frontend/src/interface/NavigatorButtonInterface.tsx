export default interface NavigatorButtonInterface {
  icon: any;
  text: string;
  onClickHandler: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
