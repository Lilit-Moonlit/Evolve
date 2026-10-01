/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<
      string,
      unknown
    > {
      StaticRoutes:
        | `/`
        | `/..\..\..\packages\contracts\script\deploy-all`
        | `/..\..\web\src\components\NetworkSelector`
        | `/..\..\web\src\lib\bridge`
        | `/_sitemap`
        | `/auth`
        | `/chat`
        | `/documents`
        | `/home`
        | `/language-selector`
        | `/mode2`
        | `/mode3`
        | `/onboarding`
        | `/profile`
        | `/settings`
        | `/swipe`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
