export type RootStackParamList = {
  Main: undefined;
  ProductStack: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  GroupBuy: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type ProductStackParamList = {
  ProductDetail: { id: string };
  ProductList: undefined;
  ProductSearch: { query?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}