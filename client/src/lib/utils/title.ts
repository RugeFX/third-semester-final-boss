import { APP_NAME } from "./constants";

export const appTitle = (content?: string) =>
	content ? `${content} - ${APP_NAME}` : APP_NAME;

export const routeTitle = (content?: string) => ({
	title: appTitle(content),
});
