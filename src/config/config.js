import configJson from "./config.json";

export const getAuthConfig = () => {
  const audience =
    configJson.AUTH0.AUDIENCE && configJson.AUTH0.AUDIENCE !== "YOUR_API_IDENTIFIER"
      ? configJson.AUTH0.AUDIENCE
      : null;

  return {
    domain: configJson.AUTH0.DOMAIN,
    clientId: configJson.AUTH0.CLIENTID,
    ...(audience ? { audience } : null),
  };
}

export const getApiConfig = () => {
  const base_url = process.env.NODE_ENV === 'production' ? configJson.API.URL_BASE_PROD : configJson.API.URL_BASE_DEV;
  return {
    classrooms: base_url + configJson.API.URL_ALIAS_CLASSROOMS,
    types: base_url + configJson.API.URL_ALIAS_CLASSROOMS_TYPES,
    items: base_url + configJson.API.URL_ALIAS_ITEMS,
    filtering: base_url + configJson.API.URL_ALIAS_CLASSROOMS + configJson.API.URL_ALIAS_CLASSROOMS_FILTERING,
    reservations: base_url + configJson.API.URL_ALIAS_RESERVATIONS,
    reservationsUserOnly: base_url + configJson.API.URL_ALIAS_RESERVATIONS + configJson.API.URL_ALIAS_RESERVATIONS_USER,
  }
}

export const getRouterConfig = () => {
  return {
    aliasHome: process.env.NODE_ENV === 'production' ? configJson.ROUTER.ALIAS_HOME_PROD : configJson.ROUTER.ALIAS_HOME,
    aliasClassrooms: configJson.ROUTER.ALIAS_CLASSROOMS_VIEW,
    aliasReservations: configJson.ROUTER.ALIAS_RESERVATIONS,
    aliasItemsAdm: configJson.ROUTER.ALIAS_ITEMS_ADMIN,
    aliasClassroomsAdm: configJson.ROUTER.ALIAS_CLASSROOMS_ADMIN
  }
}

