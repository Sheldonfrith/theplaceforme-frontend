interface Colors {
    [colorName: string]: string
}

const colors: Colors  = {
    darkOverlay: 'rgb(1, 2, 3,0.5)',
    lightOverlay: 'rgb(200,200,200,0.5)',
    whiteOverlay: 'rgb(255,255,255,0.5)',
    primaryAccent: `#CD4235`,
    black:`#1A0000`,
    white:`#F8F4FF`,
    grey:`#8B8680`,
    veryLightYellow:`#FEF8B7`,
    whiteYellow:'#F5EA77',
    yellow:'#F0E034',
    greenYellow:'#D0EE23',
    green:'#65F256',
    greenTurquois:'#12ED80',
    blueTurquois:'#30CFAF',
    lightBlue:'#37ABC8',
    blue:'#4A7AFE',
    bluePurple:'#8158FC',
    purple:'#AB24FF',
    pink:'#E62BE6',
    pinkRed:'#FF5073',
    // red:'#FE5243',
    red: '#CD4235',
    // red: `#EA2B1F`,
    orange:'#FF7124',
};

const getThemeColors = ():Colors => {
    const returnColors = colors;
    //add colors dependent on the defaults defined above...
    returnColors['primaryLightBackground'] = `radial-gradient(50% 50% at 50% 50%, ${colors.white} 0%, ${colors.veryLightYellow} 100%)`;
    return colors;
}

export const getSingleColor=(colorName: string): string =>{
    const color = colors[colorName];
    if (!color) throw new Error('error, colorname not found in theme colors');
    return color;
}


export default getThemeColors;