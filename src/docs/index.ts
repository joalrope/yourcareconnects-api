import { definition } from "./basicInfo";
import { servers } from "./servers";
import { apis } from "./apis";
import { tags } from "./tags";
import { components } from "./components";
import { paths } from "./Paths";

export const options = {
  ...definition,
  ...servers,
  ...tags,
  ...apis,
  ...components,
  ...paths,
};
