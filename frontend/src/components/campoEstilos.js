export function describirPor(...ids) {
  return ids.filter(Boolean).join(" ") || undefined;
}

export const CLASES_CONTROL =
  "block w-full min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-white border rounded-md shadow-sm transition-colors duration-300 placeholder:text-slate-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500";

export const CLASES_CONTROL_NORMAL =
  "border-campo hover:border-slate-500 focus-visible:border-upla-600 focus-visible:outline-upla-600 dark:border-slate-500 dark:hover:border-slate-400 dark:focus-visible:border-[#7FD0FF] dark:focus-visible:outline-[#7FD0FF]";

export const CLASES_CONTROL_ERROR =
  "border-red-600 hover:border-red-700 focus-visible:border-red-700 focus-visible:outline-red-600 dark:border-red-500 dark:hover:border-red-400 dark:focus-visible:border-red-400 dark:focus-visible:outline-red-400";

export function clasesControl(error, extra = "") {
  return `${CLASES_CONTROL} ${error ? CLASES_CONTROL_ERROR : CLASES_CONTROL_NORMAL} ${extra}`;
}
