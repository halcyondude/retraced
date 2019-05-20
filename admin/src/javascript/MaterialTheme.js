import {black, blueGrey800, blueGrey500, green600, red500, darkBlack, grey50, blue100, grey300, cyan500} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

export default {
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: black,
    primary2Color: blueGrey800,
    primary3Color: blueGrey500,
    accent1Color: green600,
    accent2Color: red500,
    accent3Color: darkBlack,
    textColor: darkBlack,
    alternateTextColor: grey50,
    canvasColor: grey50,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    hoverColor: green600
  },
  tableRow: {
    hoverColor: blue100
  }
};
