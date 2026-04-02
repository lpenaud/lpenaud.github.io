export const { BUILD_ENV } = {
  BUILD_ENV: "DEV",
  ...Deno.env.toObject(),
};

export const IS_DEV = BUILD_ENV === "DEV";

export const BUILD_DIR = "build";
