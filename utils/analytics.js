import ReactGA from 'react-ga4';

export const initGA = (trackingId) => {
    ReactGA.initialize(trackingId);
};

export const logPageView = (page) => {
    ReactGA.send({ hitType: 'pageview', page });
};

export const logEvent = (category = '', action = '', label = '') => {
    if (category && action) {
        ReactGA.event({ category, action, label });
    }
};

export const logException = (description = '', fatal = false) => {
    if (description) {
        ReactGA.exception({ description, fatal });
    }
};