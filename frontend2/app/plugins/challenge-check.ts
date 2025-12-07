export default defineNuxtPlugin(() => {
	const originalFetch = globalThis.$fetch;
	globalThis.$fetch = originalFetch.create({
		onResponseError: async ({ response }: { response: Response }) => {
			if (response?.status === 403) {
				const cfMitigated = response.headers.get("cf-mitigated");
				if (cfMitigated === "challenge") {
					const route = useRoute();
					const returnPath = route.fullPath;
					const params = new URLSearchParams([["r", returnPath]]);
					location.href = `/challenge?${params.toString()}`;
				}
			}
		}
	});
});
