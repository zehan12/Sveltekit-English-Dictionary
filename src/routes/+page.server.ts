import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/schema";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async () => {
    const form = await superValidate(zod(formSchema));
    return { form };
}) satisfies PageServerLoad

