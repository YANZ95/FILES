// 테마별 공통 css 를 관리할거임
export const lightTheme = {
  bgColor: "#f8f7f4",
  textColor: "#31302e",
  borderColor: "1px solid #eaeaea",
};
export const darkTheme = {
  bgColor: "#1e1e22",
  textColor: "#f8f7f4",
  borderColor: "1px solid #2c2d33",
};
export const theme = {
  lightTheme,
  darkTheme,
};
// export const theme => 객체 안에 객체를 넣어둠
// 테마를 엄처나게 넣고 싶다 이러면 버튼 이런 건 안 되고 셀렉트 박스 같은 걸로 해야됨
