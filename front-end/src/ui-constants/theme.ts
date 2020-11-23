import getThemeColors from "./themeColors";
interface Theme {
  [key: string]: string
}
const themeValues: Theme = {
  aboutPic:`/images/meWithIzzy.png`,
  contactPicLarge:`/images/sheldonfrith-contact-600.jpg`,
  contactPicSmall:'images/sheldonfrith-contact-300.jpg',
  searchBarPic:`/images/Searchbar.svg`,
  arrowGraphicsPic:`/images/ArrowsForAnimation.svg`,
  backgroundTransitionPic:`/images/BackgroundWave.svg`,
  primaryBreakpoint:`500`,
  largerBreakpoint: `800`,
  fontFamHeader: `Marmelad`,
  fontFamBody:`Noto Sans`,
  font1:`0.833rem`,
  font2:`1rem`,
  font3:`1.2rem`,
  font4:`1.44rem`,
  font5:`1.728rem`,
  font6:`2.074rem`,
  font7:`2.488rem`,
  ...getThemeColors(),
      };


export default function getTheme (): Theme {
    return themeValues;
}