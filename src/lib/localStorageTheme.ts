export const getDayStateLocalStorageTheme = () => {
  try {
    const theme = localStorage.getItem('theme');
    if (!theme) {
      return 'day';
    }
    return theme === 'light' ? 'day' : 'night';
  }catch(ex){
    return 'day';
  }
}
