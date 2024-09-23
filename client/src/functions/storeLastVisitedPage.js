export const storeLastVisitedPage = () => {
    localStorage.setItem('lastVisitedPage', window.location.pathname);
};