import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import authStore from "@/lib/store/auth";

export const AXIOS_INSTANCE = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Accept: "application/json",
	},
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
	const { token } = authStore.getState();

	if (token) config.headers.Authorization = `Bearer ${token}`;

	return config;
});

export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = axios.CancelToken.source();

	const promise = AXIOS_INSTANCE({
		...config,
		...options,
		cancelToken: source.token,
	}).then(({ data }) => data);

	// @ts-expect-error: cancel is not a valid property of the Promise type, but we use it in the client
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
